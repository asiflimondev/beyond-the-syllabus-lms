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

export interface MockTest {
  id: string;
  programId: string;
  title: string;
  description?: string;
  testNumber: number;
  testDate: string;
  reading: {
    totalMarks: number;
    description?: string;
  };
  writing: {
    totalMarks: number;
    description?: string;
  };
  listening: {
    totalMarks: number;
    description?: string;
  };
  speaking: {
    description?: string;
  };
  presentation: {
    totalMarks: number;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentResult {
  id: string;
  studentId: {
    id: string;
    fullName: string;
    admissionId: string;
    email: string;
  };
  reading: {
    obtained: number;
    total: number;
  };
  writing: {
    obtained: number;
    total: number;
  };
  listening: {
    obtained: number;
    total: number;
  };
  speaking: {
    grade: string;
    comment: string;
  };
  presentation: {
    marks: number;
    total: number;
    comment: string;
  };
  totalMarks: number;
  percentage: number;
  grade: string;
}

export const teacherApi = {
  // Profile
  getProfile: () =>
    apiClient.get('/teacher/profile'),
  
  updateProfile: (data: Partial<TeacherProfile>) =>
    apiClient.put('/teacher/profile', data),
  
  // Programs
  getPrograms: () =>
    apiClient.get('/teacher/programs'),
  
  // Students
  getStudentsByProgram: (programId: string, params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get(`/teacher/programs/${programId}/students`, { params }),
  
  // Mock Tests
  getMockTestsByProgram: (programId: string) =>
    apiClient.get(`/teacher/programs/${programId}/mock-tests`),
  
  createMockTest: (data: Partial<MockTest>) =>
    apiClient.post('/teacher/mock-tests', data),
  
  updateMockTest: (id: string, data: Partial<MockTest>) =>
    apiClient.put(`/teacher/mock-tests/${id}`, data),
  
  getMockTestResults: (mockTestId: string) =>
    apiClient.get(`/teacher/mock-tests/${mockTestId}/results`),
};