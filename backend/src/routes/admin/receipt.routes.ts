import { Router } from 'express';
import {
  getAllReceipts,
  getReceiptByIdController,
  getReceiptsByStudentController,
  deleteReceiptController,
  restoreReceipt,
  permanentlyDeleteReceipt,
} from '../../controllers/receipt.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin & Office can view all receipts
router.get('/', authorize('admin', 'office'), getAllReceipts);

// Admin & Office can view receipt by ID
router.get('/:id', authorize('admin', 'office'), getReceiptByIdController);

// Admin & Office can view receipts by student
router.get('/student/:studentId', authorize('admin', 'office'), getReceiptsByStudentController);

// Admin only - Delete receipt (soft delete)
router.delete('/:id', authorize('admin'), deleteReceiptController);

// Admin only - Restore receipt
router.patch('/:id/restore', authorize('admin'), restoreReceipt);

// Admin only - Permanently delete receipt
router.delete('/:id/permanent', authorize('admin'), permanentlyDeleteReceipt);

export default router;