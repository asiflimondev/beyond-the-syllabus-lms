import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import ReceiptPrint from './ReceiptPrint';

interface ReceiptPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    id: string;
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

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ isOpen, onClose, receiptData }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm 15mm;
      }
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body {
          margin: 0;
          padding: 0;
          background: white;
        }
        .no-print {
          display: none !important;
        }
        .receipt-preview-wrapper {
          box-shadow: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
        }
      }
    `,
  });

  const handleDownloadPDF = () => {
    // This opens the print dialog where users can select "Save as PDF"
    handlePrint();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-900/60 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0a0f2a] to-[#1a2360] px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Receipt Generated</h3>
                <p className="text-sm text-white/70">Student admitted successfully</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Receipt:</span>
              <span className="text-xs font-bold text-gray-700">{receiptData.receiptNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gradient-to-r from-[#0a0f2a] to-[#1a2360] hover:shadow-xl text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-gradient-to-r from-[#0a0f2a] to-[#1a2360] hover:shadow-xl text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100 no-print">
            <div className="max-w-4xl mx-auto receipt-preview-wrapper">
              <ReceiptPrint ref={printRef} data={receiptData} />
            </div>
          </div>
          
          {/* Print-only wrapper */}
          <div className="hidden print:block">
            <ReceiptPrint ref={printRef} data={receiptData} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReceiptPreview;