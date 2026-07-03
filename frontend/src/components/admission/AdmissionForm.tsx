import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { programsApi, Program } from '@api/programs.api';
import { admissionApi } from '@api/admission.api';

interface AdmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const admissionSchema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  phone: yup.string().required('Phone number is required').min(11, 'Phone number must be at least 11 digits'),
  parentPhone: yup.string().optional(),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  programId: yup.string().required('Please select a program'),
  admissionId: yup.string().optional(),
  fatherName: yup.string().optional(),
  motherName: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().oneOf(['male', 'female', 'other']).optional(),
  bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  address: yup.string().optional(),
  schoolCollege: yup.string().optional(),
});

type AdmissionFormData = yup.InferType<typeof admissionSchema>;

const AdmissionForm: React.FC<AdmissionFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admissionMode, setAdmissionMode] = useState<'manual' | 'automatic'>('automatic');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdmissionFormData>({
    resolver: yupResolver(admissionSchema),
    defaultValues: {
      gender: 'male',
    },
  });

  // Fetch active programs for admission
  const { data: programsData, isLoading: programsLoading, error: programsError } = useQuery({
    queryKey: ['programs', 'active', 'admission'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  // Fetch admission settings
  const { data: settingsData } = useQuery({
    queryKey: ['admission-settings'],
    queryFn: () => admissionApi.getSettings(),
  });

  useEffect(() => {
    if (settingsData?.data) {
      setAdmissionMode(settingsData.data.mode);
    }
  }, [settingsData]);

  // Extract programs from the response - data is the Axios response
  const extractPrograms = (): Program[] => {
    if (!programsData) return [];
    
    // The response is AxiosResponse, so the actual data is in programsData.data
    const responseData = programsData.data;
    
    if (!responseData) return [];
    
    // Check for the structure: { success: true, data: { programs: [...] } }
    if (responseData.data?.programs && Array.isArray(responseData.data.programs)) {
      return responseData.data.programs;
    }
    
    // Check for: { data: { programs: [...] } }
    if (responseData.programs && Array.isArray(responseData.programs)) {
      return responseData.programs;
    }
    
    // Check if data itself is an array
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    // Try to find any array property
    for (const key in responseData) {
      if (Array.isArray(responseData[key]) && responseData[key].length > 0) {
        const firstItem = responseData[key][0];
        if (firstItem && typeof firstItem === 'object' && 'name' in firstItem) {
          return responseData[key];
        }
      }
    }
    
    return [];
  };

  const programs = extractPrograms();

  const handleSubmitForm = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        ...(admissionMode === 'automatic' && { admissionId: undefined }),
      };

      const response = await admissionApi.admitStudent(submitData);
      
      if (response.data.success) {
        toast.success('Student admitted successfully!');
        reset();
        onSuccess();
        setTimeout(() => onClose(), 1500);
      }
    } catch (error: any) {
      console.error('Admission error:', error);
      toast.error(error.response?.data?.message || 'Failed to admit student');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Admit New Student</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Admission Mode Banner */}
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>
                Admission Mode: <strong className="uppercase">{admissionMode}</strong>
                {admissionMode === 'automatic' && ' - IDs will be auto-generated'}
                {admissionMode === 'manual' && ' - You need to enter Admission ID manually'}
              </span>
            </div>
          </div>

          {/* Show error if programs fail to load */}
          {programsError && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              Failed to load programs: {(programsError as any)?.message || 'Unknown error'}
            </div>
          )}

          {/* Loading State for Programs */}
          {programsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading programs...</span>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit(handleSubmitForm)} className="p-6 space-y-6">
              {/* Personal Information Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className="label">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter full name"
                      className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="label">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="text"
                      placeholder="017XXXXXXXX"
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="parentPhone" className="label">
                      Parent Phone
                    </label>
                    <input
                      id="parentPhone"
                      type="text"
                      placeholder="017XXXXXXXX"
                      className="input-field"
                      {...register('parentPhone')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="label">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="fatherName" className="label">
                      Father's Name
                    </label>
                    <input
                      id="fatherName"
                      type="text"
                      placeholder="Enter father's name"
                      className="input-field"
                      {...register('fatherName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="motherName" className="label">
                      Mother's Name
                    </label>
                    <input
                      id="motherName"
                      type="text"
                      placeholder="Enter mother's name"
                      className="input-field"
                      {...register('motherName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="label">
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      className="input-field"
                      {...register('dateOfBirth')}
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="label">
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="input-field"
                      {...register('gender')}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bloodGroup" className="label">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      className="input-field"
                      {...register('bloodGroup')}
                    >
                      <option value="">Select</option>
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

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="label">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="Enter address"
                      className="input-field"
                      {...register('address')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="schoolCollege" className="label">
                      School/College
                    </label>
                    <input
                      id="schoolCollege"
                      type="text"
                      placeholder="Enter school or college name"
                      className="input-field"
                      {...register('schoolCollege')}
                    />
                  </div>
                </div>
              </div>

              {/* Program & Admission Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Program & Admission</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="programId" className="label">
                      Program *
                    </label>
                    <select
                      id="programId"
                      className={`input-field ${errors.programId ? 'border-red-500' : ''}`}
                      {...register('programId')}
                    >
                      <option value="">Select a program</option>
                      {programs && programs.length > 0 ? (
                        programs.map((program: Program) => (
                          <option key={program.id} value={program.id}>
                            {program.displayName?.en || program.name} ({program.name})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No active programs available</option>
                      )}
                    </select>
                    {errors.programId && (
                      <p className="mt-1 text-sm text-red-600">{errors.programId.message}</p>
                    )}
                    {programs && programs.length === 0 && !programsLoading && (
                      <p className="mt-1 text-sm text-amber-600">
                        No active programs found. Please create a program first.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="admissionId" className="label">
                      {admissionMode === 'automatic' ? 'Admission ID (Auto-generated)' : 'Admission ID *'}
                    </label>
                    <input
                      id="admissionId"
                      type="text"
                      placeholder={admissionMode === 'automatic' ? 'Will be auto-generated' : 'Enter Admission ID'}
                      className={`input-field ${errors.admissionId ? 'border-red-500' : ''}`}
                      {...register('admissionId')}
                      disabled={admissionMode === 'automatic'}
                      readOnly={admissionMode === 'automatic'}
                    />
                    {errors.admissionId && (
                      <p className="mt-1 text-sm text-red-600">{errors.admissionId.message}</p>
                    )}
                    {admissionMode === 'automatic' && (
                      <p className="mt-1 text-xs text-gray-500">ID will be generated automatically when you submit</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                  disabled={isSubmitting || programs.length === 0}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Admitting...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Admit Student</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdmissionForm;