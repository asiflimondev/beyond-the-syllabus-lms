import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { authApi } from '@api/auth.api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
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

  const refreshUser = async () => {
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
        };
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
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
      };
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    const response = await authApi.register({ email, password, confirmPassword });
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
      };
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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