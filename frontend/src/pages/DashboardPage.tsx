import React from 'react';
import { useAuth } from '@context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  BookOpen, 
  UserPlus,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  BarChart3,
  Sparkles,
  Clock,
  GraduationCap,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { programsApi } from '@api/programs.api';
import { activityApi, Activity } from '@api/admin/activity.api';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: dashboardStatsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => activityApi.getDashboardStats(),
  });

  // Fetch programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ['dashboard-programs'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  // Fetch recent activities (limit 5)
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => activityApi.getRecentActivities(5), // Request exactly 5
  });

  const stats = dashboardStatsData?.data?.data;
  
  const totalStudents = stats?.students?.total || 0;
  const activeStudents = stats?.students?.active || 0;
  const pendingStudents = stats?.students?.pending || 0;
  const totalTeachers = stats?.teachers?.total || 0;
  const totalMockTests = stats?.mockTests?.total || 0;

  // Extract programs from the response
  const extractPrograms = (): any[] => {
    if (!programsData) return [];
    const responseData = programsData.data;
    if (!responseData) return [];
    if (responseData.data?.programs && Array.isArray(responseData.data.programs)) {
      return responseData.data.programs;
    }
    if (responseData.programs && Array.isArray(responseData.programs)) {
      return responseData.programs;
    }
    if (Array.isArray(responseData)) {
      return responseData;
    }
    return [];
  };

  const programs = extractPrograms();
  const activePrograms = programs.filter((p: any) => p.isActive !== false).length;

  // Get recent activities (should be exactly 5 from API)
  const recentActivities = activitiesData?.data?.data || [];

  const statCards = [
    { 
      title: 'Total Students', 
      value: totalStudents, 
      change: '+12%', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      gradient: 'from-blue-500/10 to-blue-600/10'
    },
    { 
      title: 'Active Programmes', 
      value: activePrograms, 
      change: '+0%', 
      icon: BookOpen, 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      gradient: 'from-emerald-500/10 to-emerald-600/10'
    },
    { 
      title: 'Active Students', 
      value: activeStudents, 
      change: '+8%', 
      icon: UserPlus, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      gradient: 'from-purple-500/10 to-purple-600/10'
    },
    { 
      title: 'Pending Admissions', 
      value: pendingStudents, 
      change: '-3%', 
      icon: Clock, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      gradient: 'from-orange-500/10 to-orange-600/10'
    },
  ];

  const quickActions = [
    { title: 'Admit Student', icon: UserPlus, path: '/admin/admission', color: 'from-primary-500 to-primary-600' },
    { title: 'Create Programme', icon: BookOpen, path: '/admin/programs', color: 'from-emerald-500 to-emerald-600' },
    { title: 'Add Teacher', icon: Users, path: '/admin/teachers', color: 'from-purple-500 to-purple-600' },
    { title: 'View Reports', icon: BarChart3, path: '/admin/reports', color: 'from-orange-500 to-orange-600' },
  ];

  const isLoading = statsLoading || programsLoading || activitiesLoading;

  // Get display name from user context
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User';

  // Helper to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper to get activity icon color
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'admission': return 'bg-emerald-500';
      case 'mocktest': return 'bg-purple-500';
      case 'teacher': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'admission': return <GraduationCap className="w-3 h-3 text-white" />;
      case 'mocktest': return <FileText className="w-3 h-3 text-white" />;
      case 'teacher': return <Users className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 rounded-full blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">
              Welcome back, {displayName}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening with your admin dashboard today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
            <Calendar className="w-4 h-4 text-primary-500" />
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
        {statCards.map((stat) => (
          <div 
            key={stat.title} 
            className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5 p-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                )}
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium mt-1 ${
                  stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change}
                  <TrendingUp className="w-3 h-3" />
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50">
            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100/50">
            {isLoading ? (
              // Loading skeletons - exactly 5
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                  </div>
                </div>
              ))
            ) : recentActivities.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <p className="text-sm">No recent activities</p>
              </div>
            ) : (
              recentActivities.map((activity: Activity) => (
                <div key={activity.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      <span className="font-medium">{activity.user}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-gray-400">{formatTime(activity.time)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5">
          <div className="px-6 py-4 border-b border-gray-200/50">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              Quick Actions
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group border border-transparent hover:border-gray-200/50"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md shadow-primary-500/20 flex-shrink-0`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  {action.title}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/50 shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Programmes</p>
          {isLoading ? (
            <div className="h-7 w-12 mx-auto bg-gray-200 rounded-lg animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-gray-900 mt-0.5">{activePrograms}</p>
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/50 shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Students</p>
          {isLoading ? (
            <div className="h-7 w-12 mx-auto bg-gray-200 rounded-lg animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalStudents}</p>
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/50 shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers</p>
          {isLoading ? (
            <div className="h-7 w-12 mx-auto bg-gray-200 rounded-lg animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalTeachers}</p>
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/50 shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mock Tests</p>
          {isLoading ? (
            <div className="h-7 w-12 mx-auto bg-gray-200 rounded-lg animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalMockTests}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;