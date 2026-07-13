import apiClient from './client';

export interface Receipt {
  id: string; // Keep this for frontend use
  _id?: string; // Optional, from MongoDB
  receiptNumber: string;
  studentId: string | { _id: string; fullName: string; admissionId: string; phone: string; email: string };
  studentName: string;
  studentAdmissionId: string;
  studentPhone: string;
  studentEmail: string;
  programId: string | { _id: string; name: string; displayName: { en: string; bn: string } };
  programName: string;
  paymentAmount: number;
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Card' | 'Bank Transfer';
  receiptDate: string;
  generatedBy: string | { _id: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptsResponse {
  success: boolean;
  data: {
    receipts: Receipt[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const receiptApi = {
  getAllReceipts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }) =>
    apiClient.get<ReceiptsResponse>('/admin/receipts', { params }),

  getReceiptById: (id: string) =>
    apiClient.get<{ success: boolean; data: Receipt }>(`/admin/receipts/${id}`),

  getReceiptsByStudent: (studentId: string) =>
    apiClient.get<{ success: boolean; data: Receipt[] }>(`/admin/receipts/student/${studentId}`),

  deleteReceipt: (id: string) =>
    apiClient.delete(`/admin/receipts/${id}`),
};