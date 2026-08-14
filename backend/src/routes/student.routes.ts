import express from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  getStudentProgram,
  getStudentMockTests,
  getStudentResult,
  getStudentStats,
  changeStudentPassword,
} from '../controllers/student.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Student profile
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);

// Student program
router.get('/program', getStudentProgram);

// Mock tests and results
router.get('/mock-tests', getStudentMockTests);
router.get('/mock-tests/:mockTestId/result', getStudentResult); // Make sure this route exists

// Stats
router.get('/stats', getStudentStats);

// Change password
router.post('/change-password', changeStudentPassword);

export default router;