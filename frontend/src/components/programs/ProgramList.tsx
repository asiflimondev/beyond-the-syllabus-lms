import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Edit, 
  Trash2, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  DollarSign
} from 'lucide-react';
import { programsApi, Program } from '@api/programs.api';
import { useAuth } from '@context/AuthContext';

interface ProgramListProps {
  onEdit: (program: Program) => void;
  onCreate: () => void;
}

const ProgramList: React.FC<ProgramListProps> = ({ onEdit }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);

  // Fetch programs
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['programs', page, limit, search, showDeleted],
    queryFn: () => {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (!showDeleted) params.isActive = true;
      return programsApi.getAll(params);
    },
  });

  // Extract programs from the response - data is the Axios response
  const extractPrograms = (): Program[] => {
    if (!data) return [];
    const responseData = data.data;
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

  // Get pagination info
  const getPagination = () => {
    if (!data) return { total: 0, totalPages: 1 };
    const responseData = data.data;
    if (!responseData) return { total: 0, totalPages: 1 };
    
    if (responseData.pagination) return responseData.pagination;
    if (responseData.data?.pagination) return responseData.data.pagination;
    return { total: programs.length, totalPages: 1 };
  };

  const pagination = getPagination();
  const total = pagination.total || programs.length;
  const totalPages = pagination.totalPages || 1;

  // Delete program mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => programsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete program');
    },
  });

  // Restore program mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => programsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program restored successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore program');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (id: string) => {
    if (window.confirm('Are you sure you want to restore this program?')) {
      restoreMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Show deleted</span>
            </label>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {total} programs
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading programs...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 text-red-700">
          <p>Failed to load programs: {(error as any)?.message || 'Unknown error'}</p>
        </div>
      )}

      {/* Programs Table */}
      {!isLoading && !isError && (
        <>
          {programs && programs.length > 0 ? (
            <>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50/80 to-gray-50/40">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Display Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Fee (BDT)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {programs.map((program: Program) => (
                        <tr key={program.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-primary-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {program.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-700">{program.displayName?.en || 'N/A'}</div>
                            <div className="text-xs text-gray-400">{program.displayName?.bn || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {program.duration} months
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                              ৳{program.fee?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                program.isActive
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {program.isActive ? 'Active' : 'Deleted'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {isAdmin && (
                                <>
                                  {program.isActive ? (
                                    <>
                                      <button
                                        onClick={() => onEdit(program)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(program.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleRestore(program.id)}
                                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                      title="Restore"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </button>
                                  )}
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
                  Showing <span className="font-medium text-gray-700">{programs.length}</span> of{' '}
                  <span className="font-medium text-gray-700">{total}</span> programs
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-600 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Empty state - WITHOUT the "Create your first program" button (since it's in the parent)
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No programs found</p>
              <p className="text-sm text-gray-400 mt-1">
                {search ? 'Try adjusting your search' : 'Get started by creating your first program'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgramList;