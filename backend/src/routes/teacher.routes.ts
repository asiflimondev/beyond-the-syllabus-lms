import { Router } from 'express';
import {
  getTeacherProfile,
  updateTeacherProfile,
  getTeacherPrograms,
  getStudentsByProgram,
  getMockTestsByProgram,
  createMockTest,
  updateMockTest,
  getMockTestResults,
} from '../controllers/teacher.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and teacher role
router.use(authenticate);
router.use(authorize('admin', 'teacher'));

// Profile
router.get('/profile', getTeacherProfile);
router.put('/profile', updateTeacherProfile);

// Programs
router.get('/programs', getTeacherPrograms);

// Students by program
router.get('/programs/:programId/students', getStudentsByProgram);

// Mock Tests
router.get('/programs/:programId/mock-tests', getMockTestsByProgram);
router.post('/mock-tests', createMockTest);
router.put('/mock-tests/:id', updateMockTest);
router.get('/mock-tests/:mockTestId/results', getMockTestResults);

export default router;