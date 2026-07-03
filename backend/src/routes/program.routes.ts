import { Router } from 'express';
import {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  restoreProgram,
} from '../controllers/program.controller.js';
import {
  createProgramValidation,
  updateProgramValidation,
} from '../utils/program.validators.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All program routes require authentication
router.use(authenticate);

// Public (authenticated users can view programs)
router.get('/', getPrograms);
router.get('/:id', getProgramById);

// Admin only routes
router.post('/', authorize('admin'), createProgramValidation, createProgram);
router.put('/:id', authorize('admin'), updateProgramValidation, updateProgram);
router.delete('/:id', authorize('admin'), deleteProgram);
router.patch('/:id/restore', authorize('admin'), restoreProgram);

export default router;