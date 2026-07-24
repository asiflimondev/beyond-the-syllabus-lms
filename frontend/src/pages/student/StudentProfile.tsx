import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { studentApi } from '@api/student.api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  School, 
  Users, 
  Award, 
  Edit3, 
  Save, 
  X, 
  UserCheck,
  GraduationCap,
  Clock,
  UserCircle,
  Droplet,
  Shield,
  Star,
  Briefcase
} from 'lucide-react';

const profileSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  phone: yup.string().required('Phone number is required').min(11, 'Must be at least 11 digits'),
  fatherName: yup.string().optional(),
  motherName: yup.string().optional(),
  parentPhone: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().oneOf(['male', 'female', 'other']).optional(),
  bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),
  address: yup.string().optional(),
  schoolCollege: yup.string().optional(),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

const StudentProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => studentApi.getProfile(),
  });

  const profile = profileData?.data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      gender: 'male',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => studentApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  // Section divider component
  const SectionDivider = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{title}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );

  // Field component for view mode
  const Field = ({ label, value, icon: Icon }: { label: string; value?: string | null; icon: any }) => (
    <div className="group">
      <div className="flex items-center gap-2 mb-0.5">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      <p className="text-sm text-gray-900 pl-6">{value || '—'}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => {
              setIsEditing(true);
              reset({
                fullName: profile?.fullName || '',
                phone: profile?.phone || '',
                fatherName: profile?.fatherName || '',
                motherName: profile?.motherName || '',
                parentPhone: profile?.parentPhone || '',
                dateOfBirth: profile?.dateOfBirth || '',
                gender: profile?.gender || 'male',
                bloodGroup: profile?.bloodGroup || undefined,
                address: profile?.address || '',
                schoolCollege: profile?.schoolCollege || '',
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-xl font-medium">
                {profile?.fullName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{profile?.fullName}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {profile?.admissionId}
                </span>
                <span className="w-px h-3 bg-gray-300" />
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                  profile?.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  <UserCheck className="w-3 h-3" />
                  {profile?.status === 'pending_registration' ? 'Pending' : profile?.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isEditing ? (
            /* View Mode */
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <SectionDivider title="Personal Information" icon={User} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" value={profile?.fullName} icon={User} />
                  <Field label="Email" value={profile?.email} icon={Mail} />
                  <Field label="Phone" value={profile?.phone} icon={Phone} />
                  <Field label="Date of Birth" value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : undefined} icon={Calendar} />
                  <Field label="Gender" value={profile?.gender?.charAt(0).toUpperCase() + profile?.gender?.slice(1)} icon={UserCircle} />
                  <Field label="Blood Group" value={profile?.bloodGroup} icon={Droplet} />
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <SectionDivider title="Parent Information" icon={Users} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Father's Name" value={profile?.fatherName} icon={User} />
                  <Field label="Mother's Name" value={profile?.motherName} icon={User} />
                  <Field label="Parent Phone" value={profile?.parentPhone} icon={Phone} />
                </div>
              </div>

              {/* Address & Education */}
              <div>
                <SectionDivider title="Address & Education" icon={MapPin} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Address" value={profile?.address} icon={MapPin} />
                  <Field label="School/College" value={profile?.schoolCollege} icon={School} />
                </div>
              </div>

              {/* Program Information */}
              <div>
                <SectionDivider title="Program Information" icon={Award} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Program" value={profile?.programId?.displayName?.en} icon={GraduationCap} />
                  <Field label="Duration" value={profile?.programId?.duration ? `${profile.programId.duration} months` : undefined} icon={Clock} />
                  <Field label="Admission Date" value={profile?.admissionDate ? new Date(profile.admissionDate).toLocaleDateString() : undefined} icon={Calendar} />
                  <Field label="Admission ID" value={profile?.admissionId} icon={Shield} />
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <SectionDivider title="Personal Information" icon={User} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-2.5 bg-white border ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all`}
                      {...register('fullName')}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-2.5 bg-white border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all`}
                      {...register('phone')}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      {...register('dateOfBirth')}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Gender</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all" 
                      {...register('gender')}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Blood Group</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all" 
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
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <SectionDivider title="Parent Information" icon={Users} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Father's Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      {...register('fatherName')}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Mother's Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      {...register('motherName')}
                      placeholder="Enter mother's name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Parent Phone</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      {...register('parentPhone')}
                      placeholder="Enter parent's phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Education */}
              <div>
                <SectionDivider title="Address & Education" icon={MapPin} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      {...register('address')}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">School/College</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      {...register('schoolCollege')}
                      placeholder="Enter school or college name"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {profile?.admissionDate ? new Date(profile.admissionDate).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Program</p>
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                {profile?.programId?.displayName?.en || '—'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Star className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {profile?.status === 'pending_registration' ? 'Pending' : profile?.status || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;