import { Types } from 'mongoose';
import { Receipt } from '../models/Receipt.model.js';
import { Student } from '../models/Student.model.js';
import { Program } from '../models/Program.model.js';
import { IReceipt } from '../types/index.js';

// ============================================
// GENERATE RECEIPT NUMBER
// ============================================
export const generateReceiptNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = currentYear.toString();

  // Find the last receipt for this year
  const lastReceipt = await Receipt.findOne({
    receiptNumber: { $regex: `^RCP-${yearPrefix}-` },
  })
    .sort({ receiptNumber: -1 })
    .lean();

  let nextNumber = 1;

  if (lastReceipt) {
    // Extract the number part: RCP-2026-000001 -> 000001
    const match = lastReceipt.receiptNumber.match(/RCP-\d+-(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  // Pad the number to 6 digits
  const paddedNumber = String(nextNumber).padStart(6, '0');
  return `RCP-${yearPrefix}-${paddedNumber}`;
};

// ============================================
// GENERATE RECEIPT
// ============================================
export const generateReceipt = async (data: {
  studentId: Types.ObjectId;
  studentName: string;
  studentAdmissionId: string;
  studentPhone: string;
  studentEmail: string;
  programId: Types.ObjectId;
  programName: string;
  paymentAmount: number;
  generatedBy: Types.ObjectId;
  paymentMethod?: 'Cash' | 'bKash' | 'Nagad' | 'Card' | 'Bank Transfer';
}): Promise<IReceipt> => {
  try {
    // Generate unique receipt number
    const receiptNumber = await generateReceiptNumber();

    // Create receipt
    const receipt = await Receipt.create({
      receiptNumber,
      studentId: data.studentId,
      studentName: data.studentName,
      studentAdmissionId: data.studentAdmissionId,
      studentPhone: data.studentPhone,
      studentEmail: data.studentEmail,
      programId: data.programId,
      programName: data.programName,
      paymentAmount: data.paymentAmount,
      paymentMethod: data.paymentMethod || 'Cash',
      receiptDate: new Date(),
      generatedBy: data.generatedBy,
      isDeleted: false,
    });

    return receipt;
  } catch (error: any) {
    console.error('Generate receipt error:', error);
    throw new Error(`Failed to generate receipt: ${error.message}`);
  }
};

// ============================================
// GET ALL RECEIPTS (with pagination & filters)
// ============================================
export const getReceipts = async (options: {
  page?: number;
  limit?: number;
  search?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}): Promise<{ receipts: IReceipt[]; total: number }> => {
  const { page = 1, limit = 10, search, studentId, startDate, endDate, minAmount, maxAmount } = options;

  const filter: any = { isDeleted: false };

  if (studentId) {
    filter.studentId = studentId;
  }

  if (search) {
    filter.$or = [
      { receiptNumber: { $regex: search, $options: 'i' } },
      { studentName: { $regex: search, $options: 'i' } },
      { studentAdmissionId: { $regex: search, $options: 'i' } },
      { studentPhone: { $regex: search, $options: 'i' } },
      { studentEmail: { $regex: search, $options: 'i' } },
      { programName: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filter.receiptDate = {};
    if (startDate) {
      filter.receiptDate.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.receiptDate.$lte = new Date(endDate);
    }
  }

  if (minAmount !== undefined || maxAmount !== undefined) {
    filter.paymentAmount = {};
    if (minAmount !== undefined) {
      filter.paymentAmount.$gte = minAmount;
    }
    if (maxAmount !== undefined) {
      filter.paymentAmount.$lte = maxAmount;
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const receipts = await Receipt.find(filter)
    .sort({ receiptDate: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('studentId', 'fullName admissionId')
    .populate('programId', 'name displayName')
    .populate('generatedBy', 'email');

  const total = await Receipt.countDocuments(filter);

  return { receipts, total };
};

// ============================================
// GET RECEIPT BY ID
// ============================================
export const getReceiptById = async (receiptId: string): Promise<IReceipt | null> => {
  const receipt = await Receipt.findOne({
    _id: receiptId,
    isDeleted: false,
  })
    .populate('studentId', 'fullName admissionId phone email')
    .populate('programId', 'name displayName')
    .populate('generatedBy', 'email');

  return receipt;
};

// ============================================
// GET RECEIPTS BY STUDENT ID
// ============================================
export const getReceiptsByStudentId = async (
  studentId: string
): Promise<IReceipt[]> => {
  const receipts = await Receipt.find({
    studentId,
    isDeleted: false,
  })
    .sort({ receiptDate: -1 })
    .populate('programId', 'name displayName')
    .populate('generatedBy', 'email');

  return receipts;
};

// ============================================
// SOFT DELETE RECEIPT
// ============================================
export const deleteReceipt = async (
  receiptId: string,
  deletedBy: Types.ObjectId
): Promise<IReceipt | null> => {
  const receipt = await Receipt.findById(receiptId);
  if (!receipt) {
    throw new Error('Receipt not found');
  }

  receipt.isDeleted = true;
  receipt.deletedAt = new Date();
  await receipt.save();

  return receipt;
};