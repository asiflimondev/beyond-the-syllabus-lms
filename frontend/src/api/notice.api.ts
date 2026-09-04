import apiClient from './client';

export interface Notice {
  _id: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
}

export interface NoticeResponse {
  success: boolean;
  data: {
    notices: Notice[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const noticeApi = {
  // Public endpoints
  getPublishedNotices: (page?: number, limit?: number) =>
    apiClient.get<NoticeResponse>('/notices/public', { params: { page, limit } }),

  getLatestNotices: (limit: number = 5) =>
    apiClient.get<{ success: boolean; data: Notice[] }>('/notices/public/latest', { params: { limit } }),

  getNoticeById: (id: string) =>
    apiClient.get<{ success: boolean; data: Notice }>(`/notices/public/${id}`),

  // Admin endpoints
  getAllNotices: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) =>
    apiClient.get<NoticeResponse>('/notices', { params }),

  createNotice: (data: { title: string; content: string; category: string; status: 'draft' | 'published' }) =>
    apiClient.post<{ success: boolean; data: Notice }>('/notices', data),

  updateNotice: (id: string, data: { title: string; content: string; category: string; status: 'draft' | 'published' }) =>
    apiClient.put<{ success: boolean; data: Notice }>(`/notices/${id}`, data),

  deleteNotice: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/notices/${id}`),

  changeNoticeStatus: (id: string, status: 'draft' | 'published') =>
    apiClient.patch<{ success: boolean; data: Notice }>(`/notices/${id}/status`, { status }),
};