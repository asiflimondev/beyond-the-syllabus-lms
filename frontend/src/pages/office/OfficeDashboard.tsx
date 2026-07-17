import React from 'react';
import { useAuth } from '@context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { studentManagementApi } from '@api/admin/student.api';
import {
  Users,
  UserPlus,
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

const OfficeDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['office-dashboard-stats'],
    queryFn: () => studentManagementApi.getStats(),
  });

  const totalStudents = statsData?.data?.data?.total || 0;
  const activeStudents = statsData?.data?.data?.active || 0;
  const pendingStudents = statsData?.data?.data?.pending || 0;

  const stats = [
    { title: 'Total Students', value: totalStudents, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Pending Admission', value: pendingStudents, icon: Clock, color: 'from-orange-500 to-amber-500' },
    { title: 'Active Students', value: activeStudents, icon: CheckCircle, color: 'from-emerald-500 to-green-500' },
    { title: 'Total Programs', value: '0', icon: BookOpen, color: 'from-purple-500 to-violet-500' },
  ];

  const quickActions = [
    {
      title: 'Admit New Student',
      description: 'Register a new student in the system',
      icon: UserPlus,
      path: '/admin/admission',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'View Students',
      description: 'See all registered students',
      icon: Users,
      path: '/admin/students',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Manage Programs',
      description: 'View and manage programs',
      icon: BookOpen,
      path: '/admin/programs',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Generate Reports',
      description: 'Create student reports',
      icon: FileText,
      path: '/admin/reports',
      color: 'from-purple-500 to-purple-600'
    },
  ];

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
              Welcome, {user?.email}!
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                {statsLoading ? (
                  <div className="h-8 w-12 bg-gray-200 rounded-lg animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
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

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Recent Activity
          </h3>
        </div>
        <div className="p-12 text-center text-gray-500">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="font-medium">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">Activity will appear here once you start managing students</p>
        </div>
      </div>
    </div>
  );
};

export default OfficeDashboard;