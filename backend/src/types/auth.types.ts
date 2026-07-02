// Request types
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'teacher' | 'office' | 'student';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Response types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}