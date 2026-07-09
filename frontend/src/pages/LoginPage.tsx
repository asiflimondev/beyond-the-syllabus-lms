import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone,
  GraduationCap,
  Users,
  Award,
  Globe,
  Check,
  X,
  BookOpen,
  TrendingUp
} from 'lucide-react';

// Validation schema
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
      toast.success('Welcome back!');
      
      const role = user?.role || 'student';
      let redirectPath = '/';
      
      switch (role) {
        case 'admin': redirectPath = '/admin/dashboard'; break;
        case 'teacher': redirectPath = '/teacher/dashboard'; break;
        case 'office': redirectPath = '/office/dashboard'; break;
        case 'student': redirectPath = '/student/dashboard'; break;
        default: redirectPath = '/';
      }
      
      setRedirectAfterAuth(redirectPath);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: BookOpen, text: 'Access Your Learning Dashboard' },
    { icon: Users, text: 'Connect with Expert Teachers' },
    { icon: Award, text: 'Track Your Progress' },
    { icon: TrendingUp, text: 'View Your Results' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration / Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>

        {/* Back Button */}
        <Link
          to="/"
          className="relative z-10 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Sign in to continue your learning journey and access your Cambridge English preparation courses.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <feature.icon className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/90 leading-tight">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-8 flex items-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>200+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Cambridge Affiliated</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/40 text-sm">
          © {new Date().getFullYear()} Beyond the Syllabus. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-sm text-gray-500">Sign in to your account</p>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Identifier Field */}
            <div>
              <label htmlFor="identifier" className="label">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {identifierType === 'email' ? (
                    <Mail className="w-5 h-5 text-gray-400" />
                  ) : identifierType === 'phone' ? (
                    <Phone className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Mail className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone number"
                  className={`input pl-12 ${errors.identifier ? 'input-error' : ''}`}
                  {...register('identifier')}
                />
                {identifierValue && !errors.identifier && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {errors.identifier && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label mb-0">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input pl-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full py-3 text-base font-semibold rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner spinner-md border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Register Links */}
            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  Create one now
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                Are you a student?{' '}
                <Link to="/student-register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  Register with Admission ID
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;