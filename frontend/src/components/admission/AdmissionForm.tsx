import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { X, UserPlus, User, Phone, Mail, Calendar, MapPin, School, Users, Hash, BookOpen, CheckCircle, AlertCircle, DollarSign, Settings, Edit, Save, Sparkles, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { programsApi, Program } from '@api/programs.api';
import { admissionApi, AdmitStudentResponse } from '@api/admission.api';
import ReceiptPreview from './ReceiptPreview';

interface AdmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  parentPhone?: string;
  email: string;
  programId: string;
  admissionId: string;
  paymentAmount: number;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address?: string;
  schoolCollege?: string;
}

const formSchema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  phone: yup.string().required('Phone number is required').min(11, 'Phone number must be at least 11 digits'),
  parentPhone: yup.string().optional(),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  programId: yup.string().required('Please select a program'),
  admissionId: yup
    .string()
    .required('Admission ID is required')
    .trim()
    .min(2, 'Admission ID must be at least 2 characters'),
  paymentAmount: yup
    .number()
    .typeError('Payment amount must be a number')
    .required('Payment amount is required')
    .min(1, 'Payment amount must be at least 1 BDT'),
  fatherName: yup.string().optional(),
  motherName: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().oneOf(['male', 'female', 'other'] as const).optional(),
  bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const).optional(),
  address: yup.string().optional(),
  schoolCollege: yup.string().optional(),
});

const AdmissionForm: React.FC<AdmissionFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isEditingPrefix, setIsEditingPrefix] = useState(false);
  const [isEditingStartNumber, setIsEditingStartNumber] = useState(false);
  const [tempPrefix, setTempPrefix] = useState('BTS');
  const [tempStartNumber, setTempStartNumber] = useState(100);
  const [suggestedId, setSuggestedId] = useState<string>('');
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [allExistingIds, setAllExistingIds] = useState<string[]>([]);
  const [currentDisplayPrefix, setCurrentDisplayPrefix] = useState('BTS');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema) as any,
    defaultValues: {
      gender: 'male',
      paymentAmount: undefined,
      admissionId: '',
    },
  });

  const watchAdmissionId = watch('admissionId');

  // Fetch active programs for admission
  const { data: programsData, isLoading: programsLoading, error: programsError } = useQuery({
    queryKey: ['programs', 'active', 'admission'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  // Fetch admission settings
  const { data: settingsData, refetch: refetchSettings } = useQuery({
    queryKey: ['admission-settings'],
    queryFn: () => admissionApi.getSettings(),
  });

  useEffect(() => {
    if (settingsData?.data?.data) {
      const prefix = settingsData.data.data.prefix || 'BTS';
      const startNumber = settingsData.data.data.currentNumber || 100;
      setTempPrefix(prefix);
      setTempStartNumber(startNumber);
      setCurrentDisplayPrefix(prefix);
    }
  }, [settingsData]);

  // Fetch all existing IDs and check availability
  const fetchExistingIds = async () => {
    try {
      const response = await admissionApi.getAllStudents({ limit: 10000 });
      const students = response.data?.data?.students || [];
      const ids = students.map((s: any) => s.admissionId);
      setAllExistingIds(ids);
      return ids;
    } catch (error) {
      console.error('Error fetching existing IDs:', error);
      return [];
    }
  };

  // Function to check if an ID exists (including soft-deleted)
  const checkIdExists = (id: string): boolean => {
    if (!id || id.trim() === '') return false;
    return allExistingIds.some((existingId: string) => 
      existingId.toLowerCase() === id.trim().toLowerCase()
    );
  };

  // Function to get the next available ID
  // FIX: now accepts an optional `ids` param so callers can pass freshly-fetched
  // ids directly (avoiding stale-closure reads of `allExistingIds` before the
  // state update from setAllExistingIds has actually applied).
  const getNextAvailableId = (prefix: string, startNum: number, ids: string[] = allExistingIds): string => {
    let maxNumber = startNum - 1;
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    
    for (const id of ids) {
      const match = id.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    }
    
    const nextNumber = Math.max(maxNumber + 1, startNum);
    const paddedNumber = String(nextNumber).padStart(3, '0');
    return `${prefix}${paddedNumber}`;
  };

  // Update suggestion when prefix, start number, or existing IDs change
  // FIX: use the ids returned directly from fetchExistingIds() instead of
  // relying on the allExistingIds state variable, which wouldn't be updated
  // yet at this point in the same tick — that stale read was why it kept
  // suggesting "100" even when 100-104 already existed.
  useEffect(() => {
    const updateSuggestion = async () => {
      const freshIds = await fetchExistingIds();
      const prefix = currentDisplayPrefix || 'BTS';
      const startNum = tempStartNumber || 100;
      const suggestion = getNextAvailableId(prefix, startNum, freshIds);
      setSuggestedId(suggestion);
    };
    updateSuggestion();
  }, [currentDisplayPrefix, tempStartNumber]);

  // Check ID availability in real-time
  useEffect(() => {
    const checkAvailability = () => {
      if (!watchAdmissionId || watchAdmissionId.length < 2) {
        setIsCheckingId(false);
        return;
      }
      
      setIsCheckingId(true);
      const exists = checkIdExists(watchAdmissionId);
      
      // Update visual feedback
      const inputElement = document.getElementById('admissionId');
      if (inputElement) {
        if (exists) {
          inputElement.classList.remove('border-green-500', 'ring-green-500', 'bg-green-50');
          inputElement.classList.add('border-red-500', 'ring-red-500', 'bg-red-50');
        } else {
          inputElement.classList.remove('border-red-500', 'ring-red-500', 'bg-red-50');
          inputElement.classList.add('border-green-500', 'ring-green-500', 'bg-green-50');
        }
      }
      
      setIsCheckingId(false);
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [watchAdmissionId, allExistingIds]);

  const extractPrograms = (): Program[] => {
    if (!programsData) return [];
    const responseData = programsData.data;
    if (!responseData) return [];
    if (responseData.data?.programs && Array.isArray(responseData.data.programs)) {
      return responseData.data.programs;
    }
    if (responseData.programs && Array.isArray(responseData.programs)) {
      return responseData.programs;
    }
    if (Array.isArray(responseData)) {
      return responseData;
    }
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

  // Handle prefix update
  const handlePrefixUpdate = async () => {
    if (!tempPrefix || tempPrefix.trim() === '') {
      toast.error('Prefix cannot be empty');
      return;
    }

    setIsUpdatingSettings(true);
    try {
      const currentSettings = settingsData?.data?.data || { mode: 'manual', prefix: 'BTS', currentNumber: 100 };
      const newPrefix = tempPrefix.trim().toUpperCase();

      const updateResponse = await admissionApi.updateSettings({
        mode: 'manual',
        prefix: newPrefix,
        currentNumber: currentSettings.currentNumber || 100,
      });

      const refetchResult = await refetchSettings();

      const confirmedPrefix =
        (updateResponse as any)?.data?.data?.prefix ||
        (refetchResult as any)?.data?.data?.data?.prefix ||
        newPrefix;

      setIsEditingPrefix(false);
      setTempPrefix(confirmedPrefix);
      setCurrentDisplayPrefix(confirmedPrefix);
      toast.success(`Prefix updated to ${confirmedPrefix}`);
    } catch (error: any) {
      console.error('Failed to update prefix:', error);
      toast.error('Failed to update prefix');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Handle start number update
  const handleStartNumberUpdate = async () => {
    if (tempStartNumber === undefined || tempStartNumber === null || tempStartNumber < 0) {
      toast.error('Start number must be a positive number');
      return;
    }

    setIsUpdatingSettings(true);
    try {
      const currentSettings = settingsData?.data?.data || { mode: 'manual', prefix: 'BTS', currentNumber: 100 };
      
      await admissionApi.updateSettings({
        mode: 'manual',
        prefix: currentSettings.prefix || 'BTS',
        currentNumber: tempStartNumber,
      });

      await refetchSettings();
      setIsEditingStartNumber(false);
      toast.success(`Start number updated to ${tempStartNumber}`);
    } catch (error: any) {
      console.error('Failed to update start number:', error);
      toast.error('Failed to update start number');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Apply suggestion to form
  const applySuggestion = () => {
    if (suggestedId) {
      setValue('admissionId', suggestedId);
      // Trigger the check manually
      setTimeout(() => {
        const exists = checkIdExists(suggestedId);
        const inputElement = document.getElementById('admissionId');
        if (inputElement) {
          if (exists) {
            inputElement.classList.remove('border-green-500', 'ring-green-500', 'bg-green-50');
            inputElement.classList.add('border-red-500', 'ring-red-500', 'bg-red-50');
          } else {
            inputElement.classList.remove('border-red-500', 'ring-red-500', 'bg-red-50');
            inputElement.classList.add('border-green-500', 'ring-green-500', 'bg-green-50');
          }
        }
      }, 100);
      toast.success(`Applied suggested ID: ${suggestedId}`);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Double-check if admission ID already exists
      const enteredId = data.admissionId.trim();
      const exists = checkIdExists(enteredId);
      
      if (exists) {
        toast.error(`Admission ID "${enteredId}" already exists. Please use a different ID.`);
        setIsSubmitting(false);
        return;
      }

      const submitData: any = {
        fullName: data.fullName,
        phone: data.phone,
        parentPhone: data.parentPhone || '',
        email: data.email,
        programId: data.programId,
        paymentAmount: Number(data.paymentAmount),
        admissionId: enteredId,
        fatherName: data.fatherName || '',
        motherName: data.motherName || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'male',
        bloodGroup: data.bloodGroup || '',
        address: data.address || '',
        schoolCollege: data.schoolCollege || '',
      };

      const admitResponse = await admissionApi.admitStudent(submitData) as { data: AdmitStudentResponse };
      
      if (admitResponse.data.success) {
        toast.success('Student admitted successfully!');
        
        setReceiptData({
          id: admitResponse.data.data.receiptId,
          receiptNumber: admitResponse.data.data.receiptNumber,
          studentName: admitResponse.data.data.student.fullName,
          studentAdmissionId: admitResponse.data.data.admissionId,
          studentPhone: data.phone,
          studentEmail: data.email,
          programName: programs.find(p => p.id === data.programId)?.displayName?.en || 'N/A',
          paymentAmount: Number(data.paymentAmount),
          paymentMethod: 'Cash',
          receiptDate: new Date().toISOString(),
        });
        
        setShowReceipt(true);
        
        // Reset form and refresh data
        reset();
        // FIX: capture the freshly-fetched ids and pass them directly into
        // getNextAvailableId, instead of relying on allExistingIds state
        // (which wouldn't have updated yet in this same tick).
        const freshIds = await fetchExistingIds();
        
        // Update suggestion after reset
        const prefix = currentDisplayPrefix || 'BTS';
        const startNum = tempStartNumber || 100;
        const newSuggestion = getNextAvailableId(prefix, startNum, freshIds);
        setSuggestedId(newSuggestion);
        
        onSuccess();
      }
    } catch (error: any) {
      console.error('Admission error:', error);
      toast.error(error.response?.data?.message || 'Failed to admit student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
    onClose();
  };

  if (!isOpen) return null;

  const currentPrefix = settingsData?.data?.data?.prefix || 'BTS';
  const currentStartNumber = settingsData?.data?.data?.currentNumber || 100;

  // Check if the current typed ID is valid (for display)
  const isIdValid = Boolean(watchAdmissionId && watchAdmissionId.length >= 2 && !checkIdExists(watchAdmissionId));
  const isIdInvalid = Boolean(watchAdmissionId && watchAdmissionId.length >= 2 && checkIdExists(watchAdmissionId));
  const isSubmitDisabled = isSubmitting || programs.length === 0 || isIdInvalid;

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            
            {/* Header */}
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
              {/* ============================================
                  ADMISSION ID SETTINGS
                  ============================================ */}
              <div className="mt-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-700">Admission ID Settings</h4>
                  <span className="text-xs text-gray-400 ml-auto">Manual Mode</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Prefix Setting */}
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">Prefix</label>
                    <div className="flex items-center gap-2 mt-1">
                      {isEditingPrefix ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={tempPrefix}
                            onChange={(e) => setTempPrefix(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            placeholder="Enter prefix"
                            maxLength={10}
                            disabled={isUpdatingSettings}
                          />
                          <button
                            type="button"
                            onClick={handlePrefixUpdate}
                            disabled={isUpdatingSettings}
                            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingPrefix(false);
                              setTempPrefix(currentPrefix);
                            }}
                            disabled={isUpdatingSettings}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                            {currentDisplayPrefix}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingPrefix(true)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Start Number Setting */}
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">Start Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      {isEditingStartNumber ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="number"
                            value={tempStartNumber}
                            onChange={(e) => setTempStartNumber(Number(e.target.value))}
                            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            placeholder="Enter start number"
                            min={0}
                            disabled={isUpdatingSettings}
                          />
                          <button
                            type="button"
                            onClick={handleStartNumberUpdate}
                            disabled={isUpdatingSettings}
                            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingStartNumber(false);
                              setTempStartNumber(currentStartNumber);
                            }}
                            disabled={isUpdatingSettings}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                            {currentStartNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingStartNumber(true)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggested ID */}
                <div className="mt-3 pt-3 border-t border-gray-200/60">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Suggested Next ID:</span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      {suggestedId || `${currentDisplayPrefix}${String(currentStartNumber).padStart(3, '0')}`}
                    </span>
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="ml-auto text-xs text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-lg transition-all flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    IDs are checked against all students (including deleted) to prevent duplicates
                  </p>
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
                /* Form */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
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

                  {/* Program & Admission Section */}
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
                          Admission ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            id="admissionId"
                            type="text"
                            placeholder={`Enter Admission ID (e.g., ${suggestedId || currentDisplayPrefix + '100'})`}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 outline-none bg-white ${
                              errors.admissionId 
                                ? 'border-red-400 bg-red-50' 
                                : isIdInvalid 
                                ? 'border-red-500 ring-red-500 bg-red-50' 
                                : isIdValid 
                                ? 'border-green-500 ring-green-500 bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                            }`}
                            {...register('admissionId')}
                          />
                          {watchAdmissionId && watchAdmissionId.length >= 2 && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <span className={`text-xs px-2 py-1 rounded-lg ${
                                isCheckingId 
                                  ? 'text-gray-400 bg-gray-100' 
                                  : isIdInvalid 
                                  ? 'text-red-600 bg-red-100' 
                                  : isIdValid 
                                  ? 'text-green-600 bg-green-100' 
                                  : 'text-gray-400 bg-gray-100'
                              }`}>
                                {isCheckingId 
                                  ? 'Checking...' 
                                  : isIdInvalid 
                                  ? 'Exists ✗' 
                                  : isIdValid 
                                  ? 'Available ✓' 
                                  : ''}
                              </span>
                            </div>
                          )}
                        </div>
                        {errors.admissionId && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.admissionId.message}
                          </p>
                        )}
                        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Enter a unique ID. The system will check for duplicates (including deleted students).
                        </p>
                        {suggestedId && (
                          <p className="mt-1 text-xs text-blue-600 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Suggested: <strong>{suggestedId}</strong>
                            <button
                              type="button"
                              onClick={applySuggestion}
                              className="text-primary-600 hover:text-primary-700 underline ml-1"
                            >
                              Use this
                            </button>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="border-t-2 border-gray-100 pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700">Payment Information</h4>
                      <span className="text-xs text-red-500 ml-auto">* Required</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Payment Amount (BDT) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            id="paymentAmount"
                            type="number"
                            placeholder="Enter payment amount"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.paymentAmount ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none`}
                            {...register('paymentAmount')}
                          />
                        </div>
                        {errors.paymentAmount && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.paymentAmount.message}
                          </p>
                        )}
                        <p className="mt-1.5 text-xs text-gray-400">
                          Enter the exact amount paid by the student (e.g., 2500, 5000, 8500)
                        </p>
                      </div>

                      <div>
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Payment Method
                        </label>
                        <select
                          id="paymentMethod"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none bg-white"
                          defaultValue="Cash"
                        >
                          <option value="Cash">Cash</option>
                        </select>
                        <p className="mt-1.5 text-xs text-gray-400">
                          Currently only Cash payment is supported
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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
                      disabled={isSubmitDisabled}
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
      </div>

      {/* Receipt Preview Modal */}
      {showReceipt && receiptData && (
        <ReceiptPreview
          isOpen={showReceipt}
          onClose={handleCloseReceipt}
          receiptData={receiptData}
        />
      )}
    </>,
    document.body
  );
};

export default AdmissionForm;