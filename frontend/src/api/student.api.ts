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

// Extended interface for admin view with all fields
export interface StudentAdminView extends StudentProfile {
  fatherName?: string;
  motherName?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  schoolCollege?: string;
  admittedBy?: {
    email: string;
  };
  user?: {
    email: string;
    isActive: boolean;
  };
  isDeleted: boolean;
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
  programStats?: {
    programId: string;
    testCount: number;
    averagePercentage: number;
  }[];
}

export interface MockTestResult {
  _id: string;
  mockTestId: string;
  title: string;
  testNumber: number;
  testDate: string;
  reading?: {
    obtained: number;
    total: number;
  };
  writing?: {
    obtained: number;
    total: number;
  };
  listening?: {
    obtained: number;
    total: number;
  };
  speaking?: {
    grade: string;
    comment: string;
  };
  presentation?: {
    marks: number;
    total: number;
    comment: string;
  };
  totalMarks: number;
  percentage: number;
  grade: string;
  hasResult: boolean;
  createdAt: string;
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
    apiClient.get(`/student/mock-tests/${mockTestId}/result`),

  getStats: () =>
    apiClient.get('/student/stats'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/student/change-password', data),
};