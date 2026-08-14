import apiClient from '../client';

export interface Student {
  id: string;
  fullName: string;
  admissionId: string;
  email: string;
  phone: string;
  fatherName?: string;
  motherName?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  schoolCollege?: string;
  status: string;
  program?: {
    id: string;
    name: string;
    displayName: {
      en: string;
      bn: string;
    };
  };
  user?: {
    email: string;
    isActive: boolean;
  };
  admittedBy?: {
    email: string;
  };
  admissionDate: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export const studentManagementApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    programId?: string;
    isDeleted?: string;
  }) =>
    apiClient.get('/admin/students', { params }),

  getById: (id: string) =>
    apiClient.get(`/admin/students/${id}`),

  create: (data: any) =>
    apiClient.post('/admin/students', data),

  update: (id: string, data: any) =>
    apiClient.put(`/admin/students/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/admin/students/${id}`),

  restore: (id: string) =>
    apiClient.patch(`/admin/students/${id}/restore`),

  permanentDelete: (id: string) =>
    apiClient.delete(`/admin/students/${id}/permanent`),

  resetPassword: (id: string, data: { newPassword: string }) =>
    apiClient.post(`/admin/students/${id}/reset-password`, data),

  getStats: () =>
    apiClient.get('/admin/students/stats'),

  // NEW: Get student results
  getStudentResults: (id: string) =>
    apiClient.get(`/admin/students/${id}/results`),
};