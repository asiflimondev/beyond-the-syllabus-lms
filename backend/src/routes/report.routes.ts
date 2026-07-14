import { Router } from 'express';
import {
  getBatchReport,
  getIndividualReport,
  getReportFilters,
} from '../controllers/report.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// ADMIN & TEACHER can access reports
// ============================================
router.get('/filters', authorize('admin', 'teacher'), getReportFilters);
router.get('/batch', authorize('admin', 'teacher'), getBatchReport);
router.get('/individual/:studentId', authorize('admin', 'teacher'), getIndividualReport);

export default router;