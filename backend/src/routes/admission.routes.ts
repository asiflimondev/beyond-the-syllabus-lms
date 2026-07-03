import { Router } from 'express';
import {
  admitStudentController,
  getAdmissionSettingsController,
  updateAdmissionSettingsController,
  getStudentByAdmissionIdController,
  registerStudentController,
  getAllStudentsController,
  checkStudentStatus,
  resetStudentRegistration,
} from '../controllers/admission.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
router.post('/register-student', registerStudentController);
router.get('/student/:admissionId', getStudentByAdmissionIdController);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================
router.use(authenticate);

// Admin & Office - Admit students
router.post('/admit', authorize('admin', 'office'), admitStudentController);

// Admin & Office - Get all students
router.get('/students', authorize('admin', 'office'), getAllStudentsController);

// Admin only - Admission settings
router.get('/settings', authorize('admin'), getAdmissionSettingsController);
router.put('/settings', authorize('admin'), updateAdmissionSettingsController);

// ============================================
// DEBUG ROUTES (Admin only)
// ============================================
// Check student status - useful for debugging
router.get('/check-student/:admissionId', authorize('admin'), checkStudentStatus);

// Reset student registration - use if student is stuck
router.post('/reset-student/:admissionId', authorize('admin'), resetStudentRegistration);

export default router;