import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Save, Loader2, BookOpen, Users, DollarSign, Clock } from 'lucide-react';
import { Program } from '@api/programs.api';

interface ProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  program?: Program | null;
  isLoading?: boolean;
}

const programSchema = yup.object({
  name: yup.string().required('Program name is required').min(2, 'Name must be at least 2 characters'),
  displayName: yup.object({
    en: yup.string().required('English display name is required'),
    bn: yup.string().required('Bangla display name is required'),
  }),
  description: yup.object({
    en: yup.string().required('English description is required'),
    bn: yup.string().required('Bangla description is required'),
  }),
  duration: yup.number().required('Duration is required').min(1, 'Duration must be at least 1 month'),
  fee: yup.number().required('Fee is required').min(0, 'Fee cannot be negative'),
  teacherIds: yup.array().of(yup.string()).optional(),
  isActive: yup.boolean().optional(),
});

type ProgramFormData = yup.InferType<typeof programSchema>;

const ProgramForm: React.FC<ProgramFormProps> = ({ isOpen, onClose, onSubmit, program, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProgramFormData>({
    resolver: yupResolver(programSchema),
    defaultValues: {
      isActive: true,
      teacherIds: [],
    },
  });

  useEffect(() => {
    if (program) {
      setValue('name', program.name);
      setValue('displayName', program.displayName || { en: '', bn: '' });
      setValue('description', program.description || { en: '', bn: '' });
      setValue('duration', program.duration);
      setValue('fee', program.fee);
      setValue('teacherIds', program.teacherIds || []);
      setValue('isActive', program.isActive !== false);
    } else {
      reset({
        isActive: true,
        teacherIds: [],
        displayName: { en: '', bn: '' },
        description: { en: '', bn: '' },
      });
    }
  }, [program, setValue, reset]);

  const handleFormSubmit = (data: ProgramFormData) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/50">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {program ? 'Edit Program' : 'Create New Program'}
                </h3>
                <p className="text-sm text-primary-100">
                  {program ? 'Update program details' : 'Add a new program to the system'}
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
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary-500 rounded-full" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Program Code *</label>
                  <input
                    type="text"
                    placeholder="e.g., KET, PET, FCE"
                    className={`input ${errors.name ? 'input-error' : ''}`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Display Name (English) *</label>
                  <input
                    type="text"
                    placeholder="e.g., Key English Test"
                    className={`input ${errors.displayName?.en ? 'input-error' : ''}`}
                    {...register('displayName.en')}
                  />
                  {errors.displayName?.en && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName.en.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Display Name (Bangla) *</label>
                  <input
                    type="text"
                    placeholder="e.g., কী ইংলিশ টেস্ট"
                    className={`input ${errors.displayName?.bn ? 'input-error' : ''}`}
                    {...register('displayName.bn')}
                  />
                  {errors.displayName?.bn && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName.bn.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description (English) *</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the program in English..."
                    className={`input resize-none ${errors.description?.en ? 'input-error' : ''}`}
                    {...register('description.en')}
                  />
                  {errors.description?.en && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.en.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description (Bangla) *</label>
                  <textarea
                    rows={3}
                    placeholder="বাংলায় প্রোগ্রামটি বর্ণনা করুন..."
                    className={`input resize-none ${errors.description?.bn ? 'input-error' : ''}`}
                    {...register('description.bn')}
                  />
                  {errors.description?.bn && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.bn.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Program Details */}
            <div className="border-t border-gray-200/50 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary-500 rounded-full" />
                Program Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Duration (months) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 7"
                    className={`input ${errors.duration ? 'input-error' : ''}`}
                    {...register('duration')}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                  )}
                </div>
                <div>
                  <label className="label flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Fee (BDT) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 15000"
                    className={`input ${errors.fee ? 'input-error' : ''}`}
                    {...register('fee')}
                  />
                  {errors.fee && (
                    <p className="mt-1 text-sm text-red-600">{errors.fee.message}</p>
                  )}
                </div>
                <div>
                  <label className="label flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    Teacher IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., teacher-id-1, teacher-id-2"
                    className="input"
                    {...register('teacherIds')}
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-2">Status</label>
                  <select className="input" {...register('isActive')}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
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
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {program ? 'Update Program' : 'Create Program'}
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

export default ProgramForm;