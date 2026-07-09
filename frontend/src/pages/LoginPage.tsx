import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';

// ✅ Updated validation: accepts email OR phone
const loginSchema = yup.object({
  identifier: yup
    .string()
    .required('Email or phone number is required')
    .trim()
    .test('is-email-or-phone', 'Please enter a valid email or phone number', (value) => {
      if (!value) return false;
      const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
      const isPhone = /^01[3-9]\d{8}$/.test(value);
      return isEmail || isPhone;
    }),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
  const [identifierType, setIdentifierType] = useState<'email' | 'phone' | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const identifierValue = watch('identifier');

  // Detect identifier type for icon display
  useEffect(() => {
    if (!identifierValue) {
      setIdentifierType(null);
      return;
    }
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(identifierValue);
    const isPhone = /^01[3-9]\d{8}$/.test(identifierValue);
    if (isEmail) setIdentifierType('email');
    else if (isPhone) setIdentifierType('phone');
    else setIdentifierType(null);
  }, [identifierValue]);

  useEffect(() => {
    if (redirectAfterAuth) {
      navigate(redirectAfterAuth);
      setRedirectAfterAuth(null);
    }
  }, [redirectAfterAuth, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const user = await login(data.identifier, data.password);
      
      toast.success('Login successful!');
      
      const role = user?.role || 'student';
      let redirectPath = '/';
      
      switch (role) {
        case 'admin':
          redirectPath = '/admin/dashboard';
          break;
        case 'teacher':
          redirectPath = '/teacher/dashboard';
          break;
        case 'office':
          redirectPath = '/office/dashboard';
          break;
        case 'student':
          redirectPath = '/student/dashboard';
          break;
        default:
          redirectPath = '/';
      }
      
      setRedirectAfterAuth(redirectPath);
      
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">B</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* ✅ Single field: Email or Phone Number */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {identifierType === 'email' ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : identifierType === 'phone' ? (
                    <Phone className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Mail className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone number"
                  className={`pl-10 w-full px-3 py-3 border ${errors.identifier ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors`}
                  {...register('identifier')}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 w-full px-3 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Register Link */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                Create one now
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Are you a student?{' '}
              <Link to="/student-register" className="font-medium text-primary-600 hover:text-primary-700">
                Register with Admission ID
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;