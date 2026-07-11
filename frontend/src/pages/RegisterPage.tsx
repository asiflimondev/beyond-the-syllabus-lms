import React, { useState } from 'react';
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
  Check,
  X,
  BookOpen,
  Users,
  Award,
  Globe
} from 'lucide-react';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';

// Validation schema
const registerSchema = yup.object({
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
  role: yup
    .string()
    .oneOf(['admin', 'teacher', 'office', 'student'])
    .default('student'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.confirmPassword, data.role);
      toast.success('Account created successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Failed to register. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: BookOpen, text: 'Cambridge English Preparation' },
    { icon: Users, text: 'Expert Teachers & Mentors' },
    { icon: Award, text: 'Globally Recognized Certification' },
    { icon: Globe, text: 'Join 200+ Successful Students' },
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
            {/* Logos Section */}
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={btsLogo} 
                alt="BTS Logo" 
                className="h-14 w-auto object-contain"
              />
              <div className="w-px h-12 bg-white/30"></div>
              <img 
                src={cambridgeLogo} 
                alt="Cambridge English" 
                className="h-14 w-auto object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Start Your Learning Journey
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Join Beyond the Syllabus and access world-class Cambridge English preparation courses taught by expert instructors.
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

      {/* Right Side - Registration Form */}
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
            {/* Mobile Logos */}
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={btsLogo} 
                alt="BTS Logo" 
                className="h-8 w-auto object-contain"
              />
              <div className="w-px h-8 bg-gray-300"></div>
              <img 
                src={cambridgeLogo} 
                alt="Cambridge English" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
              <p className="text-sm text-gray-500">Join our learning community</p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1">Join Beyond the Syllabus today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`input pl-12 ${errors.email ? 'input-error' : ''}`}
                  {...register('email')}
                />
                {watch('email') && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Check className="w-4 h-4 text-green-500" />
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
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password (min 6 characters)"
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
              {passwordValue && passwordValue.length > 0 && !errors.password && (
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className={`flex items-center gap-1 ${passwordValue.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className={`w-3.5 h-3.5 ${passwordValue.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
                    Min 6 chars
                  </span>
                  <span className={`flex items-center gap-1 ${/(?=.*[A-Za-z])(?=.*\d)/.test(passwordValue) ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className={`w-3.5 h-3.5 ${/(?=.*[A-Za-z])(?=.*\d)/.test(passwordValue) ? 'text-green-600' : 'text-gray-400'}`} />
                    Letter + number
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`input pl-12 pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
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
                <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="label">
                Account Type
              </label>
              <select
                id="role"
                className="input"
                {...register('role')}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="office">Office Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Select the appropriate role for this account
              </p>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Links */}
            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  Sign in here
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

export default RegisterPage;