import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { X, UserPlus, Sparkles, User, Phone, Mail, Calendar, MapPin, School, Users, Hash, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
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
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          
          {/* Header - Fixed with proper z-index and background */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex items-center justify-between rounded-t-2xl flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Admit New Student</h3>
                <p className="text-sm text-primary-100">Register a new student for a program</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Admission Mode Banner - Now scrollable (removed sticky) */}
            <div className={`mt-4 rounded-xl p-4 flex items-center justify-between ${
              admissionMode === 'automatic' 
                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200' 
                : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  admissionMode === 'automatic' ? 'bg-blue-100' : 'bg-amber-100'
                }`}>
                  <Sparkles className={`w-4 h-4 ${
                    admissionMode === 'automatic' ? 'text-blue-600' : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    admissionMode === 'automatic' ? 'text-blue-800' : 'text-amber-800'
                  }`}>
                    Admission Mode: <strong className="uppercase">{admissionMode}</strong>
                  </p>
                  <p className={`text-xs ${
                    admissionMode === 'automatic' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {admissionMode === 'automatic' 
                      ? 'IDs will be auto-generated for each student' 
                      : 'You need to enter Admission ID manually'}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                admissionMode === 'automatic' 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-amber-200 text-amber-800'
              }`}>
                {admissionMode === 'automatic' ? 'Auto' : 'Manual'}
              </div>
            </div>

            {/* Show error if programs fail to load */}
            {programsError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Failed to load programs</p>
                  <p className="text-sm text-red-600">{(programsError as any)?.message || 'Unknown error'}</p>
                </div>
              </div>
            )}

            {/* Loading State for Programs */}
            {programsLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                <span className="mt-4 text-gray-600 font-medium">Loading programs...</span>
              </div>
            ) : (
              /* Form - Enhanced */
              <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-8 mt-4">
                {/* Personal Information Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700">Personal Information</h4>
                    <span className="text-xs text-gray-400 ml-auto">All fields with * are required</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="fullName"
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          type="text"
                          placeholder="017XXXXXXXX"
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

                    <div>
                      <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Parent Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="parentPhone"
                          type="text"
                          placeholder="017XXXXXXXX"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                          {...register('parentPhone')}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          placeholder="student@example.com"
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

                    <div>
                      <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Father's Name
                      </label>
                      <input
                        id="fatherName"
                        type="text"
                        placeholder="Enter father's name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                        {...register('fatherName')}
                      />
                    </div>

                    <div>
                      <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mother's Name
                      </label>
                      <input
                        id="motherName"
                        type="text"
                        placeholder="Enter mother's name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                        {...register('motherName')}
                      />
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="dateOfBirth"
                          type="date"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                          {...register('dateOfBirth')}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Gender
                      </label>
                      <select
                        id="gender"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none bg-white"
                        {...register('gender')}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Blood Group
                      </label>
                      <select
                        id="bloodGroup"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none bg-white"
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
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="address"
                          type="text"
                          placeholder="Enter address"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                          {...register('address')}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="schoolCollege" className="block text-sm font-medium text-gray-700 mb-1.5">
                        School/College
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <School className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="schoolCollege"
                          type="text"
                          placeholder="Enter school or college name"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
                          {...register('schoolCollege')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program & Admission Section - Enhanced */}
                <div className="border-t-2 border-gray-100 pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700">Program & Admission</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Program <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="programId"
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.programId ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none bg-white`}
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
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.programId.message}
                        </p>
                      )}
                      {programs && programs.length === 0 && !programsLoading && (
                        <p className="mt-1.5 text-sm text-amber-600 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          No active programs found. Please create a program first.
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="admissionId" className="block text-sm font-medium text-gray-700 mb-1.5">
                        {admissionMode === 'automatic' ? 'Admission ID' : 'Admission ID *'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="admissionId"
                          type="text"
                          placeholder={admissionMode === 'automatic' ? 'Will be auto-generated' : 'Enter Admission ID'}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.admissionId ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none ${admissionMode === 'automatic' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                          {...register('admissionId')}
                          disabled={admissionMode === 'automatic'}
                          readOnly={admissionMode === 'automatic'}
                        />
                      </div>
                      {errors.admissionId && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.admissionId.message}
                        </p>
                      )}
                      {admissionMode === 'automatic' && (
                        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          ID will be generated automatically when you submit
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions - Enhanced */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t-2 border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>,
    document.body
  );
};

export default AdmissionForm;