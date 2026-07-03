import apiClient from './client';

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  admissionId: string;
  status: 'pending_registration' | 'active' | 'completed' | 'inactive';
  fatherName?: string;
  motherName?: string;
  phone: string;
  parentPhone?: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  schoolCollege?: string;
  programId: {
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
  };
  profileImage?: {
    url: string;
    publicId: string;
  };
  admissionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentStats {
  totalMockTests: number;
  completedTests: number;
  pendingTests: number;
  averagePercentage: number;
  latestResult: {
    _id: string;
    mockTestId: {
      title: string;
      testNumber: number;
    };
    totalMarks: number;
    percentage: number;
    grade: string;
    createdAt: string;
  } | null;
}

export const studentApi = {
  getProfile: () =>
    apiClient.get('/student/profile'),

  updateProfile: (data: Partial<StudentProfile>) =>
    apiClient.put('/student/profile', data),

  getProgram: () =>
    apiClient.get('/student/program'),

  getMockTests: () =>
    apiClient.get('/student/mock-tests'),

  getResult: (mockTestId: string) =>
    apiClient.get(`/student/results/${mockTestId}`),

  getStats: () =>
    apiClient.get('/student/stats'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/student/change-password', data),
};