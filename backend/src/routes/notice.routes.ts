import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import {
  getPublishedNotices,
  getLatestNotices,
  getNoticeById,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  changeNoticeStatus,
} from '../controllers/notice.controller.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
router.get('/public', getPublishedNotices);
router.get('/public/latest', getLatestNotices);
router.get('/public/:id', getNoticeById);

// ============================================
// ADMIN ROUTES (Authentication + Admin only)
// ============================================
router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getAllNotices);
router.post('/', createNotice);
router.put('/:id', updateNotice);
router.delete('/:id', deleteNotice);
router.patch('/:id/status', changeNoticeStatus);

export default router;