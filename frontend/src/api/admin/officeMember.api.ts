import apiClient from '../client';

export interface OfficeMember {
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
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfficeMemberRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
}

export const officeMemberManagementApi = {
  createOfficeMember: (data: CreateOfficeMemberRequest) =>
    apiClient.post('/admin/office-members', data),

  getAllOfficeMembers: (params?: { page?: number; limit?: number; search?: string; isActive?: string }) =>
    apiClient.get('/admin/office-members', { params }),

  getOfficeMemberById: (id: string) =>
    apiClient.get(`/admin/office-members/${id}`),

  updateOfficeMember: (id: string, data: Partial<CreateOfficeMemberRequest> & { isActive?: boolean }) =>
    apiClient.put(`/admin/office-members/${id}`, data),

  deleteOfficeMember: (id: string) =>
    apiClient.delete(`/admin/office-members/${id}`),

  restoreOfficeMember: (id: string) =>
    apiClient.patch(`/admin/office-members/${id}/restore`),

  getStats: () =>
    apiClient.get('/admin/office-members/stats'),
};