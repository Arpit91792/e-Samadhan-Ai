import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import { notifyStatusUpdate } from '../services/notificationService.js';
import { validateStatusUpdate } from '../validators/complaintValidator.js';

// @desc  Get officer dashboard
// @route GET /api/officer/dashboard
// @access Private (officer)
export const getOfficerDashboard = async (req, res, next) => {
      try {
            const dept = await Department.findOne({ slug: req.user.department });
            const deptFilter = dept ? { department: dept._id } : { assignedOfficer: req.user._id };

            const [assigned, inProgress, resolved, overdue, recent] = await Promise.all([
                  Complaint.countDocuments({ ...deptFilter, status: 'assigned' }),
                  Complaint.countDocuments({ ...deptFilter, status: 'in_progress' }),
                  Complaint.countDocuments({ ...deptFilter, status: 'resolved' }),
                  Complaint.countDocuments({
                        ...deptFilter,
                        status: { $in: ['assigned', 'in_progress'] },
                        dueDate: { $lt: new Date() },
                  }),
                  Complaint.find({ ...deptFilter, status: { $in: ['assigned', 'in_progress', 'pending'] } })
                        .sort({ priority: -1, createdAt: 1 })
                        .limit(10)
                        .populate('citizen', 'name phone')
                        .populate('department', 'name'),
            ]);

            const total = assigned + inProgress + resolved;
            res.status(200).json({
                  success: true,
                  dashboard: {
                        stats: {
                              assigned, inProgress, resolved, overdue, total,
                              resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
                        },
                        department: dept,
                        recentComplaints: recent,
                  },
            });
      } catch (error) { next(error); }
};

// @desc  Get complaints assigned to officer's department
// @route GET /api/officer/complaints
// @access Private (officer)
export const getAssignedComplaints = async (req, res, next) => {
      try {
            const { status, priority, page = 1, limit = 10 } = req.query;
            const dept = await Department.findOne({ slug: req.user.department });

            const query = dept
                  ? { department: dept._id }
                  : { assignedOfficer: req.user._id };

            if (status) query.status = status;
            if (priority) query.priority = priority;

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await Complaint.countDocuments(query);

            const complaints = await Complaint.find(query)
                  .populate('citizen', 'name email phone address')
                  .populate('assignedOfficer', 'name email')
                  .populate('department', 'name slug')
                  .sort({ isEmergency: -1, priority: -1, createdAt: 1 })
                  .skip(skip)
                  .limit(parseInt(limit));

            res.status(200).json({
                  success: true, total,
                  page: parseInt(page),
                  totalPages: Math.ceil(total / parseInt(limit)),
                  complaints,
            });
      } catch (error) { next(error); }
};

// @desc  Update complaint status
// @route PUT /api/officer/complaints/:id/status
// @access Private (officer)
export const updateComplaintStatus = async (req, res, next) => {
      try {
            const { status, note } = req.body;
            const { isValid, errors } = validateStatusUpdate({ status });
            if (!isValid) return res.status(400).json({ success: false, errors });

            const complaint = await Complaint.findById(req.params.id).populate('citizen', 'name _id');
            if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

            // Verify officer belongs to this department
            const dept = await Department.findOne({ slug: req.user.department });
            if (dept && complaint.department?.toString() !== dept._id.toString()) {
                  return res.status(403).json({ success: false, message: 'This complaint is not in your department' });
            }

            complaint.status = status;
            if (status === 'resolved') complaint.resolvedAt = new Date();
            complaint.timeline.push({
                  status,
                  note: note || `Status updated to ${status} by officer`,
                  updatedBy: req.user._id,
            });
            await complaint.save();

            await notifyStatusUpdate(complaint.citizen._id, complaint._id, complaint.title, status);

            res.status(200).json({ success: true, message: `Complaint marked as "${status}"`, complaint });
      } catch (error) { next(error); }
};

// @desc  Add note/comment to complaint
// @route POST /api/officer/complaints/:id/note
// @access Private (officer)
export const addNote = async (req, res, next) => {
      try {
            const { note } = req.body;
            if (!note?.trim()) return res.status(400).json({ success: false, message: 'Note is required' });

            const complaint = await Complaint.findByIdAndUpdate(
                  req.params.id,
                  {
                        $push: {
                              timeline: {
                                    status: 'in_progress',
                                    note: note.trim(),
                                    updatedBy: req.user._id,
                              },
                        },
                        status: 'in_progress',
                  },
                  { new: true }
            );

            if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
            res.status(200).json({ success: true, message: 'Note added', complaint });
      } catch (error) { next(error); }
};

// @desc  Get officer performance stats
// @route GET /api/officer/performance
// @access Private (officer)
export const getPerformance = async (req, res, next) => {
      try {
            const dept = await Department.findOne({ slug: req.user.department });
            const filter = dept ? { department: dept._id } : { assignedOfficer: req.user._id };

            const [total, resolved, avgTime] = await Promise.all([
                  Complaint.countDocuments(filter),
                  Complaint.countDocuments({ ...filter, status: 'resolved' }),
                  Complaint.aggregate([
                        { $match: { ...filter, status: 'resolved', resolvedAt: { $exists: true } } },
                        { $project: { hours: { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000] } } },
                        { $group: { _id: null, avg: { $avg: '$hours' } } },
                  ]),
            ]);

            res.status(200).json({
                  success: true,
                  performance: {
                        total,
                        resolved,
                        pending: total - resolved,
                        resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
                        avgResolutionHrs: avgTime[0]?.avg?.toFixed(1) || 0,
                  },
            });
      } catch (error) { next(error); }
};
