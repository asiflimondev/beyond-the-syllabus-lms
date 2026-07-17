import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context/AuthContext';
import { studentApi } from '@api/student.api';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  User,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => studentApi.getProfile(),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['student-stats'],
    queryFn: () => studentApi.getStats(),
  });

  const { data: mockTestsData, isLoading: mockTestsLoading } = useQuery({
    queryKey: ['student-mock-tests'],
    queryFn: () => studentApi.getMockTests(),
  });

  const profile = profileData?.data?.data;
  const stats = statsData?.data?.data;
  const mockTests = mockTestsData?.data?.data || [];

  if (profileLoading || statsLoading || mockTestsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  const getProgramName = (program: any): string => {
    if (!program) return 'N/A';
    if (typeof program === 'string') return program;
    if (typeof program === 'object') {
      return program.displayName?.en || program.name || 'N/A';
    }
    return 'N/A';
  };

  const program = profile?.programId;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 rounded-full blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">Student Dashboard</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Welcome, {profile?.fullName || user?.email}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Admission ID: <span className="font-medium font-mono">{profile?.admissionId}</span>
            </p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1 text-gray-400" />
                {user?.email}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                {new Date(profile?.admissionDate || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-4 py-2 rounded-full text-xs font-semibold ${
                profile?.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : profile?.status === 'pending_registration'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {profile?.status === 'pending_registration'
                ? 'Pending Registration'
                : profile?.status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalMockTests || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats?.completedTests || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats?.pendingTests || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.averagePercentage || 0}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Program */}
      {program && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary-500" />
              My Program
            </h3>
            <Link
              to="/student/program"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View Details
            </Link>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-gray-900 font-display">
                  {getProgramName(program)}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {program.name} • {program.duration} months
                </p>
                <p className="text-sm text-gray-600 mt-2 max-w-md">
                  {program.description?.en}
                </p>
                <p className="text-sm font-medium text-gray-700 mt-3">
                  Fee: ৳{program.fee?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mock Tests */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            Mock Tests
          </h3>
          <Link
            to="/student/mock-tests"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View All
          </Link>
        </div>
        {mockTests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No mock tests available yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100/50">
            {mockTests.slice(0, 3).map((test: any) => (
              <div key={test._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {test.title || `Mock Test ${test.testNumber}`}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Test #{test.testNumber} • {new Date(test.testDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {test.hasResult ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {test.result?.percentage || 0}%
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                    <Link
                      to={`/student/mock-tests/${test._id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;