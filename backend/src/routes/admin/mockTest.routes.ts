import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import {
  getMockTestsByProgramAdmin,
  createMockTestAdmin,
  updateMockTestAdmin,
  permanentlyDeleteMockTestAdmin,
  getMarkEntryDataAdmin,
  saveMarksAdmin,
} from '../../controllers/adminMockTest.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get mock tests by program
router.get('/mock-tests/program/:programId', getMockTestsByProgramAdmin);

// Create mock test
router.post('/mock-tests', createMockTestAdmin);

// Update mock test
router.put('/mock-tests/:id', updateMockTestAdmin);

// Permanently delete mock test (with cascade delete)
router.delete('/mock-tests/:id/permanent', permanentlyDeleteMockTestAdmin);

// Mark entry
router.get('/mock-tests/:mockTestId/mark-entry', getMarkEntryDataAdmin);
router.post('/mock-tests/:mockTestId/mark-entry', saveMarksAdmin);

export default router;