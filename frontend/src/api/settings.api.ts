import apiClient from './client';

export interface ProfileData {
  fullName: string;
  phone: string;
  [key: string]: any; // For role-specific fields
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: {
      email: string;
      fullName?: string;
      phone?: string;
      role: string;
    };
    profile: {
      fullName?: string;
      phone?: string;
      [key: string]: any;
    };
  };
}

export const settingsApi = {
  getProfile: () =>
    apiClient.get<ProfileResponse>('/settings/profile'),

  updateProfile: (data: ProfileData) =>
    apiClient.put('/settings/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/settings/change-password', data),
};