import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Globe,
  Save,
  Key,
  UserCircle,
  Phone,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Profile Section - Enhanced UI
const ProfileSection: React.FC<{ user: any }> = ({ user }) => {
  const [fullName, setFullName] = useState(user?.profile?.fullName || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

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
          <label className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center">
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
          <label className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
            Full Name
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
          <label className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            Phone Number
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
            className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Password Section - Enhanced UI
const PasswordSection: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
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

// Notification Section - Enhanced UI
const NotificationSection: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSave = async () => {
    toast.success('Notification preferences saved!');
  };

  const NotificationToggle = ({ 
    title, 
    description, 
    enabled, 
    onChange 
  }: { 
    title: string; 
    description: string; 
    enabled: boolean; 
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50/80 hover:bg-gray-100/80 rounded-xl transition-all duration-200 group">
      <div>
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
          enabled ? 'bg-primary-600 shadow-md shadow-primary-500/30' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">Notifications</h4>
            <p className="text-xs text-gray-500">Manage how you receive notifications</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <NotificationToggle
          title="Email Notifications"
          description="Receive updates via email"
          enabled={emailNotifications}
          onChange={() => setEmailNotifications(!emailNotifications)}
        />
        <NotificationToggle
          title="SMS Notifications"
          description="Receive updates via SMS"
          enabled={smsNotifications}
          onChange={() => setSmsNotifications(!smsNotifications)}
        />
        <NotificationToggle
          title="Push Notifications"
          description="Receive browser notifications"
          enabled={pushNotifications}
          onChange={() => setPushNotifications(!pushNotifications)}
        />

        <button
          onClick={handleSave}
          className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};

// Language Section - Enhanced UI
const LanguageSection: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const handleSave = async () => {
    toast.success(`Language changed to ${language === 'en' ? 'English' : 'Bangla'}!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">Language</h4>
            <p className="text-xs text-gray-500">Choose your preferred language</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              language === 'en'
                ? 'border-primary-600 bg-primary-50/50 text-primary-700 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">🇬🇧 English</span>
          </button>
          <button
            onClick={() => setLanguage('bn')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              language === 'bn'
                ? 'border-primary-600 bg-primary-50/50 text-primary-700 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">🇧🇩 বাংলা</span>
          </button>
        </div>
        <button
          onClick={handleSave}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Save Language</span>
        </button>
      </div>
    </div>
  );
};

// Danger Zone (Admin only) - Enhanced UI
const DangerZone: React.FC = () => {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action is irreversible!')) {
      toast.error('This feature is not yet implemented');
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 border-2 border-red-200/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-red-800">Danger Zone</h4>
          <p className="text-sm text-red-600/80 mb-4">These actions are irreversible. Proceed with caution.</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              Clear All Data
            </button>
            <button
              className="px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              Reset System
            </button>
            <button
              className="px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// MAIN SETTINGS PAGE - Enhanced
const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Safely get user role with fallback
  const userRole = user?.role || 'user';
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
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
          <ProfileSection user={user} />
          <PasswordSection />
        </div>

        <div className="space-y-6">
          <NotificationSection />
          <LanguageSection />
        </div>
      </div>

      {user?.role === 'admin' && <DangerZone />}
    </div>
  );
};

export default SettingsPage;