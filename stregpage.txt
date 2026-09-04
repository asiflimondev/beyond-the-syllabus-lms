import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { admissionApi } from '@api/admission.api';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Users,
  Award,
  Globe,
  Check,
  X,
  BookOpen,
  Sparkles,
  GraduationCap,
  UserPlus
} from 'lucide-react';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';

// Validation schema
const studentRegisterSchema = yup.object({
  admissionId: yup
    .string()
    .required('Admission ID is required')
    .trim(),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

type StudentRegisterFormData = yup.InferType<typeof studentRegisterSchema>;

const StudentRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentRegisterFormData>({
    resolver: yupResolver(studentRegisterSchema),
  });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = async (data: StudentRegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await admissionApi.registerStudent({
        admissionId: data.admissionId,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        toast.success('Registration successful! Please login with your credentials.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Student registration error:', error);
      const message = error.response?.data?.message || 'Failed to register. Please check your Admission ID and try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: BookOpen, text: 'Access Your Learning Materials' },
    { icon: Users, text: 'Join Your Class Community' },
    { icon: Award, text: 'Track Your Progress' },
    { icon: Globe, text: 'Cambridge Exam Preparation' },
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
              Student Registration
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Register with your Admission ID to access your personalized learning dashboard and start your Cambridge English journey.
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

      {/* Right Side - Registration Form */}
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
              <h2 className="text-2xl font-bold text-gray-900">Student Registration</h2>
              <p className="text-sm text-gray-500">Register with your Admission ID</p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Student Registration</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your Admission ID to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Admission ID Field */}
            <div>
              <label htmlFor="admissionId" className="text-sm font-medium text-gray-700 block mb-1.5">
                Admission ID
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <GraduationCap className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                </div>
                <input
                  id="admissionId"
                  type="text"
                  placeholder="Enter your Admission ID (e.g., BTS101)"
                  className={`w-full px-4 pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.admissionId 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-orange-500'
                  }`}
                  {...register('admissionId')}
                />
                {watch('admissionId') && !errors.admissionId && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
              {errors.admissionId && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  {errors.admissionId.message}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                You received your Admission ID from the office when you were admitted
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={`w-full px-4 pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-orange-500'
                  }`}
                  {...register('email')}
                />
                {watch('email') && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password (min 6 characters)"
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
              {passwordValue && passwordValue.length > 0 && !errors.password && (
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className={`flex items-center gap-1 ${passwordValue.length >= 6 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <Check className={`w-3.5 h-3.5 ${passwordValue.length >= 6 ? 'text-emerald-600' : 'text-gray-400'}`} />
                    Min 6 chars
                  </span>
                  <span className={`flex items-center gap-1 ${/(?=.*[A-Za-z])(?=.*\d)/.test(passwordValue) ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <Check className={`w-3.5 h-3.5 ${/(?=.*[A-Za-z])(?=.*\d)/.test(passwordValue) ? 'text-emerald-600' : 'text-gray-400'}`} />
                    Letter + number
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={2} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`w-full px-4 pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-orange-500'
                  }`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  {errors.confirmPassword.message}
                </p>
              )}
              {confirmPasswordValue && passwordValue && !errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Passwords match
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
                  Registering...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Register
                </span>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center space-y-3 pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-orange-600 hover:text-orange-700 transition-colors hover:underline">
                  Sign in here
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
                to="/register"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors group"
              >
                <UserPlus className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">Create a new account</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegisterPage;