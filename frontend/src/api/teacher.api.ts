import apiClient from './client';

export interface TeacherProfile {
  id: string;
  userId: string;
  fullName: string;
  employeeId: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  programIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const teacherApi = {
  getProfile: () =>
    apiClient.get('/teacher/profile'),
  
  updateProfile: (data: Partial<TeacherProfile>) =>
    apiClient.put('/teacher/profile', data),
  
  getPrograms: () =>
    apiClient.get('/teacher/programs'),
  
  getStudentsByProgram: (programId: string, params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get(`/teacher/programs/${programId}/students`, { params }),
  
  getMockTestsByProgram: (programId: string) =>
    apiClient.get(`/teacher/programs/${programId}/mock-tests`),
  
  createMockTest: (data: any) =>
    apiClient.post('/teacher/mock-tests', data),
  
  updateMockTest: (id: string, data: any) =>
    apiClient.put(`/teacher/mock-tests/${id}`, data),
  
  getMockTestResults: (mockTestId: string) =>
    apiClient.get(`/teacher/mock-tests/${mockTestId}/results`),
  
  getMarkEntryData: (mockTestId: string) =>
    apiClient.get(`/teacher/mock-tests/${mockTestId}/mark-entry`),

  saveMarks: (mockTestId: string, data: { marks: any[] }) =>
    apiClient.post(`/teacher/mock-tests/${mockTestId}/mark-entry`, data),
};