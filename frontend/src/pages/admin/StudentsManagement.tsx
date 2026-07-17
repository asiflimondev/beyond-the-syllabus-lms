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
  UserPlus,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { studentManagementApi, Student } from '@api/admin/student.api';
import { programsApi } from '@api/programs.api';
import { Link } from 'react-router-dom';

// ============================================
// CONSTANTS
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

// ============================================
// MAIN COMPONENT
// ============================================
const StudentsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
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

  // Delete mutation (soft delete)
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

  // Permanent Delete mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: (id: string) => studentManagementApi.permanentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      queryClient.invalidateQueries({ queryKey: ['student-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admission-settings'] });
      queryClient.invalidateQueries({ queryKey: ['all-students-for-id'] });
      toast.success('Student permanently deleted. Admission ID is now available.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to permanently delete student');
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

  // Handlers
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

  const handlePermanentDelete = (student: Student) => {
    if (window.confirm(
      `⚠️ PERMANENT DELETE\n\n` +
      `Are you sure you want to permanently delete "${student.fullName}" (${student.admissionId})?\n\n` +
      `This action CANNOT be undone!\n` +
      `• The student record will be permanently removed\n` +
      `• The Admission ID "${student.admissionId}" will become available for reuse\n` +
      `• Any associated user account will also be deleted`
    )) {
      const confirmText = window.prompt(
        `Type "PERMANENT" to confirm permanent deletion of ${student.admissionId}:`
      );
      if (confirmText === 'PERMANENT') {
        permanentDeleteMutation.mutate(student.id);
      } else if (confirmText !== null) {
        toast.error('Confirmation text did not match. Deletion cancelled.');
      }
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
      admissionId: student.admissionId,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (selectedStudent) {
      updateMutation.mutate({ id: selectedStudent.id, data: editFormData });
    }
  };

  const isPermanentDeleting = permanentDeleteMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header - UPDATED with glass styling */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">Students</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all students and their accounts</p>
        </div>
        <Link
          to="/admin/admission"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <UserPlus className="w-5 h-5" />
          Admit New Student
        </Link>
      </div>

      {/* Stats Cards - UPDATED with glass styling */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { title: 'Total', value: stats.total, icon: Users, color: 'from-blue-500 to-cyan-500' },
          { title: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-amber-500' },
          { title: 'Active', value: stats.active, icon: UserCheck, color: 'from-emerald-500 to-green-500' },
          { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-blue-500 to-blue-600' },
          { title: 'Inactive', value: stats.inactive, icon: UserX, color: 'from-gray-500 to-gray-600' },
        ].map((stat) => (
          <div key={stat.title} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-primary-500/20`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters - UPDATED */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, admission ID, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2.5 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          >
            <option value="">All Status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Show deleted
          </label>
        </div>
      </div>

      {/* Table - UPDATED with glass styling */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
          <div className="spinner spinner-lg text-primary-600" />
        </div>
      ) : isError ? (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Failed to load students: {(error as any)?.message || 'Unknown error'}</span>
        </div>
      ) : students.length > 0 ? (
        <>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50/80 to-gray-50/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admission ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {students.map((student: Student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{student.admissionId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-medium">
                            {student.fullName?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.fullName}</p>
                            <p className="text-xs text-gray-400">{student.user?.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {student.phone}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {student.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.program?.displayName?.en || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${getStatusColor(student.status)}`}>
                          {getStatusLabel(student.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {student.user ? (
                          <span className="badge badge-success">Registered</span>
                        ) : (
                          <span className="badge badge-warning">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEdit(student)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          {student.user && (
                            <button onClick={() => handleResetPassword(student)} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Reset Password">
                              <Key className="w-4 h-4" />
                            </button>
                          )}
                          {!student.isDeleted ? (
                            <button onClick={() => handleDelete(student.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button onClick={() => handleRestore(student.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Restore">
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button onClick={() => handlePermanentDelete(student)} disabled={isPermanentDeleting} className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Permanently Delete (irreversible)">
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                            </>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{students.length}</span> of{' '}
              <span className="font-medium text-gray-700">{total}</span> students
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 px-2">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-16 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No students found</h3>
            <p className="text-sm text-gray-500 mt-1">Get started by admitting your first student.</p>
            <Link to="/admin/admission" className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <UserPlus className="w-5 h-5" />
              Admit New Student
            </Link>
          </div>
        </div>
      )}

      {/* ==========================================
    EDIT STUDENT MODAL - FIXED with proper z-index
    ========================================== */}
{isEditModalOpen && selectedStudent && (
  <div className="fixed inset-0 z-[100] overflow-y-auto">
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
    <div className="relative z-[101] min-h-screen flex items-center justify-center p-4">
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full border border-white/50 animate-scale-in">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Edit Student</h3>
              <p className="text-sm text-primary-100">Update student information</p>
            </div>
          </div>
          <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="label font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              value={editFormData.fullName || ''}
              onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="label font-medium text-gray-700">Phone</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label font-medium text-gray-700">Status</label>
            <select
              className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
            <label className="label font-medium text-gray-700">Admission ID</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all cursor-not-allowed"
              value={editFormData.admissionId || ''}
              onChange={(e) => setEditFormData({ ...editFormData, admissionId: e.target.value })}
              placeholder="Enter Admission ID"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Admission ID cannot be changed</p>
          </div>
          <div>
            <label className="label font-medium text-gray-700">Program</label>
            <select
              className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50">
            <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200">
              Cancel
            </button>
            <button onClick={handleUpdateSubmit} className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <span className="spinner spinner-sm border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* View Student Modal - Keep existing but with glass styling */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/50 animate-scale-in">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Student Details</h3>
                    <p className="text-sm text-primary-100">View student information</p>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Admission ID</p>
                    <p className="font-mono text-sm font-medium text-gray-900">{selectedStudent.admissionId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStudent.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Program</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStudent.program?.displayName?.en || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Status</p>
                    <span className={`badge ${getStatusColor(selectedStudent.status)}`}>
                      {getStatusLabel(selectedStudent.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Account Status</p>
                    <span className={`badge ${selectedStudent.user ? 'badge-success' : 'badge-warning'}`}>
                      {selectedStudent.user ? 'Registered' : 'Not Registered'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Admission Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedStudent.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal - Keep existing with glass styling */}
      {isPasswordModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/50 animate-scale-in">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Reset Password</h3>
                    <p className="text-sm text-primary-100">Reset student's password</p>
                  </div>
                </div>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">Reset password for <strong>{selectedStudent.fullName}</strong></p>
                <div>
                  <label className="label font-medium text-gray-700">New Password</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50">
                  <button onClick={() => setIsPasswordModalOpen(false)} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200">
                    Cancel
                  </button>
                  <button onClick={handleSubmitPasswordReset} className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50" disabled={resetPasswordMutation.isPending}>
                    {resetPasswordMutation.isPending ? (
                      <>
                        <span className="spinner spinner-sm border-white/30 border-t-white" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        Reset Password
                      </>
                    )}
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