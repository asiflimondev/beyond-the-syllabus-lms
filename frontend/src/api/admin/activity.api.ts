import apiClient from '../client';

export interface Activity {
  id: string;
  type: 'admission' | 'mocktest' | 'teacher';
  user: string;
  action: string;
  time: string;
  timestamp: number;
  details: any;
}

export interface DashboardStats {
  students: {
    total: number;
    active: number;
    pending: number;
  };
  teachers: {
    total: number;
  };
  mockTests: {
    total: number;
  };
  programs: {
    total: number;
  };
}

export const activityApi = {
  getRecentActivities: (limit: number = 5) =>
    apiClient.get<{ success: boolean; data: Activity[] }>('/admin/activities/recent', {
      params: { limit }
    }),

  getDashboardStats: () =>
    apiClient.get<{ success: boolean; data: DashboardStats }>('/admin/activities/stats'),
};