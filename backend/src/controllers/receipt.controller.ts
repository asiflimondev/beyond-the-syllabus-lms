import { Request, Response } from 'express';
import {
  getReceipts,
  getReceiptById,
  getReceiptsByStudentId,
  deleteReceipt,
} from '../services/receipt.service.js';

// ============================================
// GET ALL RECEIPTS
// ============================================
export const getAllReceipts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      studentId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    } = req.query;

    const { receipts, total } = await getReceipts({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      studentId: studentId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });

    res.status(200).json({
      success: true,
      data: {
        receipts,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get all receipts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipts',
      error: error.message,
    });
  }
};

// ============================================
// GET RECEIPT BY ID
// ============================================
export const getReceiptByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const receipt = await getReceiptById(id);

    if (!receipt) {
      res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error: any) {
    console.error('Get receipt by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipt',
      error: error.message,
    });
  }
};

// ============================================
// GET RECEIPTS BY STUDENT ID
// ============================================
export const getReceiptsByStudentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const receipts = await getReceiptsByStudentId(studentId);

    res.status(200).json({
      success: true,
      data: receipts,
    });
  } catch (error: any) {
    console.error('Get receipts by student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipts for student',
      error: error.message,
    });
  }
};

// ============================================
// DELETE RECEIPT (Soft Delete)
// ============================================
export const deleteReceiptController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const receipt = await deleteReceipt(id, userId);

    if (!receipt) {
      res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Receipt deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete receipt',
      error: error.message,
    });
  }
};