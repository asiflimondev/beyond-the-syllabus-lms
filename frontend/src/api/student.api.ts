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

export interface MockTestResult {
  _id: string;
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
  result?: {
    reading: { obtained: number; total: number };
    writing: { obtained: number; total: number };
    listening: { obtained: number; total: number };
    speaking: { grade: string; comment: string };
    presentation: { marks: number; total: number; comment: string };
    totalMarks: number;
    percentage: number;
    grade: string;
  };
  hasResult: boolean;
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
  // Profile
  getProfile: () =>
    apiClient.get('/student/profile'),

  updateProfile: (data: Partial<StudentProfile>) =>
    apiClient.put('/student/profile', data),

  // Program
  getProgram: () =>
    apiClient.get('/student/program'),

  // Mock Tests
  getMockTests: () =>
    apiClient.get('/student/mock-tests'),

  getResult: (mockTestId: string) =>
    apiClient.get(`/student/results/${mockTestId}`),

  // Statistics
  getStats: () =>
    apiClient.get('/student/stats'),

  // Password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/student/change-password', data),
};