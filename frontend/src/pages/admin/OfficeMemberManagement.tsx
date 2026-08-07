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
  Building
} from 'lucide-react';
import { officeMemberManagementApi, OfficeMember } from '@api/admin/officeMember.api';
import OfficeMemberForm from '@components/admin/OfficeMemberForm';

const OfficeMemberManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOfficeMember, setEditingOfficeMember] = useState<OfficeMember | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);

  // Fetch office members
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['office-members', page, limit, search, showDeleted],
    queryFn: () =>
      officeMemberManagementApi.getAllOfficeMembers({
        page,
        limit,
        search: search || undefined,
        isActive: showDeleted ? 'false' : 'true',
      }),
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['office-member-stats'],
    queryFn: () => officeMemberManagementApi.getStats(),
  });

  const stats = statsData?.data?.data || { total: 0, active: 0, inactive: 0 };

  // Extract office members
  const extractOfficeMembers = (): OfficeMember[] => {
    if (!data) return [];
    const responseData = data.data;
    if (!responseData) return [];
    if (responseData.data?.officeMembers) return responseData.data.officeMembers;
    if (responseData.officeMembers) return responseData.officeMembers;
    return [];
  };

  const officeMembers = extractOfficeMembers();
  const total = data?.data?.data?.pagination?.total || data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.data?.pagination?.totalPages || data?.data?.pagination?.totalPages || 1;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => officeMemberManagementApi.createOfficeMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['office-members'] });
      queryClient.invalidateQueries({ queryKey: ['office-member-stats'] });
      toast.success('Office member created successfully');
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create office member');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      officeMemberManagementApi.updateOfficeMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['office-members'] });
      queryClient.invalidateQueries({ queryKey: ['office-member-stats'] });
      toast.success('Office member updated successfully');
      setIsFormOpen(false);
      setEditingOfficeMember(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update office member');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => officeMemberManagementApi.deleteOfficeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['office-members'] });
      queryClient.invalidateQueries({ queryKey: ['office-member-stats'] });
      toast.success('Office member deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete office member');
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => officeMemberManagementApi.restoreOfficeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['office-members'] });
      queryClient.invalidateQueries({ queryKey: ['office-member-stats'] });
      toast.success('Office member restored successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore office member');
    },
  });

  // Permanent Delete mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: (id: string) => officeMemberManagementApi.permanentlyDeleteOfficeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['office-members'] });
      queryClient.invalidateQueries({ queryKey: ['office-member-stats'] });
      toast.success('Office member permanently deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to permanently delete office member');
    },
  });

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: any) => {
    if (editingOfficeMember) {
      updateMutation.mutate({ id: editingOfficeMember.id, data });
    }
  };

  const handleEdit = (officeMember: OfficeMember) => {
    setEditingOfficeMember(officeMember);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this office member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (id: string) => {
    if (window.confirm('Are you sure you want to restore this office member?')) {
      restoreMutation.mutate(id);
    }
  };

  const handlePermanentDelete = (id: string, fullName: string, employeeId: string) => {
    if (window.confirm(
      `⚠️ PERMANENT DELETE\n\n` +
      `Are you sure you want to permanently delete "${fullName}" (${employeeId})?\n\n` +
      `This action CANNOT be undone!\n` +
      `• The office member record will be permanently removed\n` +
      `• The associated user account will also be deleted`
    )) {
      const confirmText = window.prompt(
        `Type "PERMANENT" to confirm permanent deletion of ${employeeId}:`
      );
      if (confirmText === 'PERMANENT') {
        permanentDeleteMutation.mutate(id);
      } else if (confirmText !== null) {
        toast.error('Confirmation text did not match. Deletion cancelled.');
      }
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingOfficeMember(null);
  };

  const isLoadingMutation = createMutation.isPending || updateMutation.isPending;
  const isPermanentDeleting = permanentDeleteMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header - Glass styling */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">Office Members</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Office Member Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage office staff accounts</p>
        </div>
        <button
          onClick={() => {
            setEditingOfficeMember(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Office Member</span>
        </button>
      </div>

      {/* Stats Cards - Glass styling */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Total Staff', value: stats.total, icon: Users, color: 'from-blue-500 to-cyan-500' },
          { title: 'Active Staff', value: stats.active, icon: UserCheck, color: 'from-emerald-500 to-green-500' },
          { title: 'Inactive Staff', value: stats.inactive, icon: UserX, color: 'from-gray-500 to-gray-600' },
        ].map((stat) => (
          <div key={stat.title} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-primary-500/20`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters - Glass styling */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search office members by name, email, or employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Show deleted</span>
          </label>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading office members...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 text-red-700">
          <p>Failed to load office members: {(error as any)?.message || 'Unknown error'}</p>
        </div>
      )}

      {/* Office Members Table - Glass styling */}
      {!isLoading && !isError && (
        <>
          {officeMembers.length > 0 ? (
            <>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50/80 to-gray-50/40">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {officeMembers.map((member: OfficeMember) => (
                        <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.employeeId}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{member.fullName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{member.phone}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              !member.isDeleted && member.userId?.isActive !== false
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {!member.isDeleted && member.userId?.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {!member.isDeleted ? (
                                <>
                                  <button onClick={() => handleEdit(member)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDelete(member.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleRestore(member.id)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Restore">
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handlePermanentDelete(member.id, member.fullName, member.employeeId)} 
                                    className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all" 
                                    title="Permanently Delete (irreversible)"
                                    disabled={isPermanentDeleting}
                                  >
                                    <Trash2 className="w-4 h-4" />
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
                  Showing <span className="font-medium text-gray-700">{officeMembers.length}</span> of{' '}
                  <span className="font-medium text-gray-700">{total}</span> office members
                </div>
                <div className="flex items-center space-x-2">
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
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No office members found</p>
              <button
                onClick={() => {
                  setEditingOfficeMember(null);
                  setIsFormOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add your first office member</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Office Member Form Modal */}
      <OfficeMemberForm
        isOpen={isFormOpen}
        onClose={handleClose}
        onSubmit={editingOfficeMember ? handleUpdate : handleCreate}
        officeMember={editingOfficeMember}
        isLoading={isLoadingMutation}
      />
    </div>
  );
};

export default OfficeMemberManagement;