import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { getRecentActivities, getDashboardStats } from '../../controllers/admin/activity.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get recent activities
router.get('/recent', getRecentActivities);

// Get dashboard stats
router.get('/stats', getDashboardStats);

export default router;