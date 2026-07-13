import apiClient from '../client';

export const adminMockTestApi = {
  // Get mock tests by program (Admin only)
  getMockTestsByProgram: (programId: string) =>
    apiClient.get(`/admin/mock-tests/program/${programId}`),

  // Create mock test (Admin only)
  createMockTest: (data: any) =>
    apiClient.post('/admin/mock-tests', data),

  // Update mock test (Admin only)
  updateMockTest: (id: string, data: any) =>
    apiClient.put(`/admin/mock-tests/${id}`, data),

  // Delete mock test (Admin only)
  deleteMockTest: (id: string) =>
    apiClient.delete(`/admin/mock-tests/${id}`),

  // Get mark entry data (Admin only)
  getMarkEntryData: (mockTestId: string) =>
    apiClient.get(`/admin/mock-tests/${mockTestId}/mark-entry`),

  // Save marks (Admin only)
  saveMarks: (mockTestId: string, data: { marks: any[] }) =>
    apiClient.post(`/admin/mock-tests/${mockTestId}/mark-entry`, data),
};

export const officeMockTestApi = {
  // Get mock tests by program (Office only)
  getMockTestsByProgram: (programId: string) =>
    apiClient.get(`/office/mock-tests/program/${programId}`),

  // Get mark entry data (Office only)
  getMarkEntryData: (mockTestId: string) =>
    apiClient.get(`/office/mock-tests/${mockTestId}/mark-entry`),

  // Save marks (Office only)
  saveMarks: (mockTestId: string, data: { marks: any[] }) =>
    apiClient.post(`/office/mock-tests/${mockTestId}/mark-entry`, data),
};