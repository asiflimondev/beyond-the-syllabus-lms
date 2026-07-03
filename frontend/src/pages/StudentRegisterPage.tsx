import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { admissionApi } from '@api/admission.api';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentRegisterFormData>({
    resolver: yupResolver(studentRegisterSchema),
  });


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
    // Show more detailed error
    const message = error.response?.data?.message || 'Failed to register. Please check your Admission ID and try again.';
    toast.error(message);
    
    // Log the full error for debugging
    if (error.response) {
      console.log('Error response:', error.response.data);
      console.log('Error status:', error.response.status);
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">Beyond the Syllabus</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Student Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your Admission ID to create your account
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Admission ID Field */}
            <div>
              <label htmlFor="admissionId" className="label">
                Admission ID *
              </label>
              <input
                id="admissionId"
                type="text"
                placeholder="Enter your Admission ID (e.g., BTS101)"
                className={`input-field ${errors.admissionId ? 'border-red-500' : ''}`}
                {...register('admissionId')}
              />
              {errors.admissionId && (
                <p className="mt-1 text-sm text-red-600">{errors.admissionId.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                You received your Admission ID from the office when you were admitted
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label">
                Password *
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegisterPage;