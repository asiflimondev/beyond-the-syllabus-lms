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

export interface ProgramsResponse {
  success: boolean;
  data: {
    programs: Program[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const programsApi = {
  getAll: async (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    // Build query parameters - only include defined values
    const queryParams: Record<string, string | number | boolean> = {};
    
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.limit !== undefined) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
    
    console.log('📡 Fetching programs with params:', queryParams);
    
    const response = await apiClient.get('/programs', { params: queryParams });
    
    console.log('📦 Programs API response status:', response.status);
    console.log('📦 Programs API response data:', response.data);
    
    return response;
  },
  
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