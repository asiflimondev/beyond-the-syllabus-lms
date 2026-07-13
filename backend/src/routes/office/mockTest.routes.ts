import { Router } from 'express';
import {
  getMockTestsByProgramOffice,
  getMarkEntryDataOffice,
  saveMarksOffice,
} from '../../controllers/officeMockTest.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and office role
router.use(authenticate);
router.use(authorize('office'));

// Mock test routes for Office (View + Mark Entry only)
router.get('/mock-tests/program/:programId', getMockTestsByProgramOffice);
router.get('/mock-tests/:mockTestId/mark-entry', getMarkEntryDataOffice);
router.post('/mock-tests/:mockTestId/mark-entry', saveMarksOffice);

export default router;