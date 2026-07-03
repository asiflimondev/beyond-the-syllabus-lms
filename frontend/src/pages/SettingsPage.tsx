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
  Loader2
} from 'lucide-react';

// Profile Section
const ProfileSection: React.FC<{ user: any }> = ({ user }) => {
  const [fullName, setFullName] = useState(user?.profile?.fullName || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Profile Settings</h4>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="input-field bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="label flex items-center">
            <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="label flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            placeholder="Enter your phone number"
          />
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Change Password</h4>
          <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-field"
            placeholder="Enter your current password"
          />
        </div>
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
            placeholder="Enter your new password (min 6 characters)"
          />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Confirm your new password"
          />
        </div>
        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
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

// Notification Section
const NotificationSection: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSave = async () => {
    toast.success('Notification preferences saved!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Notifications</h4>
          <p className="text-sm text-gray-500">Manage how you receive notifications</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              emailNotifications ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                emailNotifications ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">SMS Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via SMS</p>
          </div>
          <button
            onClick={() => setSmsNotifications(!smsNotifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              smsNotifications ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                smsNotifications ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Push Notifications</p>
            <p className="text-sm text-gray-500">Receive browser notifications</p>
          </div>
          <button
            onClick={() => setPushNotifications(!pushNotifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              pushNotifications ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                pushNotifications ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};

// Language Section
const LanguageSection: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const handleSave = async () => {
    toast.success(`Language changed to ${language === 'en' ? 'English' : 'Bangla'}!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Language</h4>
          <p className="text-sm text-gray-500">Choose your preferred language</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              language === 'en'
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-medium">English</span>
          </button>
          <button
            onClick={() => setLanguage('bn')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              language === 'bn'
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-medium">বাংলা</span>
          </button>
        </div>
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Language</span>
        </button>
      </div>
    </div>
  );
};

// Danger Zone (Admin only)
const DangerZone: React.FC = () => {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action is irreversible!')) {
      toast.error('This feature is not yet implemented');
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-red-800">Danger Zone</h4>
          <p className="text-sm text-red-600">These actions are irreversible. Proceed with caution.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleClearData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Clear All Data
        </button>
        <button
          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
        >
          Reset System
        </button>
        <button
          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
        >
          Export Data
        </button>
      </div>
    </div>
  );
};

// MAIN SETTINGS PAGE
const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
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