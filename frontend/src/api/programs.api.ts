import apiClient from './client';

export interface Program {
  id: string;
  name: string;
  displayName: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  duration: number;
  fee: number;
  teacherIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramRequest {
  name: string;
  displayName: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  duration: number;
  fee: number;
  teacherIds?: string[];
}

export const programsApi = {
  getAll: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) =>
    apiClient.get('/programs', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/programs/${id}`),
  
  create: (data: CreateProgramRequest) =>
    apiClient.post('/programs', data),
  
  update: (id: string, data: Partial<CreateProgramRequest>) =>
    apiClient.put(`/programs/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/programs/${id}`),
  
  restore: (id: string) =>
    apiClient.patch(`/programs/${id}/restore`),
};