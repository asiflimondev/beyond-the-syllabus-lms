import apiClient from './client';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string; // <--- ADD THIS
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      isActive: boolean;
      lastLogin?: string;
      fullName: string;
      phone: string;
      profile: any;
    };
  };
}

export const authApi = {
  // ============================================
  // AUTHENTICATION
  // ============================================
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken }),

  logout: () =>
    apiClient.post('/auth/logout'),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  // ============================================
  // PASSWORD RESET
  // ============================================
  forgotPassword: (identifier: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { identifier }),

  resetPassword: (token: string, newPassword: string, confirmPassword: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', { 
      token, 
      newPassword, 
      confirmPassword 
    }),

  verifyResetToken: (token: string) =>
    apiClient.get<{ success: boolean; message: string }>(`/auth/verify-reset-token/${token}`),
};