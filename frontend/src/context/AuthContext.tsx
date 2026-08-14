import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { authApi } from '@api/auth.api';

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<User>;
  register: (email: string, password: string, confirmPassword: string, role?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      refreshUser();
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const refreshUser = async (): Promise<User | null> => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.data.success && response.data.data) {
        const userData = response.data.data.user;
        const user: User = {
          id: userData.id,
          email: userData.email,
          role: userData.role as 'admin' | 'teacher' | 'office' | 'student',
          isActive: userData.isActive,
          lastLogin: userData.lastLogin,
          profile: userData.profile || null,
          fullName: userData.fullName || userData.profile?.fullName || userData.email?.split('@')[0] || 'User',
          phone: userData.phone || userData.profile?.phone || '',
        };
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return null;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  };

  const login = async (identifier: string, password: string): Promise<User> => {
    try {
      console.log('🔐 Login attempt with identifier:', identifier);
      
      const response = await authApi.login({ identifier, password });
      
      console.log('📦 Login response:', response);
      
      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken, user: userData } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        const user: User = {
          id: userData.id,
          email: userData.email,
          role: userData.role as 'admin' | 'teacher' | 'office' | 'student',
          isActive: userData.isActive,
          lastLogin: userData.lastLogin,
          profile: userData.profile || null,
          fullName: userData.fullName || userData.profile?.fullName || userData.email?.split('@')[0] || 'User',
          phone: userData.phone || userData.profile?.phone || '',
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('✅ Login successful for:', user.email);
        return user;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setState({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmPassword: string, role: string = 'student'): Promise<void> => {
    try {
      // ✅ Send all fields including confirmPassword
      // The backend will validate password match
      const response = await authApi.register({ 
        email, 
        password, 
        confirmPassword, 
        role 
      });
      
      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken, user: userData } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        const user: User = {
          id: userData.id,
          email: userData.email,
          role: userData.role as 'admin' | 'teacher' | 'office' | 'student',
          isActive: userData.isActive,
          lastLogin: userData.lastLogin,
          profile: userData.profile || null,
          fullName: userData.fullName || userData.profile?.fullName || userData.email?.split('@')[0] || 'User',
          phone: userData.phone || userData.profile?.phone || '',
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setState({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // ============================================
  // UPDATE USER - Syncs user data across the app
  // ============================================
  const updateUser = (data: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      
      // Update state
      setState({
        ...state,
        user: updatedUser,
      });
      
      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const mergedUser = { ...parsedUser, ...data };
          localStorage.setItem('user', JSON.stringify(mergedUser));
        } catch (e) {
          console.error('Error updating user in localStorage:', e);
        }
      } else {
        // If no user in localStorage, save the updated user
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};