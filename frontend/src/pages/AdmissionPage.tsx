import React, { useState } from 'react';
import { UserPlus, Users, Search, Clock, CheckCircle, Sparkles} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { admissionApi, Student } from '@api/admission.api';
import AdmissionForm from '@components/admission/AdmissionForm';

const AdmissionPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ['admission-settings'],
    queryFn: () => admissionApi.getSettings(),
  });

  const { data: recentData, isLoading, refetch } = useQuery({
    queryKey: ['recent-admissions'],
    queryFn: () => admissionApi.getRecentAdmissions(10),
  });

  const { data: statsData } = useQuery({
    queryKey: ['admission-stats'],
    queryFn: () => admissionApi.getAllStudents({ limit: 1 }),
  });

  const extractStudents = (): Student[] => {
    if (!recentData) return [];
    const responseData = recentData.data;
    if (!responseData) return [];
    
    if (responseData.data?.students && Array.isArray(responseData.data.students)) {
      return responseData.data.students;
    }
    
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    return [];
  };

  const extractTotal = (): number => {
    if (!statsData) return 0;
    const responseData = statsData.data;
    if (!responseData) return 0;
    
    if (responseData.data?.pagination?.total !== undefined) {
      return responseData.data.pagination.total;
    }
    
    if (responseData.data?.students && Array.isArray(responseData.data.students)) {
      return responseData.data.students.length;
    }
    
    return 0;
  };

  const recentAdmissions = extractStudents();
  const totalStudents = extractTotal();
  
  const pendingStudents = recentAdmissions.filter(
    (s: Student) => s.status === 'pending_registration'
  ).length;

  const getProgramName = (program: any): string => {
    if (!program) return 'N/A';
    if (typeof program === 'string') return program;
    if (typeof program === 'object') {
      return program.displayName?.en || program.name || 'N/A';
    }
    return 'N/A';
  };

  const handleAdmissionSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">Admissions</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Student Admission</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Admit new students and manage admission records
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <UserPlus className="w-5 h-5" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Admission Mode Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-4 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
        <div className="relative flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Admission Mode</h4>
            <p className="text-sm text-gray-700">
              Current mode: <strong className="uppercase text-primary-600">{settingsData?.data?.mode || 'Manual'}</strong>
              {settingsData?.data?.mode === 'manual' && (
                <span className="ml-2 text-gray-500">
                  (Prefix: <span className="font-mono font-semibold">{settingsData.data.prefix || 'BTS'}</span>, 
                  Next ID: <span className="font-mono font-semibold">{settingsData.data.currentNumber ? settingsData.data.currentNumber + 1 : 'N/A'}</span>)
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {settingsData?.data?.mode === 'auto' 
                ? '✨ Admission IDs will be auto-generated with the configured prefix' 
                : '📝 You need to manually enter Admission IDs'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Registration</p>
              <p className="text-2xl font-bold text-orange-600">{pendingStudents || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Students</p>
              <p className="text-2xl font-bold text-emerald-600">
                {(totalStudents || 0) - pendingStudents}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Recent Admissions
          </h3>
          <span className="text-xs text-gray-400">{recentAdmissions.length} records</span>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading admissions...</span>
          </div>
        ) : recentAdmissions.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No admissions yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Admit New Student" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50/80 to-gray-50/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admission ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {recentAdmissions.map((student: Student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 font-mono">
                      {student.admissionId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {getProgramName(student.programId)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : student.status === 'pending_registration'
                            ? 'bg-amber-100 text-amber-700'
                            : student.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {student.status === 'pending_registration' 
                          ? 'Pending Registration' 
                          : student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(student.admissionDate || student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admission Form Modal */}
      <AdmissionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleAdmissionSuccess}
      />
    </div>
  );
};

export default AdmissionPage;