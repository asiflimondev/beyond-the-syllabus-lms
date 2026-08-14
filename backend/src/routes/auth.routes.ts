import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// ============================================
// PASSWORD RESET ROUTES (Public)
// ============================================
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);

// ============================================
// PROTECTED ROUTES
// ============================================
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;