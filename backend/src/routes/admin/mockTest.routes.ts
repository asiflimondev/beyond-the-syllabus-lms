import { Router } from 'express';
import {
  getMockTestsByProgramAdmin,
  createMockTestAdmin,
  updateMockTestAdmin,
  deleteMockTestAdmin,
  getMarkEntryDataAdmin,
  saveMarksAdmin,
} from '../../controllers/adminMockTest.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Mock test routes for Admin
router.get('/mock-tests/program/:programId', getMockTestsByProgramAdmin);
router.post('/mock-tests', createMockTestAdmin);
router.put('/mock-tests/:id', updateMockTestAdmin);
router.delete('/mock-tests/:id', deleteMockTestAdmin);
router.get('/mock-tests/:mockTestId/mark-entry', getMarkEntryDataAdmin);
router.post('/mock-tests/:mockTestId/mark-entry', saveMarksAdmin);

export default router;