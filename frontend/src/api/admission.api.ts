import apiClient from './client';

export interface AdmitStudentRequest {
  fullName: string;
  phone: string;
  parentPhone?: string;
  email: string;
  programId: string;
  admissionId?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  schoolCollege?: string;
}

export interface RegisterStudentRequest {
  admissionId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Student {
  id: string;
  fullName: string;
  admissionId: string;
  email: string;
  phone: string;
  programId: string;
  status: 'pending_registration' | 'active' | 'completed' | 'inactive';
  admissionDate: string;
  createdAt: string;
  updatedAt: string;
}

export const admissionApi = {
  admitStudent: (data: AdmitStudentRequest) =>
    apiClient.post('/admission/admit', data),
  
  registerStudent: (data: RegisterStudentRequest) =>
    apiClient.post('/admission/register-student', data),
  
  getSettings: () =>
    apiClient.get('/admission/settings'),
  
  updateSettings: (data: { mode: 'manual' | 'automatic'; prefix?: string; currentNumber?: number }) =>
    apiClient.put('/admission/settings', data),
  
  getStudentByAdmissionId: (admissionId: string) =>
    apiClient.get(`/admission/student/${admissionId}`),
  
  getAllStudents: (params?: { page?: number; limit?: number; search?: string; status?: string; programId?: string }) =>
    apiClient.get('/admission/students', { params }),
  
  getRecentAdmissions: (limit?: number) =>
    apiClient.get('/admission/students', { 
      params: { 
        limit: limit || 10,
        page: 1,
      } 
    }),
};