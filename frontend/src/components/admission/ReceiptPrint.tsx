import  { forwardRef } from 'react';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';

interface ReceiptPrintProps {
  data: {
    receiptNumber: string;
    studentName: string;
    studentAdmissionId: string;
    studentPhone: string;
    studentEmail: string;
    programName: string;
    paymentAmount: number;
    paymentMethod: string;
    receiptDate: string;
    generatedBy?: { email: string };
  };
}

const ReceiptPrint = forwardRef<HTMLDivElement, ReceiptPrintProps>(({ data }, ref) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US') + ' BDT';
  };

  return (
    <div ref={ref} className="bg-white shadow-lg rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
      {/* Receipt Container */}
      <div className="p-8 print:p-6">
        {/* Header with Logos */}
        <div className="flex items-center justify-between border-b-2 border-gray-200 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img src={btsLogo} alt="BTS Logo" className="h-16 w-auto object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Beyond the Syllabus</h1>
              <p className="text-sm text-gray-500">Cambridge English Training Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src={cambridgeLogo} alt="Cambridge English" className="h-12 w-auto object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-wider uppercase">Student Admission Receipt</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mt-2"></div>
        </div>

        {/* Receipt Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-xl p-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt Number</p>
            <p className="text-lg font-bold text-gray-900">{data.receiptNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</p>
            <p className="text-lg font-bold text-gray-900">{formatDate(data.receiptDate)}</p>
            <p className="text-sm text-gray-500">{formatTime(data.receiptDate)}</p>
          </div>
        </div>

        {/* Student Information */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Student Information</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-500">Student Name</p>
              <p className="font-medium text-gray-900">{data.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Admission ID</p>
              <p className="font-medium text-gray-900">{data.studentAdmissionId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{data.studentPhone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{data.studentEmail}</p>
            </div>
          </div>
        </div>

        {/* Program & Payment Information */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Program & Payment Information</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-500">Program Name</p>
              <p className="font-medium text-gray-900">{data.programName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900">{data.paymentMethod}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Payment Amount</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(data.paymentAmount)}</p>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t-2 border-gray-200">
          <div>
            <div className="h-12 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600 text-center">Authorized Signature</p>
          </div>
          <div>
            <div className="h-12 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600 text-center">Admin/Teacher Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center">
          <p className="text-sm font-medium text-gray-700">
            Thank you for choosing Beyond the Syllabus.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This is a computer-generated receipt. No signature is required.
          </p>
        </div>

        {/* Generated By */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Generated by: {data.generatedBy?.email || 'System'}
          </p>
        </div>
      </div>
    </div>
  );
});

ReceiptPrint.displayName = 'ReceiptPrint';

export default ReceiptPrint;