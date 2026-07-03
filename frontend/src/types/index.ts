// User Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'office' | 'student';
  isActive: boolean;
  lastLogin?: string;
  profile?: any;  // For student/teacher/office specific data
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}