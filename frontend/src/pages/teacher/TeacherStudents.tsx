import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { teacherApi } from '@api/teacher.api';
import { useSearchParams } from 'react-router-dom';
import { Search, Users, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

const TeacherStudents: React.FC = () => {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Use the same pattern as TeacherDashboard - : any and Boolean()
  const studentsQuery: any = useQuery({
    queryKey: ['teacher-students', programId, page, limit, search],
    queryFn: async () => {
      if (!programId) {
        return { data: { data: { students: [], pagination: { total: 0, totalPages: 1 } } } };
      }
      return await teacherApi.getStudentsByProgram(programId, { page, limit, search: search || undefined });
    },
    enabled: Boolean(programId),
  });

  // Safe data extraction with optional chaining
  const students = studentsQuery?.data?.data?.data?.students || [];
  const pagination = studentsQuery?.data?.data?.data?.pagination || { total: 0, totalPages: 1 };

  // Early return if no program selected
  if (!programId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a program to view students</p>
          <p className="text-sm text-gray-400">Go to My Programs and select a program</p>
        </div>
      </div>
    );
  }

  if (studentsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Students</h2>
        <p className="text-sm text-gray-500">Students enrolled in your programs</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Students Table */}
      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No students found in this program</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student: any) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {student.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.admissionId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {student.email}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {student.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : student.status === 'pending_registration'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {student.status === 'pending_registration' ? 'Pending' : student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {students.length} of {pagination.total} students
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {pagination.totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherStudents;