import express from 'express';
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  restoreStudent,
  resetStudentPassword,
  getStudentStats,
  permanentlyDeleteStudent,
  getStudentResults, // NEW
} from '../../controllers/admin/studentManagement.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get student stats
router.get('/stats', getStudentStats);

// Get all students
router.get('/', getAllStudents);

// Get student results - NEW
router.get('/:id/results', getStudentResults);

// Get student by ID
router.get('/:id', getStudentById);

// Update student
router.put('/:id', updateStudent);

// Soft delete student
router.delete('/:id', deleteStudent);

// Restore student
router.patch('/:id/restore', restoreStudent);

// Permanently delete student
router.delete('/:id/permanent', permanentlyDeleteStudent);

// Reset student password
router.post('/:id/reset-password', resetStudentPassword);

export default router;