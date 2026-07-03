import { Router } from 'express';
import {
  admitStudentController,
  getAdmissionSettingsController,
  updateAdmissionSettingsController,
  getStudentByAdmissionIdController,
  registerStudentController,
} from '../controllers/admission.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes (student registration)
router.post('/register-student', registerStudentController);
router.get('/student/:admissionId', getStudentByAdmissionIdController);

// Protected routes (require authentication)
router.use(authenticate);

// Admin only - Admission settings
router.get('/settings', authorize('admin'), getAdmissionSettingsController);
router.put('/settings', authorize('admin'), updateAdmissionSettingsController);

// Admin & Office only - Admit students
router.post('/admit', authorize('admin', 'office'), admitStudentController);

export default router;