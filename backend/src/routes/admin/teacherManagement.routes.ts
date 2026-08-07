import { Router } from 'express';
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  restoreTeacher,
  getTeacherStats,
  permanentlyDeleteTeacher,  // <--- ADD THIS
} from '../../controllers/admin/teacherManagement.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', getTeacherStats);
router.post('/', createTeacher);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);
router.patch('/:id/restore', restoreTeacher);
router.delete('/:id/permanent', permanentlyDeleteTeacher);  // <--- ADD THIS

export default router;