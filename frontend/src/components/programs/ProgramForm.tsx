import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { Program } from '@api/programs.api';

interface ProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  program?: Program | null;
  isLoading: boolean;
}

const programSchema = yup.object({
  name: yup
    .string()
    .required('Program name is required')
    .min(2, 'Program name must be at least 2 characters')
    .max(50, 'Program name must be at most 50 characters'),
  displayName: yup.object({
    en: yup
      .string()
      .required('English display name is required')
      .min(2, 'English display name must be at least 2 characters')
      .max(100, 'English display name must be at most 100 characters'),
    bn: yup
      .string()
      .required('Bangla display name is required')
      .min(2, 'Bangla display name must be at least 2 characters')
      .max(100, 'Bangla display name must be at most 100 characters'),
  }),
  description: yup.object({
    en: yup
      .string()
      .required('English description is required')
      .min(10, 'English description must be at least 10 characters')
      .max(500, 'English description must be at most 500 characters'),
    bn: yup
      .string()
      .required('Bangla description is required')
      .min(10, 'Bangla description must be at least 10 characters')
      .max(500, 'Bangla description must be at most 500 characters'),
  }),
  duration: yup
    .number()
    .required('Duration is required')
    .min(1, 'Duration must be at least 1 month')
    .max(24, 'Duration must be at most 24 months'),
  fee: yup
    .number()
    .required('Fee is required')
    .min(0, 'Fee cannot be negative'),
});

type ProgramFormData = yup.InferType<typeof programSchema>;

const ProgramForm: React.FC<ProgramFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  program,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: yupResolver(programSchema),
    defaultValues: {
      displayName: { en: '', bn: '' },
      description: { en: '', bn: '' },
    },
  });

  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        displayName: program.displayName,
        description: program.description,
        duration: program.duration,
        fee: program.fee,
      });
    } else {
      reset({
        name: '',
        displayName: { en: '', bn: '' },
        description: { en: '', bn: '' },
        duration: 0,
        fee: 0,
      });
    }
  }, [program, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {program ? 'Edit Program' : 'Create New Program'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Program Name */}
            <div>
              <label htmlFor="name" className="label">
                Program Code
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g., KET, PET, FCE"
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* English Display Name */}
            <div>
              <label htmlFor="displayName.en" className="label">
                Display Name (English)
              </label>
              <input
                id="displayName.en"
                type="text"
                placeholder="e.g., Key English Test"
                className={`input-field ${errors.displayName?.en ? 'border-red-500' : ''}`}
                {...register('displayName.en')}
              />
              {errors.displayName?.en && (
                <p className="mt-1 text-sm text-red-600">{errors.displayName.en.message}</p>
              )}
            </div>

            {/* Bangla Display Name */}
            <div>
              <label htmlFor="displayName.bn" className="label">
                Display Name (Bangla)
              </label>
              <input
                id="displayName.bn"
                type="text"
                placeholder="e.g., কী ইংলিশ টেস্ট"
                className={`input-field ${errors.displayName?.bn ? 'border-red-500' : ''}`}
                {...register('displayName.bn')}
              />
              {errors.displayName?.bn && (
                <p className="mt-1 text-sm text-red-600">{errors.displayName.bn.message}</p>
              )}
            </div>

            {/* English Description */}
            <div>
              <label htmlFor="description.en" className="label">
                Description (English)
              </label>
              <textarea
                id="description.en"
                rows={3}
                placeholder="Describe the program in English"
                className={`input-field ${errors.description?.en ? 'border-red-500' : ''}`}
                {...register('description.en')}
              />
              {errors.description?.en && (
                <p className="mt-1 text-sm text-red-600">{errors.description.en.message}</p>
              )}
            </div>

            {/* Bangla Description */}
            <div>
              <label htmlFor="description.bn" className="label">
                Description (Bangla)
              </label>
              <textarea
                id="description.bn"
                rows={3}
                placeholder="Describe the program in Bangla"
                className={`input-field ${errors.description?.bn ? 'border-red-500' : ''}`}
                {...register('description.bn')}
              />
              {errors.description?.bn && (
                <p className="mt-1 text-sm text-red-600">{errors.description.bn.message}</p>
              )}
            </div>

            {/* Duration and Fee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="label">
                  Duration (months)
                </label>
                <input
                  id="duration"
                  type="number"
                  placeholder="7-9"
                  className={`input-field ${errors.duration ? 'border-red-500' : ''}`}
                  {...register('duration')}
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="fee" className="label">
                  Fee (BDT)
                </label>
                <input
                  id="fee"
                  type="number"
                  placeholder="15000"
                  className={`input-field ${errors.fee ? 'border-red-500' : ''}`}
                  {...register('fee')}
                />
                {errors.fee && (
                  <p className="mt-1 text-sm text-red-600">{errors.fee.message}</p>
                )}
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
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {program ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  program ? 'Update Program' : 'Create Program'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgramForm;