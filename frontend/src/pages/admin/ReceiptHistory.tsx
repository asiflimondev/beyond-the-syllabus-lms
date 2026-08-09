import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Receipt as ReceiptIcon, 
  Search, 
  Printer, 
  Eye,
  Calendar,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { receiptApi } from '@api/receipt.api';
import ReceiptPreview from '@components/admission/ReceiptPreview';

const ReceiptHistory: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['receipts', page, search, startDate, endDate, minAmount, maxAmount, showDeleted],
    queryFn: () =>
      receiptApi.getAllReceipts({
        page,
        limit,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
        showDeleted: showDeleted,  // <--- ADDED
      }),
  });

  // Extract receipts and map _id to id for frontend use
  const rawReceipts = data?.data?.data?.receipts || [];
  
  // Map MongoDB _id to id for frontend
  const receipts = rawReceipts.map((receipt: any) => ({
    ...receipt,
    id: receipt._id || receipt.id,
    studentName: typeof receipt.studentId === 'object' && receipt.studentId?.fullName 
      ? receipt.studentId.fullName 
      : receipt.studentName,
    studentAdmissionId: typeof receipt.studentId === 'object' && receipt.studentId?.admissionId 
      ? receipt.studentId.admissionId 
      : receipt.studentAdmissionId,
    studentPhone: typeof receipt.studentId === 'object' && receipt.studentId?.phone 
      ? receipt.studentId.phone 
      : receipt.studentPhone,
    studentEmail: typeof receipt.studentId === 'object' && receipt.studentId?.email 
      ? receipt.studentId.email 
      : receipt.studentEmail,
    programName: typeof receipt.programId === 'object' && receipt.programId?.displayName?.en 
      ? receipt.programId.displayName.en 
      : receipt.programName,
    generatedBy: typeof receipt.generatedBy === 'object' && receipt.generatedBy?.email 
      ? receipt.generatedBy 
      : { email: 'System' },
    isDeleted: receipt.isDeleted || false,
  }));

  const pagination = data?.data?.data?.pagination;

  // Soft Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => receiptApi.deleteReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success('Receipt deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete receipt');
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => receiptApi.restoreReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success('Receipt restored successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore receipt');
    },
  });

  // Permanent Delete mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: (id: string) => receiptApi.permanentlyDeleteReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success('Receipt permanently deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to permanently delete receipt');
    },
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString('en-US') + ' BDT' || '0 BDT';
  };

  const handleViewReceipt = (receipt: any) => {
    const previewData = {
      id: receipt.id,
      receiptNumber: receipt.receiptNumber,
      studentName: receipt.studentName,
      studentAdmissionId: receipt.studentAdmissionId,
      studentPhone: receipt.studentPhone,
      studentEmail: receipt.studentEmail,
      programName: receipt.programName,
      paymentAmount: receipt.paymentAmount,
      paymentMethod: receipt.paymentMethod || 'Cash',
      receiptDate: receipt.receiptDate,
      generatedBy: receipt.generatedBy,
    };
    setSelectedReceipt(previewData);
    setIsPreviewOpen(true);
  };

  const handlePrintReceipt = (receipt: any) => {
    const previewData = {
      id: receipt.id,
      receiptNumber: receipt.receiptNumber,
      studentName: receipt.studentName,
      studentAdmissionId: receipt.studentAdmissionId,
      studentPhone: receipt.studentPhone,
      studentEmail: receipt.studentEmail,
      programName: receipt.programName,
      paymentAmount: receipt.paymentAmount,
      paymentMethod: receipt.paymentMethod || 'Cash',
      receiptDate: receipt.receiptDate,
      generatedBy: receipt.generatedBy,
    };
    setSelectedReceipt(previewData);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDelete = (id: string, receiptNumber: string) => {
    if (window.confirm(`Are you sure you want to delete receipt "${receiptNumber}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (id: string, receiptNumber: string) => {
    if (window.confirm(`Are you sure you want to restore receipt "${receiptNumber}"?`)) {
      restoreMutation.mutate(id);
    }
  };

  const handlePermanentDelete = (id: string, receiptNumber: string) => {
    if (window.confirm(
      `⚠️ PERMANENT DELETE\n\n` +
      `Are you sure you want to permanently delete receipt "${receiptNumber}"?\n\n` +
      `This action CANNOT be undone!\n` +
      `• The receipt record will be permanently removed`
    )) {
      const confirmText = window.prompt(
        `Type "PERMANENT" to confirm permanent deletion of ${receiptNumber}:`
      );
      if (confirmText === 'PERMANENT') {
        permanentDeleteMutation.mutate(id);
      } else if (confirmText !== null) {
        toast.error('Confirmation text did not match. Deletion cancelled.');
      }
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setShowDeleted(false);
    setPage(1);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedReceipt(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Receipt History</h2>
          <p className="text-sm text-gray-500">View and manage all student admission receipts</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Total: <strong>{pagination?.total || 0}</strong> receipts
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Show deleted</span>
          </label>
          {(search || startDate || endDate || minAmount || maxAmount || showDeleted) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading receipts...</span>
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-center py-16">
            <ReceiptIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {showDeleted ? 'No deleted receipts found' : 'No receipts found'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {showDeleted ? 'Deleted receipts will appear here' : 'Admit a student to generate the first receipt'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {receipts.map((receipt: any) => (
                    <tr key={receipt.id || receipt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{receipt.receiptNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{receipt.studentName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{receipt.studentAdmissionId}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{receipt.programName}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary-600">{formatCurrency(receipt.paymentAmount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(receipt.receiptDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          receipt.isDeleted
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {receipt.isDeleted ? 'Deleted' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewReceipt(receipt)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(receipt)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                            title="Print Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {receipt.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestore(receipt.id, receipt.receiptNumber)}
                                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                title="Restore"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handlePermanentDelete(receipt.id, receipt.receiptNumber)}
                                className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all"
                                title="Permanently Delete (irreversible)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDelete(receipt.id, receipt.receiptNumber)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <ReceiptPreview
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          receiptData={selectedReceipt}
        />
      )}
    </div>
  );
};

export default ReceiptHistory;