import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {teacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Account Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address *</label>
                  <input
                    type="email"
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="teacher@example.com"
                    {...register('email')}
                    disabled={isEdit}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Password {!isEdit && '*'}</label>
                  <input
                    type="password"
                    className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                    placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="John Teacher"
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    type="text"
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="017XXXXXXXX"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    className="input-field"
                    {...register('dateOfBirth')}
                  />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select className="input-field" {...register('gender')}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Blood Group</label>
                  <select 
                    className="input-field" 
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
                  <label className="label">Address</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter address"
                    {...register('address')}
                  />
                </div>
              </div>
            </div>

            {/* Program Assignment */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Assigned Programs</h4>
              <div className="space-y-2">
                {programs.length === 0 ? (
                  <p className="text-sm text-gray-500">No active programs available</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {programs.map((program: Program) => (
                      <label key={program.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          value={program.id}
                          defaultChecked={teacher?.programIds?.some(
                            (p: any) => p._id === program.id || p === program.id
                          )}
                          {...register('programIds')}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span>{program.displayName?.en || program.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {teacher ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  teacher ? 'Update Teacher' : 'Create Teacher'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;