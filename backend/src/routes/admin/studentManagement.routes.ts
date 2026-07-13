import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  restoreStudent,
  resetStudentPassword,
  getStudentStats,
  permanentlyDeleteStudent, // NEW
} from '../../controllers/admin/studentManagement.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', getStudentStats);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.delete('/:id/permanent', permanentlyDeleteStudent); // NEW - Permanent delete
router.patch('/:id/restore', restoreStudent);
router.post('/:id/reset-password', resetStudentPassword);

export default router;