import { Router } from 'express';
import { getPublicPrograms } from '../controllers/public.controller.js';

const router = Router();

// ✅ PUBLIC ROUTES - No authentication required
router.get('/programs', getPublicPrograms);

export default router;