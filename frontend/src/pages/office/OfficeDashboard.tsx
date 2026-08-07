import React from 'react';
import { useAuth } from '@context/AuthContext';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Calendar,
  Sparkles,
  Settings
} from 'lucide-react';

const OfficeDashboard: React.FC = () => {
  const { user } = useAuth();

  // ✅ Office Quick Actions - Only what's needed
  const quickActions = [
    {
      title: 'Manage Programs',
      description: 'View all programs',
      icon: BookOpen,
      path: '/admin/programs',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Mock Tests',
      description: 'Manage mock tests',
      icon: FileText,
      path: '/office/mock-tests',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: Settings,
      path: '/office/settings',
      color: 'from-gray-500 to-gray-600'
    },
  ];

  // Get display name from user context
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 rounded-full blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">Office Dashboard</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Welcome, {displayName}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Office Dashboard - Manage student admissions and records
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OfficeDashboard;