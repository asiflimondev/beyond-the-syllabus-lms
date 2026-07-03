import { Router } from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  getStudentProgram,
  getStudentMockTests,
  getStudentResult,
  getStudentStats,
  changeStudentPassword,
} from '../controllers/student.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and student role
router.use(authenticate);
router.use(authorize('admin', 'student'));

// Profile
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);

// Program
router.get('/program', getStudentProgram);

// Mock Tests & Results
router.get('/mock-tests', getStudentMockTests);
router.get('/results/:mockTestId', getStudentResult);

// Statistics
router.get('/stats', getStudentStats);

// Password
router.post('/change-password', changeStudentPassword);

export default router;