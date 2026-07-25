import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, User, Mail, Lock, Phone, Calendar, MapPin, UserCircle, Droplet, AlertCircle, Loader2 } from 'lucide-react';

interface OfficeMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  officeMember?: any | null;
  isLoading?: boolean;
}

const officeMemberSchema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().when('$isEdit', {
    is: false,
    then: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters'),
    otherwise: (schema) => schema.optional(),
  }),
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  phone: yup.string().required('Phone number is required').min(11, 'Phone must be at least 11 digits'),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().oneOf(['male', 'female', 'other']).optional(),
  bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),
  address: yup.string().optional(),
});

const OfficeMemberForm: React.FC<OfficeMemberFormProps> = ({ isOpen, onClose, onSubmit, officeMember, isLoading }) => {
  const isEdit = !!officeMember;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(officeMemberSchema),
    context: { isEdit },
    defaultValues: {
      gender: 'male',
    },
  });

  useEffect(() => {
    if (officeMember) {
      reset({
        fullName: officeMember.fullName || '',
        email: officeMember.email || '',
        phone: officeMember.phone || '',
        dateOfBirth: officeMember.dateOfBirth || '',
        gender: officeMember.gender || 'male',
        bloodGroup: officeMember.bloodGroup || undefined,
        address: officeMember.address || '',
      });
    } else {
      reset({
        gender: 'male',
        password: '',
      });
    }
  }, [officeMember, reset]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex items-center justify-between rounded-t-2xl flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isEdit ? 'Edit Office Member' : 'Add Office Member'}
                </h3>
                <p className="text-sm text-primary-100">
                  {isEdit ? 'Update office member details' : 'Create a new office member account'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none`}
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter password (min 6 characters)"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none`}
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.password.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">Minimum 6 characters required</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none`}
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                      {...register('dateOfBirth')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none bg-white"
                      {...register('gender')}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Droplet className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none bg-white"
                    {...register('bloodGroup')}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                    {...register('address')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>{isEdit ? 'Update' : 'Create'} Office Member</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OfficeMemberForm;