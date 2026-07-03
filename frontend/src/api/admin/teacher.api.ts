import apiClient from '../client';

export interface Teacher {
  id: string;
  userId: {
    id: string;
    email: string;
    isActive: boolean;
    lastLogin?: string;
  };
  fullName: string;
  employeeId: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  programIds: any[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  programIds?: string[];
}

export const teacherManagementApi = {
  createTeacher: (data: CreateTeacherRequest) =>
    apiClient.post('/admin/teachers', data),

  getAllTeachers: (params?: { page?: number; limit?: number; search?: string; isActive?: string }) =>
    apiClient.get('/admin/teachers', { params }),

  getTeacherById: (id: string) =>
    apiClient.get(`/admin/teachers/${id}`),

  updateTeacher: (id: string, data: Partial<CreateTeacherRequest> & { isActive?: boolean }) =>
    apiClient.put(`/admin/teachers/${id}`, data),

  deleteTeacher: (id: string) =>
    apiClient.delete(`/admin/teachers/${id}`),

  restoreTeacher: (id: string) =>
    apiClient.patch(`/admin/teachers/${id}/restore`),

  getStats: () =>
    apiClient.get('/admin/teachers/stats'),
};