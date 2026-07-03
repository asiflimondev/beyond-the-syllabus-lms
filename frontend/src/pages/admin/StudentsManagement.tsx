import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  Clock,
  UserX,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Key,
  X,
  Save,
} from 'lucide-react';
import { studentManagementApi, Student } from '@api/admin/student.api';
import { programsApi } from '@api/programs.api';

// ============================================
// STATUS OPTIONS
// ============================================
const statusOptions = [
  { value: 'pending_registration', label: 'Pending Registration', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
];

const getStatusColor = (status: string) => {
  const found = statusOptions.find(s => s.value === status);
  return found?.color || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string) => {
  const found = statusOptions.find(s => s.value === status);
  return found?.label || status;
};

const StudentsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // View/Edit modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [editFormData, setEditFormData] = useState<any>({});

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['student-stats'],
    queryFn: () => studentManagementApi.getStats(),
  });

  // Fetch programs for filter
  const { data: programsData } = useQuery({
    queryKey: ['programs', 'active'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  const programs = programsData?.data?.data?.programs || [];

  // Fetch students
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-students', page, limit, search, showDeleted, statusFilter],
    queryFn: () =>
      studentManagementApi.getAll({
        page,
        limit,
        search: search || undefined,
        isDeleted: showDeleted ? 'true' : 'false',
        status: statusFilter || undefined,
      }),
  });

  const stats = statsData?.data?.data || { total: 0, pending: 0, active: 0, completed: 0, inactive: 0 };

  const extractStudents = (): Student[] => {
    if (!data) return [];
    const responseData = data.data;
    if (!responseData) return [];
    if (responseData.data?.students) return responseData.data.students;
    if (responseData.students) return responseData.students;
    return [];
  };

  const students = extractStudents();
  const total = data?.data?.data?.pagination?.total || data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.data?.pagination?.totalPages || data?.data?.pagination?.totalPages || 1;

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      studentManagementApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      queryClient.invalidateQueries({ queryKey: ['student-stats'] });
      toast.success('Student updated successfully');
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update student');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentManagementApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      queryClient.invalidateQueries({ queryKey: ['student-stats'] });
      toast.success('Student deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => studentManagementApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      queryClient.invalidateQueries({ queryKey: ['student-stats'] });
      toast.success('Student restored successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore student');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      studentManagementApi.resetPassword(id, { newPassword: password }),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setSelectedStudent(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (id: string) => {
    if (window.confirm('Are you sure you want to restore this student?')) {
      restoreMutation.mutate(id);
    }
  };

  const handleResetPassword = (student: Student) => {
    setSelectedStudent(student);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const handleSubmitPasswordReset = () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (selectedStudent) {
      resetPasswordMutation.mutate({ id: selectedStudent.id, password: newPassword });
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditFormData({
      fullName: student.fullName,
      phone: student.phone,
      parentPhone: '',
      status: student.status,
      programId: student.program?.id || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (selectedStudent) {
      updateMutation.mutate({ id: selectedStudent.id, data: editFormData });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          <p className="text-sm text-gray-500">Manage all students and their accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <UserX className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, admission ID, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span>Show deleted</span>
        </label>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading students...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Failed to load students: {(error as any)?.message || 'Unknown error'}</p>
        </div>
      )}

      {/* Students Table */}
      {!isLoading && !isError && (
        <>
          {students.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admission ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Program
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student: Student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {student.admissionId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.fullName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.program?.displayName?.en || student.program?.name || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                student.status
                              )}`}
                            >
                              {getStatusLabel(student.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {student.user ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Registered
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Not Registered
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {!student.isDeleted ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setIsViewModalOpen(true);
                                    }}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(student)}
                                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {student.user && (
                                    <button
                                      onClick={() => handleResetPassword(student)}
                                      className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                      title="Reset Password"
                                    >
                                      <Key className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(student.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleRestore(student.id)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Restore"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}
                            </div>
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
                  Showing {students.length} of {total} students
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </>
      )}

      {/* View Student Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsViewModalOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Student Details</h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Admission ID</p>
                    <p className="font-medium">{selectedStudent.admissionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedStudent.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Program</p>
                    <p className="font-medium">{selectedStudent.program?.displayName?.en || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.status)}`}>
                      {getStatusLabel(selectedStudent.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium">
                      {selectedStudent.user ? 'Registered' : 'Not Registered'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admission Date</p>
                    <p className="font-medium">
                      {new Date(selectedStudent.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Student</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editFormData.fullName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    className="input-field"
                    value={editFormData.status || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Program</label>
                  <select
                    className="input-field"
                    value={editFormData.programId || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, programId: e.target.value })}
                  >
                    <option value="">Select Program</option>
                    {programs.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.displayName?.en || p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateSubmit}
                    className="btn-primary flex items-center space-x-2"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isPasswordModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsPasswordModalOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Reset password for <strong>{selectedStudent.fullName}</strong> ({selectedStudent.email})
                </p>
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPasswordReset}
                    className="btn-primary flex items-center space-x-2"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    <span>Reset Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;