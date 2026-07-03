import React from 'react';
import { useAuth } from '@context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  Settings
} from 'lucide-react';

const OfficeDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Students', value: '0', icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Admission', value: '0', icon: Clock, color: 'bg-orange-500' },
    { title: 'Active Students', value: '0', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Total Programs', value: '0', icon: BookOpen, color: 'bg-purple-500' },
  ];

  const quickActions = [
    {
      title: 'Admit New Student',
      description: 'Register a new student in the system',
      icon: UserPlus,
      path: '/admin/admission',
      color: 'bg-primary-600'
    },
    {
      title: 'View Students',
      description: 'See all registered students',
      icon: Users,
      path: '/admin/students',
      color: 'bg-blue-600'
    },
    {
      title: 'Manage Programs',
      description: 'View and manage programs',
      icon: BookOpen,
      path: '/admin/programs',
      color: 'bg-green-600'
    },
    {
      title: 'Generate Reports',
      description: 'Create student reports',
      icon: FileText,
      path: '/admin/reports',
      color: 'bg-purple-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.email}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Office Dashboard - Manage student admissions and records
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-primary-300"
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
            <p className="text-sm text-gray-500">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default OfficeDashboard;