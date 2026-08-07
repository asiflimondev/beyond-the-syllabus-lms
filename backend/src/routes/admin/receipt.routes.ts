import { Router } from 'express';
import {
  getAllReceipts,
  getReceiptByIdController,
  getReceiptsByStudentController,
  deleteReceiptController,
  permanentlyDeleteReceipt,  // <--- ADD THIS
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

// Admin only - Permanently delete receipt  // <--- ADD THIS
router.delete('/:id/permanent', authorize('admin'), permanentlyDeleteReceipt);

export default router;