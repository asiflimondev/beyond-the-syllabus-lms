import React, { useState } from 'react';
import { UserPlus, Users, Search, Clock, CheckCircle } from 'lucide-react';
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

  // Helper function to safely get program name
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
          <h2 className="text-2xl font-bold text-gray-900">Student Admission</h2>
          <p className="text-sm text-gray-500">
            Admit new students and manage admission records
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Admission Mode Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-900">Admission Mode</h4>
          <p className="text-sm text-blue-700">
            Current mode: <strong className="uppercase">{settingsData?.data?.mode || 'automatic'}</strong>
            {settingsData?.data?.mode === 'automatic' && (
              <span className="ml-2">
                (Prefix: {settingsData.data.prefix || 'BTS'}, 
                Next ID: {settingsData.data.currentNumber ? settingsData.data.currentNumber + 1 : 'N/A'})
              </span>
            )}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {settingsData?.data?.mode === 'automatic' 
              ? 'Admission IDs will be auto-generated with the configured prefix' 
              : 'You need to manually enter Admission IDs'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Registration</p>
              <p className="text-2xl font-bold text-orange-600">{pendingStudents || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Students</p>
              <p className="text-2xl font-bold text-green-600">
                {(totalStudents || 0) - pendingStudents}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Admissions</h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading admissions...</span>
          </div>
        ) : recentAdmissions.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No admissions yet</p>
            <p className="text-sm text-gray-400">Click "Admit New Student" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAdmissions.map((student: Student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {student.admissionId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.fullName}
                    </td>
                    {/* ✅ FIXED: Program column - safe object rendering */}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {getProgramName(student.programId)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'pending_registration'
                            ? 'bg-yellow-100 text-yellow-800'
                            : student.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
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