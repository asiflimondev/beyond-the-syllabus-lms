import apiClient from '../client';

export const adminMockTestApi = {
  // Get mock tests by program
  getMockTestsByProgram: (programId: string) =>
    apiClient.get(`/admin/mock-tests/program/${programId}`),

  // Create mock test
  createMockTest: (data: any) =>
    apiClient.post('/admin/mock-tests', data),

  // Update mock test
  updateMockTest: (id: string, data: any) =>
    apiClient.put(`/admin/mock-tests/${id}`, data),

  // Permanently delete mock test (with cascade delete)
  permanentlyDeleteMockTest: (id: string) =>
    apiClient.delete(`/admin/mock-tests/${id}/permanent`),

  // Get mark entry data
  getMarkEntryData: (mockTestId: string) =>
    apiClient.get(`/admin/mock-tests/${mockTestId}/mark-entry`),

  // Save marks
  saveMarks: (mockTestId: string, data: { marks: any[] }) =>
    apiClient.post(`/admin/mock-tests/${mockTestId}/mark-entry`, data),
};

export const officeMockTestApi = {
  // Get mock tests by program
  getMockTestsByProgram: (programId: string) =>
    apiClient.get(`/office/mock-tests/program/${programId}`),

  // Get mark entry data
  getMarkEntryData: (mockTestId: string) =>
    apiClient.get(`/office/mock-tests/${mockTestId}/mark-entry`),

  // Save marks
  saveMarks: (mockTestId: string, data: { marks: any[] }) =>
    apiClient.post(`/office/mock-tests/${mockTestId}/mark-entry`, data),
};