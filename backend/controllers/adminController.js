import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';

// @desc  Get dashboard stats
// @route GET /api/admin/dashboard
// @access Private (admin)
export const getDashboard = async (req, res, next) => {
      try {
            const [
                  totalUsers, totalCitizens, totalOfficers,
                  totalComplaints, resolvedComplaints, pendingComplaints, emergencyComplaints,
                  departments, recentComplaints, recentUsers,
            ] = await Promise.all([
                  User.countDocuments({ isActive: true }),
                  User.countDocuments({ role: 'citizen', isActive: true }),
                  User.countDocuments({ role: 'officer', isActive: true }),
                  Complaint.countDocuments(),
                  Complaint.countDocuments({ status: 'resolved' }),
                  Complaint.countDocuments({ status: { $in: ['pending', 'assigned', 'in_progress'] } }),
                  Complaint.countDocuments({ isEmergency: true }),
                  Department.find({ isActive: true }).select('name slug stats color icon'),
                  Complaint.find().sort({ createdAt: -1 }).limit(10)
                        .populate('citizen', 'name email')
                        .populate('department', 'name'),
                  User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
            ]);

            res.status(200).json({
                  success: true,
                  dashboard: {
                        users: { total: totalUsers, citizens: totalCitizens, officers: totalOfficers },
                        complaints: {
                              total: totalComplaints, resolved: resolvedComplaints,
                              pending: pendingComplaints, emergency: emergencyComplaints,
                              resolutionRate: totalComplaints > 0
                                    ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0,
                        },
                        departments,
                        recentComplaints,
                        recentUsers,
                  },
            });
      } catch (error) { next(error); }
};

// @desc  Get all users
// @route GET /api/admin/users
// @access Private (admin)
export const getAllUsers = async (req, res, next) => {
      try {
            const { role, page = 1, limit = 20, search, isActive } = req.query;
            const query = {};
            if (role) query.role = role;
            if (isActive !== undefined) query.isActive = isActive === 'true';
            if (search) query.$or = [
                  { name: { $regex: search, $options: 'i' } },
                  { email: { $regex: search, $options: 'i' } },
            ];

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await User.countDocuments(query);
            const users = await User.find(query)
                  .select('-password -aadhaarNumber -govtIdNumber -resetPasswordToken')
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(parseInt(limit));

            res.status(200).json({
                  success: true, total,
                  page: parseInt(page),
                  totalPages: Math.ceil(total / parseInt(limit)),
                  users,
            });
      } catch (error) { next(error); }
};

// @desc  Toggle user active status
// @route PUT /api/admin/users/:id/toggle
// @access Private (admin)
export const toggleUserStatus = async (req, res, next) => {
      try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot deactivate admin accounts' });

            user.isActive = !user.isActive;
            await user.save({ validateBeforeSave: false });

            await AuditLog.create({
                  action: 'admin_action',
                  performedBy: req.user._id,
                  targetModel: 'User',
                  targetId: user._id,
                  details: { action: user.isActive ? 'activated' : 'deactivated', targetEmail: user.email },
                  ipAddress: req.ip,
            });

            res.status(200).json({
                  success: true,
                  message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
                  isActive: user.isActive,
            });
      } catch (error) { next(error); }
};

// @desc  Get all departments
// @route GET /api/admin/departments
// @access Private (admin)
export const getDepartments = async (req, res, next) => {
      try {
            const departments = await Department.find()
                  .populate('headOfficer', 'name email')
                  .sort({ name: 1 });
            res.status(200).json({ success: true, departments });
      } catch (error) { next(error); }
};

// @desc  Update department
// @route PUT /api/admin/departments/:id
// @access Private (admin)
export const updateDepartment = async (req, res, next) => {
      try {
            const { name, description, slaHours, contactEmail, contactPhone, isActive } = req.body;
            const dept = await Department.findByIdAndUpdate(
                  req.params.id,
                  { name, description, slaHours, contactEmail, contactPhone, isActive },
                  { new: true, runValidators: true }
            );
            if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
            res.status(200).json({ success: true, message: 'Department updated', department: dept });
      } catch (error) { next(error); }
};

// @desc  Get audit logs
// @route GET /api/admin/audit-logs
// @access Private (admin)
export const getAuditLogs = async (req, res, next) => {
      try {
            const { page = 1, limit = 20 } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await AuditLog.countDocuments();
            const logs = await AuditLog.find()
                  .populate('performedBy', 'name email role')
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(parseInt(limit));

            res.status(200).json({
                  success: true, total,
                  page: parseInt(page),
                  totalPages: Math.ceil(total / parseInt(limit)),
                  logs,
            });
      } catch (error) { next(error); }
};

// @desc  Get platform analytics
// @route GET /api/admin/analytics
// @access Private (admin)
export const getPlatformAnalytics = async (req, res, next) => {
      try {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

            const [
                  complaintsByDay,
                  complaintsByCategory,
                  complaintsByStatus,
                  avgResolutionTime,
                  topDepts,
            ] = await Promise.all([
                  Complaint.aggregate([
                        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                        { $sort: { _id: 1 } },
                  ]),
                  Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
                  Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
                  Complaint.aggregate([
                        { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
                        { $project: { hours: { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000] } } },
                        { $group: { _id: null, avgHours: { $avg: '$hours' } } },
                  ]),
                  Department.find({ isActive: true })
                        .select('name stats color')
                        .sort({ 'stats.resolvedComplaints': -1 })
                        .limit(5),
            ]);

            res.status(200).json({
                  success: true,
                  analytics: {
                        complaintsByDay,
                        complaintsByCategory,
                        complaintsByStatus,
                        avgResolutionHours: avgResolutionTime[0]?.avgHours?.toFixed(1) || 0,
                        topDepartments: topDepts,
                  },
            });
      } catch (error) { next(error); }
};
