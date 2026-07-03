import React from 'react';
import { useAuth } from '@context/AuthContext';
import { 
  Users, 
  BookOpen, 
  FileText, 
  UserPlus,
  BookMarked,
  Calendar,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Statistics cards (will be dynamic later)
  const stats = [
    { title: 'Total Students', value: '0', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Programs', value: '0', icon: BookOpen, color: 'bg-green-500' },
    { title: 'Mock Tests', value: '0', icon: FileText, color: 'bg-purple-500' },
    { title: 'Pending Admission', value: '0', icon: UserPlus, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening with your {user?.role} dashboard today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role-Specific Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center py-8">
              No recent activity to display
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {/* Admin/Office Actions */}
            {(user?.role === 'admin' || user?.role === 'office') && (
              <>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <UserPlus className="w-4 h-4 mr-3 text-primary-600" />
                  Admit New Student
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <BookOpen className="w-4 h-4 mr-3 text-primary-600" />
                  Create New Program
                </button>
              </>
            )}

            {/* Teacher Actions */}
            {user?.role === 'teacher' && (
              <>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-3 text-primary-600" />
                  Create Mock Test
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-3 text-primary-600" />
                  View My Students
                </button>
              </>
            )}

            {/* Student Actions */}
            {user?.role === 'student' && (
              <>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <BookMarked className="w-4 h-4 mr-3 text-primary-600" />
                  View My Program
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-3 text-primary-600" />
                  View My Results
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;