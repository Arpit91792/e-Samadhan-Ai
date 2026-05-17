import express from 'express';
import {
      getDashboard, getAllUsers, toggleUserStatus,
      getDepartments, updateDepartment,
      getAuditLogs, getPlatformAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/analytics', getPlatformAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/departments', getDepartments);
router.put('/departments/:id', updateDepartment);
router.get('/audit-logs', getAuditLogs);

export default router;
