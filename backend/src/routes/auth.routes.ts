import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from '../utils/validators.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshTokenValidation, refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;