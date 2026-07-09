import React from 'react';
import { useAuth } from '@context/AuthContext';
import { 
  Users, 
  BookOpen, 
  FileText, 
  UserPlus,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mock stats (will be replaced with real data)
  const stats = [
    { title: 'Total Students', value: '156', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Programs', value: '5', change: '+0%', icon: BookOpen, color: 'bg-green-500' },
    { title: 'Mock Tests', value: '24', change: '+8%', icon: FileText, color: 'bg-purple-500' },
    { title: 'Pending Admissions', value: '7', change: '-3%', icon: UserPlus, color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { user: 'Sarah Ahmed', action: 'Completed FCE Mock Test', time: '2 hours ago', type: 'test' },
    { user: 'Rafi Hasan', action: 'Admitted to KET Program', time: '4 hours ago', type: 'admission' },
    { user: 'Nadia Khan', action: 'Submitted PET Writing', time: '6 hours ago', type: 'submission' },
  ];

  const quickActions = [
    { title: 'Admit Student', icon: UserPlus, path: '/admin/admission', color: 'bg-primary-500' },
    { title: 'Create Program', icon: BookOpen, path: '/admin/programs', color: 'bg-green-500' },
    { title: 'Add Teacher', icon: Users, path: '/admin/teachers', color: 'bg-purple-500' },
    { title: 'View Reports', icon: BarChart3, path: '/admin/reports', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening with your admin dashboard today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl border border-gray-200/50 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium mt-1 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                  <TrendingUp className="w-3 h-3" />
                </span>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/50 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity, index) => (
              <div key={index} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'test' ? 'bg-purple-500' :
                  activity.type === 'admission' ? 'bg-green-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200/50">
            <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className={`w-9 h-9 rounded-xl ${action.color} flex items-center justify-center shadow-sm`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {action.title}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200/50 p-4 text-center shadow-sm">
          <p className="text-xs text-gray-500">Programs</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">5</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/50 p-4 text-center shadow-sm">
          <p className="text-xs text-gray-500">Students</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">156</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/50 p-4 text-center shadow-sm">
          <p className="text-xs text-gray-500">Teachers</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">12</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/50 p-4 text-center shadow-sm">
          <p className="text-xs text-gray-500">Mock Tests</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">24</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;