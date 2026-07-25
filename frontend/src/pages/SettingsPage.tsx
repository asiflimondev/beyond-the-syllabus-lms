import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@api/settings.api';
import { 
  User, 
  Mail, 
  Lock, 
  Save,
  Key,
  UserCircle,
  Phone,
  Loader2,
  CheckCircle,
  AlertCircle,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Profile Section
const ProfileSection: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['settings-profile'],
    queryFn: () => settingsApi.getProfile(),
  });

  useEffect(() => {
    if (profileData?.data?.data) {
      const data = profileData.data.data;
      const userData = data.user || {};
      const profile = data.profile || {};
      setFullName(profile.fullName || userData.fullName || '');
      setPhone(profile.phone || userData.phone || '');
    }
  }, [profileData]);

  const updateMutation = useMutation({
    mutationFn: (data: { fullName: string; phone: string }) =>
      settingsApi.updateProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['settings-profile'] });
      
      // Update the user context with new data from the response
      const responseData = response?.data?.data;
      if (responseData) {
        const userData = responseData.user || {};
        updateUser({
          fullName: userData.fullName || fullName,
          phone: userData.phone || phone,
        });
      } else {
        // Fallback: update with the values we sent
        updateUser({
          fullName: fullName,
          phone: phone,
        });
      }
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSave = async () => {
    if (!fullName || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    updateMutation.mutate({ fullName, phone });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900">Profile Settings</h4>
              <p className="text-xs text-gray-500">Update your personal information</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200' 
                : 'text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Email cannot be changed
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
            Full Name <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              !isEditing 
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' 
                : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none'
            }`}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            Phone Number <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              !isEditing 
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' 
                : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none'
            }`}
            placeholder="Enter your phone number"
          />
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Password Section
const PasswordSection: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      settingsApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">Change Password</h4>
            <p className="text-xs text-gray-500">Update your password to keep your account secure</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
            placeholder="Enter your current password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
            placeholder="Enter your new password (min 6 characters)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none"
            placeholder="Confirm your new password"
          />
        </div>
        <button
          onClick={handleChangePassword}
          disabled={changePasswordMutation.isPending}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {changePasswordMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Changing Password...</span>
            </>
          ) : (
            <>
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// MAIN SETTINGS PAGE
const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'user';
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">Settings</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-lg text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {displayRole} Account
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileSection />
          <PasswordSection />
        </div>

        <div className="space-y-6">
          {/* Logout Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                  <LogOut className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Logout</h4>
                  <p className="text-xs text-gray-500">Sign out of your account</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;