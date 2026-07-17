import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Save, Loader2, User, Mail, Phone, UserPlus, Calendar, MapPin, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { programsApi, Program } from '@api/programs.api';
import { Teacher } from '@api/admin/teacher.api';

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  teacher?: Teacher | null;
  isLoading: boolean;
}

// Define blood group type
type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const teacherSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .when('$isEdit', {
      is: false,
      then: (schema) => schema
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      otherwise: (schema) => schema.optional(),
    }),
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .min(11, 'Phone number must be at least 11 digits'),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().oneOf(['male', 'female', 'other']).optional(),
  bloodGroup: yup
    .mixed<BloodGroup>()
    .oneOf(bloodGroups)
    .optional()
    .nullable(),
  address: yup.string().optional(),
  programIds: yup.array().of(yup.string()).optional(),
});

type TeacherFormData = yup.InferType<typeof teacherSchema>;

const TeacherForm: React.FC<TeacherFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teacher,
  isLoading,
}) => {
  const isEdit = !!teacher;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: yupResolver(teacherSchema),
    context: { isEdit },
    defaultValues: {
      gender: 'male',
      bloodGroup: null,
      programIds: [],
    },
  });

  // Fetch programs for selection
  const { data: programsData } = useQuery({
    queryKey: ['programs', 'active'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  const programs = programsData?.data?.data?.programs || [];

  useEffect(() => {
    if (teacher) {
      reset({
        email: teacher.email,
        fullName: teacher.fullName,
        phone: teacher.phone,
        dateOfBirth: teacher.dateOfBirth || '',
        gender: teacher.gender || 'male',
        bloodGroup: teacher.bloodGroup as BloodGroup || null,
        address: teacher.address || '',
        programIds: teacher.programIds?.map((p: any) => p._id || p) || [],
      });
    } else {
      reset({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: null,
        address: '',
        programIds: [],
      });
    }
  }, [teacher, reset]);

  // Modal content
  const renderModal = () => {
    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-[10000] min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/50 animate-scale-in">
            {/* Header - Glass Gradient */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {teacher ? 'Edit Teacher' : 'Add New Teacher'}
                  </h3>
                  <p className="text-sm text-primary-100">
                    {teacher ? 'Update teacher information' : 'Add a new teacher to the system'}
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
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Account Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary-500 rounded-full" />
                  Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label font-medium text-gray-700">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        className={`w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="teacher@example.com"
                        {...register('email')}
                        disabled={isEdit}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Password {!isEdit && '*'}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className={`w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all ${errors.password ? 'border-red-500' : ''}`}
                        placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'}
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-t border-gray-200/50 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary-500 rounded-full" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label font-medium text-gray-700">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all ${errors.fullName ? 'border-red-500' : ''}`}
                        placeholder="John Teacher"
                        {...register('fullName')}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="017XXXXXXXX"
                        {...register('phone')}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Date of Birth</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        {...register('dateOfBirth')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Gender</label>
                    <select 
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      {...register('gender')}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Blood Group</label>
                    <select 
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      {...register('bloodGroup')}
                      value={watch('bloodGroup') || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue('bloodGroup', value === '' ? null : value as BloodGroup);
                      }}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroup && (
                      <p className="mt-1 text-sm text-red-600">{errors.bloodGroup.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="label font-medium text-gray-700">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        placeholder="Enter address"
                        {...register('address')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Assignment */}
              <div className="border-t border-gray-200/50 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary-500 rounded-full" />
                  Assigned Programs
                </h4>
                <div className="space-y-2">
                  {programs.length === 0 ? (
                    <p className="text-sm text-gray-500 bg-gray-50/80 rounded-xl p-4 text-center">No active programs available</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {programs.map((program: Program) => (
                        <label 
                          key={program.id} 
                          className="flex items-center space-x-3 text-sm p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-all cursor-pointer border border-transparent hover:border-primary-200/50"
                        >
                          <input
                            type="checkbox"
                            value={program.id}
                            defaultChecked={teacher?.programIds?.some(
                              (p: any) => p._id === program.id || p === program.id
                            )}
                            {...register('programIds')}
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-700">{program.displayName?.en || program.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200/50">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {teacher ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {teacher ? 'Update Teacher' : 'Create Teacher'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return renderModal();
};

export default TeacherForm;