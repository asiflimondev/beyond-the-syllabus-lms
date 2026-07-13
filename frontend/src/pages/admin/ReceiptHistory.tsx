import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Receipt as ReceiptIcon, 
  Search, 
  Printer, 
  Download, 
  Eye,
  Calendar,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { receiptApi } from '@api/receipt.api';
import ReceiptPreview from '@components/admission/ReceiptPreview';

const ReceiptHistory: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['receipts', page, search, startDate, endDate, minAmount, maxAmount],
    queryFn: () =>
      receiptApi.getAllReceipts({
        page,
        limit,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
      }),
  });

  // Extract receipts and map _id to id for frontend use
  const rawReceipts = data?.data?.data?.receipts || [];
  
  // Map MongoDB _id to id for frontend
  const receipts = rawReceipts.map((receipt: any) => ({
    ...receipt,
    id: receipt._id || receipt.id,
    // Handle populated fields
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
  }));

  const pagination = data?.data?.data?.pagination;

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
    // Prepare data for preview
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
    // Open print after state update
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
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
          {/* Search */}
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

          {/* Start Date */}
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

          {/* End Date */}
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

          {/* Amount Range */}
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

        {/* Filter Actions */}
        {(search || startDate || endDate || minAmount || maxAmount) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        )}
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
            <p className="text-gray-500 text-lg">No receipts found</p>
            <p className="text-sm text-gray-400 mt-1">Admit a student to generate the first receipt</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {receipts.map((receipt: any) => (
                    <tr key={receipt.id || receipt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {receipt.receiptNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {receipt.studentName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {receipt.studentAdmissionId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {receipt.programName}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary-600">
                        {formatCurrency(receipt.paymentAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(receipt.receiptDate)}
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
                          <button
                            onClick={() => {
                              toast.success('PDF download feature coming soon!');
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
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