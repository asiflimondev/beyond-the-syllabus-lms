import React, { useState } from 'react';
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
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

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
  const mockTestsDataResponse = mockTestsData?.data?.data;

  // Extract data from new response structure
  const programsWithResults = mockTestsDataResponse?.programs || [];
  const pendingTests = mockTestsDataResponse?.pendingTests || [];

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

  const toggleProgram = (programId: string) => {
    setExpandedProgram(expandedProgram === programId ? null : programId);
  };

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
              Current Programme
            </h3>
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
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results by Program */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            My Results
          </h3>
        </div>

        {programsWithResults.length === 0 && pendingTests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No mock tests available yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100/50">
            {/* Programs with results */}
            {programsWithResults.map((programData: any) => (
              <div key={programData.programId || 'unknown'} className="px-6 py-4">
                <button
                  onClick={() => toggleProgram(programData.programId || 'unknown')}
                  className="w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors rounded-lg p-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">
                        {programData.programName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {programData.results.length} tests • Avg: {programData.averagePercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      programData.averagePercentage >= 70
                        ? 'bg-emerald-100 text-emerald-700'
                        : programData.averagePercentage >= 50
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {programData.averagePercentage}%
                    </span>
                    {expandedProgram === (programData.programId || 'unknown') ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded results */}
                {expandedProgram === (programData.programId || 'unknown') && (
                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-primary-200">
                    {programData.results.map((result: any) => (
                      <Link
                        key={result.resultId}
                        to={`/student/mock-tests/${result.mockTestId}`}
                        className="block p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Test #{result.testNumber} • {new Date(result.testDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {result.percentage}%
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              result.grade?.startsWith('A')
                                ? 'bg-emerald-100 text-emerald-700'
                                : result.grade?.startsWith('B')
                                ? 'bg-blue-100 text-blue-700'
                                : result.grade?.startsWith('C')
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {result.grade || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Pending tests */}
            {pendingTests.length > 0 && (
              <div className="px-6 py-4 bg-gray-50/30">
                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Pending Tests - Current Program
                </h4>
                <div className="space-y-2">
                  {pendingTests.map((test: any) => (
                    <div key={test._id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700 text-sm">
                          {test.title || `Mock Test ${test.testNumber}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Test #{test.testNumber} • {new Date(test.testDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;