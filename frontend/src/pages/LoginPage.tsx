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
  Users,
  Award,
  Globe,
  Check,
  X,
  BookOpen,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';

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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-orange-50/20">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 text-white flex-col justify-between p-12 lg:p-16 relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #0a0f2a 0%, #141a4a 50%, #1a2360 100%)'
      }}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/5 rounded-full blur-3xl"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-orange-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-24 h-24 bg-blue-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Back Button */}
        <Link
          to="/"
          className="relative z-10 inline-flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 text-sm group w-fit bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-white/20"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg mx-auto">
          <div className="mb-10">
            {/* Logos Section */}
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={btsLogo} 
                alt="BTS Logo" 
                className="h-16 w-auto object-contain drop-shadow-lg"
              />
              <div className="w-px h-12 bg-white/20"></div>
              <img 
                src={cambridgeLogo} 
                alt="Cambridge English" 
                className="h-16 w-auto object-contain drop-shadow-lg"
              />
            </div>
            
            <h1 className="text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Sign in to continue your learning journey and access your Cambridge English preparation courses.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:bg-white/10">
                <div className="p-2 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
                </div>
                <span className="text-sm text-white/90 leading-tight">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-10 flex items-center gap-8 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-white/5">
                <Users className="w-4 h-4" />
              </div>
              <span>200+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-white/5">
                <Award className="w-4 h-4" />
              </div>
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-white/5">
                <Globe className="w-4 h-4" />
              </div>
              <span>Cambridge Affiliated</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/30 text-sm">
          © {new Date().getFullYear()} Beyond the Syllabus. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-white via-white to-orange-50/10">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors group mb-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={btsLogo} 
                alt="BTS Logo" 
                className="h-10 w-auto object-contain"
              />
              <div className="w-px h-10 bg-gray-300"></div>
              <img 
                src={cambridgeLogo} 
                alt="Cambridge English" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-500">Sign in to your account</p>
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
              <label htmlFor="identifier" className="text-sm font-medium text-gray-700 block mb-1.5">
                Email or Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  {identifierType === 'email' ? (
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                  ) : identifierType === 'phone' ? (
                    <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                  ) : (
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                  )}
                </div>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone number"
                  className={`w-full px-4 pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.identifier 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-orange-500'
                  }`}
                  {...register('identifier')}
                />
                {identifierValue && !errors.identifier && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Check className="w-4 h-4 text-emerald-500" />
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
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full px-4 pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-orange-500'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2} />
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
              className="relative w-full py-3.5 px-6 text-base font-semibold text-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #d4411e, #f1592a)' }}
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Register Links */}
            <div className="text-center space-y-3 pt-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-orange-600 hover:text-orange-700 transition-colors hover:underline">
                  Create one now
                </Link>
              </p>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400">or</span>
                </div>
              </div>
              <Link
                to="/student-register"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors group"
              >
                <Sparkles className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:underline">Register with Admission ID</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;