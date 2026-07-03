import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { teacherManagementApi, Teacher } from '@api/admin/teacher.api';
import TeacherForm from '@components/admin/TeacherForm';

const TeacherManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);

  // Fetch teachers
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['teachers', page, limit, search, showDeleted],
    queryFn: () =>
      teacherManagementApi.getAllTeachers({
        page,
        limit,
        search: search || undefined,
        isActive: showDeleted ? 'false' : 'true',
      }),
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['teacher-stats'],
    queryFn: () => teacherManagementApi.getStats(),
  });

  const stats = statsData?.data?.data || { total: 0, active: 0, inactive: 0 };

  // Extract teachers
  const extractTeachers = (): Teacher[] => {
    if (!data) return [];
    const responseData = data.data;
    if (!responseData) return [];
    if (responseData.data?.teachers) return responseData.data.teachers;
    if (responseData.teachers) return responseData.teachers;
    return [];
  };

  const teachers = extractTeachers();
  const total = data?.data?.data?.pagination?.total || data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.data?.pagination?.totalPages || data?.data?.pagination?.totalPages || 1;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => teacherManagementApi.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      toast.success('Teacher created successfully');
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create teacher');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      teacherManagementApi.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      toast.success('Teacher updated successfully');
      setIsFormOpen(false);
      setEditingTeacher(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update teacher');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => teacherManagementApi.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      toast.success('Teacher deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete teacher');
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => teacherManagementApi.restoreTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      toast.success('Teacher restored successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore teacher');
    },
  });

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: any) => {
    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, data });
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (id: string) => {
    if (window.confirm('Are you sure you want to restore this teacher?')) {
      restoreMutation.mutate(id);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingTeacher(null);
  };

  const isLoadingMutation = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
          <p className="text-sm text-gray-500">Manage teachers and their program assignments</p>
        </div>
        <button
          onClick={() => {
            setEditingTeacher(null);
            setIsFormOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Teachers</p>
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
              <p className="text-sm text-gray-500">Active Teachers</p>
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
              <p className="text-sm text-gray-500">Inactive Teachers</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="w-5 h-5 text-red-600" />
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
            placeholder="Search teachers by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
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
          <span className="ml-3 text-gray-600">Loading teachers...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Failed to load teachers: {(error as any)?.message || 'Unknown error'}</p>
        </div>
      )}

      {/* Teachers Table */}
      {!isLoading && !isError && (
        <>
          {teachers.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Programs
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teachers.map((teacher: Teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {teacher.employeeId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {teacher.fullName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {teacher.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {teacher.phone}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {teacher.programIds?.length || 0} programs
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                !teacher.isDeleted && teacher.userId?.isActive !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {!teacher.isDeleted && teacher.userId?.isActive !== false
                                ? 'Active'
                                : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {!teacher.isDeleted ? (
                                <>
                                  <button
                                    onClick={() => handleEdit(teacher)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(teacher.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleRestore(teacher.id)}
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
                  Showing {teachers.length} of {total} teachers
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
              <p className="text-gray-500">No teachers found</p>
              <button
                onClick={() => {
                  setEditingTeacher(null);
                  setIsFormOpen(true);
                }}
                className="mt-4 btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add your first teacher</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Teacher Form Modal */}
      <TeacherForm
        isOpen={isFormOpen}
        onClose={handleClose}
        onSubmit={editingTeacher ? handleUpdate : handleCreate}
        teacher={editingTeacher}
        isLoading={isLoadingMutation}
      />
    </div>
  );
};

export default TeacherManagement;