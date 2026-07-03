import apiClient from '../client';

export interface Student {
  id: string;
  fullName: string;
  admissionId: string;
  email: string;
  phone: string;
  status: 'pending_registration' | 'active' | 'completed' | 'inactive';
  program: {
    id: string;
    name: string;
    displayName: {
      en: string;
      bn: string;
    };
  };
  user: {
    id: string;
    email: string;
    isActive: boolean;
    lastLogin?: string;
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

  update: (id: string, data: any) =>
    apiClient.put(`/admin/students/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/admin/students/${id}`),

  restore: (id: string) =>
    apiClient.patch(`/admin/students/${id}/restore`),

  resetPassword: (id: string, data: { newPassword: string }) =>
    apiClient.post(`/admin/students/${id}/reset-password`, data),

  getStats: () =>
    apiClient.get('/admin/students/stats'),
};