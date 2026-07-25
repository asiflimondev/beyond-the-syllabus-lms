import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/settings.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Password change
router.post('/change-password', changePassword);

export default router;