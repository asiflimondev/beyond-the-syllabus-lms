import { Router } from 'express';
import {
  getTeacherProfile,
  updateTeacherProfile,
  getTeacherPrograms,
  getStudentsByProgram,
  getMockTestsByProgram,
  createMockTest,
  updateMockTest,
  deleteMockTest,
  getMockTestResults,
  getStudentsForMarkEntry,
  saveMarks,
} from '../controllers/teacher.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// TEACHER & OFFICE & ADMIN - Profile & Programs (Read)
// ============================================
router.get('/profile', authorize('admin', 'teacher', 'office'), getTeacherProfile);
router.put('/profile', authorize('admin', 'teacher', 'office'), updateTeacherProfile);
router.get('/programs', authorize('admin', 'teacher', 'office'), getTeacherPrograms);
router.get('/programs/:programId/students', authorize('admin', 'teacher', 'office'), getStudentsByProgram);

// ============================================
// MOCK TESTS - View (All roles)
// ============================================
router.get('/programs/:programId/mock-tests', authorize('admin', 'teacher', 'office'), getMockTestsByProgram);

// ============================================
// MOCK TESTS - Create (Admin only)
// ============================================
router.post('/mock-tests', authorize('admin'), createMockTest);

// ============================================
// MOCK TESTS - Update (Admin only)
// ============================================
router.put('/mock-tests/:id', authorize('admin'), updateMockTest);

// ============================================
// MOCK TESTS - Delete (Admin only)
// ============================================
router.delete('/mock-tests/:id', authorize('admin'), deleteMockTest);

// ============================================
// MARK ENTRY - View & Save (Admin, Teacher, Office)
// ============================================
router.get('/mock-tests/:mockTestId/results', authorize('admin', 'teacher', 'office'), getMockTestResults);
router.get('/mock-tests/:mockTestId/mark-entry', authorize('admin', 'teacher', 'office'), getStudentsForMarkEntry);
router.post('/mock-tests/:mockTestId/mark-entry', authorize('admin', 'teacher', 'office'), saveMarks);

export default router;