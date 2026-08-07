import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@api/report.api';
import { toast } from 'react-hot-toast';
import { Printer, Download, RefreshCw, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Link, useLocation } from 'react-router-dom';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';
import msign from '/msign.png';

const BatchReport: React.FC = () => {
  const location = useLocation();
  const isIndividual = location.pathname.includes('/individual');
  
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: filtersData, isLoading: filtersLoading } = useQuery({
    queryKey: ['report-filters'],
    queryFn: () => reportApi.getFilters(),
  });

  const filters = filtersData?.data?.data;

  const { data: reportData, isLoading: reportLoading, refetch, isError } = useQuery({
    queryKey: ['batch-report', selectedProgram, selectedTeacher],
    queryFn: () => reportApi.getBatchReport({
      programId: selectedProgram,
      ...(selectedTeacher && { teacherId: selectedTeacher }),
    }),
    enabled: !!selectedProgram,
  });

  const report = reportData?.data?.data;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page {
        size: landscape;
        margin: 10mm;
        margin-top: 0;
        margin-bottom: 0;
      }
      @media print {
        @page {
          margin-top: 0;
          margin-bottom: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }
        body * {
          visibility: hidden;
        }
        #report-print-area, #report-print-area * {
          visibility: visible;
        }
        #report-print-area {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          padding: 10mm;
          display: flex;
          flex-direction: column;
        }
        .no-print {
          display: none !important;
        }
        .print-container {
          padding: 0 !important;
          margin: 0 !important;
        }
        .print-header,
        .print-footer,
        .page-number,
        .url,
        .date-time {
          display: none !important;
        }
        .logo-bts {
          height: 65px !important;
          width: auto !important;
        }
        .logo-cambridge {
          height: 55px !important;
          width: auto !important;
        }
        .brand-name {
          font-size: 22px !important;
        }
        .brand-sub {
          font-size: 13px !important;
        }
        .receipt-title {
          font-size: 26px !important;
        }
        .receipt-label {
          font-size: 11px !important;
        }
        .receipt-value {
          font-size: 16px !important;
        }
        table {
          font-size: 11px !important;
        }
        th, td {
          padding: 5px 8px !important;
        }
        .report-header {
          margin-bottom: 8px !important;
          padding-bottom: 6px !important;
        }
        .report-info-grid {
          padding: 10px 14px !important;
          margin-bottom: 10px !important;
          gap: 4px !important;
        }
        .summary-box {
          padding: 6px 10px !important;
        }
        .summary-box p {
          font-size: 18px !important;
        }
        .summary-box .label {
          font-size: 9px !important;
        }
        .table-container {
          flex: 1;
          overflow: visible;
          margin-bottom: 10px !important;
        }
        .signature-section {
          margin-top: auto !important;
          padding-top: 8px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        .signature-section .signature-line {
          height: 45px !important;
        }
        .signature-section .signature-img {
          height: 40px !important;
        }
        .signature-label {
          font-size: 12px !important;
        }
        .footer-text {
          font-size: 11px !important;
        }
        .footer-address {
          font-size: 10px !important;
        }
        .content-area {
          flex: 1;
        }
      }
    `,
  });

  const handleGenerateReport = () => {
    if (!selectedProgram) {
      toast.error('Please select a program');
      return;
    }
    refetch();
  };

  const handlePrintReport = () => {
    setIsPrinting(true);
    setTimeout(() => {
      handlePrint();
      setIsPrinting(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const availablePrograms = filters?.programs || [];

  if (filtersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Reports</h2>
        <p className="text-sm text-gray-500 mt-1">Generate batch or individual student progress reports</p>
        
        <div className="flex gap-2 mt-4 border-b border-gray-200">
          <Link
            to="/admin/reports"
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              !isIndividual
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Batch Report
          </Link>
          <Link
            to="/admin/reports/individual"
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isIndividual
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Individual Report
          </Link>
        </div>
      </div>

      {!isIndividual ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Program <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                >
                  <option value="">Select a program</option>
                  {availablePrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName?.en || p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Teacher (Optional)
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                >
                  <option value="">All Teachers</option>
                  {filters?.teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {reportLoading ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              Failed to generate report. Please try again.
            </div>
          )}

          {report && (
            <>
              <div className="flex flex-wrap gap-3 no-print">
                <button
                  onClick={handlePrintReport}
                  disabled={isPrinting}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  {isPrinting ? 'Preparing...' : 'Print Report'}
                </button>
                <button
                  onClick={() => {
                    toast.success('PDF will be available in print preview');
                    handlePrintReport();
                  }}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print-container">
                <div ref={printRef} id="report-print-area" className="p-8 print:p-4">
                  {/* Report Header - Larger Logos */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4 print:pb-4 print:mb-4">
                    <div className="flex items-center gap-4">
                      <img src={btsLogo} alt="BTS Logo" className="h-20 w-auto object-contain print:h-16 logo-bts" />
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight print:text-2xl brand-name">Beyond the Syllabus</h1>
                        <p className="text-sm text-gray-500 print:text-xs brand-sub">Cambridge English Preparation Center</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={cambridgeLogo} alt="Cambridge English" className="h-16 w-auto object-contain print:h-14 logo-cambridge" />
                    </div>
                  </div>

                  {/* Title with Premium Styling */}
                  <div className="text-center mb-6 print:mb-4 report-header">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-wider uppercase relative inline-block print:text-3xl receipt-title">
                      Course Progress Report
                      <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full print:h-0.5"></span>
                    </h2>
                    <p className="text-base text-gray-500 mt-2 print:text-sm">Batch / Program Report</p>
                  </div>

                  <div className="content-area">
                    {/* Report Info */}
                    <div className="grid grid-cols-3 gap-4 mb-5 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 print:p-3 print:mb-4 print:gap-3 report-info-grid">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Program</p>
                        <p className="font-semibold text-gray-900 text-lg print:text-base receipt-value">{report.program.displayName?.en || report.program.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Total Students</p>
                        <p className="font-bold text-gray-900 text-lg print:text-base receipt-value">{report.totalStudents}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Generated</p>
                        <p className="font-semibold text-gray-900 text-lg print:text-base receipt-value">{formatDate(report.generatedDate)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-5 print:gap-3 print:mb-4">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-4 text-center print:p-3 summary-box">
                        <p className="text-2xl font-bold text-blue-600 print:text-xl">{report.totalStudents}</p>
                        <p className="text-[10px] text-gray-500 font-medium print:text-[9px] label">Total Students</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl border border-emerald-200 p-4 text-center print:p-3 summary-box">
                        <p className="text-2xl font-bold text-emerald-600 print:text-xl">{report.totalMockTests}</p>
                        <p className="text-[10px] text-gray-500 font-medium print:text-[9px] label">Total Mock Tests</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-xl border border-orange-200 p-4 text-center print:p-3 summary-box">
                        <p className="text-2xl font-bold text-orange-500 print:text-xl">
                          {report.totalMockTests > 0 && report.students.length > 0
                            ? Math.round(
                                report.students.reduce((acc, s) => {
                                  const completed = s.results.filter(r => r.percentage > 0).length;
                                  return acc + (completed / Math.max(report.totalMockTests, 1)) * 100;
                                }, 0) / report.students.length
                              )
                            : 0}%
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium print:text-[9px] label">Avg Completion</p>
                      </div>
                    </div>

                    {/* Table */}
                    {report.students.length > 0 && report.totalMockTests > 0 ? (
                      <div className="overflow-x-auto print:overflow-visible table-container">
                        <table className="w-full text-sm border-collapse print:text-xs">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 sticky left-0 bg-inherit z-10 print:px-2 print:py-1.5 print:text-[10px]">ID</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 sticky left-16 bg-inherit z-10 print:px-2 print:py-1.5 print:text-[10px]">Student</th>
                              {report.mockTests.map((mt) => {
                                const hasSections = mt.hasReading || mt.hasWriting || mt.hasListening || mt.hasSpeaking || mt.hasPresentation;
                                const sectionCount = [mt.hasReading, mt.hasWriting, mt.hasListening, mt.hasSpeaking, mt.hasPresentation].filter(Boolean).length;
                                return (
                                  <th
                                    key={mt.id}
                                    className="border border-gray-200 px-2 py-2 text-center text-xs font-semibold text-gray-600 min-w-[100px] print:px-1.5 print:py-1 print:text-[10px] print:min-w-[70px]"
                                    colSpan={hasSections ? sectionCount + 1 : 1}
                                  >
                                    <div className="text-xs print:text-[10px]">{mt.title}</div>
                                  </th>
                                );
                              })}
                            </tr>
                            <tr className="bg-gray-50/70">
                              <th className="border border-gray-200 px-3 py-1 text-xs text-gray-500 sticky left-0 bg-inherit z-10 print:px-2 print:py-0.5 print:text-[9px]"></th>
                              <th className="border border-gray-200 px-3 py-1 text-xs text-gray-500 sticky left-16 bg-inherit z-10 print:px-2 print:py-0.5 print:text-[9px]"></th>
                              {report.mockTests.map((mt) => (
                                <React.Fragment key={mt.id}>
                                  {mt.hasReading && <th className="border border-gray-200 px-1.5 py-1 text-[10px] text-gray-400 text-center font-normal print:px-1 print:py-0.5 print:text-[8px]">R({mt.readingTotal})</th>}
                                  {mt.hasWriting && <th className="border border-gray-200 px-1.5 py-1 text-[10px] text-gray-400 text-center font-normal print:px-1 print:py-0.5 print:text-[8px]">W({mt.writingTotal})</th>}
                                  {mt.hasListening && <th className="border border-gray-200 px-1.5 py-1 text-[10px] text-gray-400 text-center font-normal print:px-1 print:py-0.5 print:text-[8px]">L({mt.listeningTotal})</th>}
                                  {mt.hasSpeaking && <th className="border border-gray-200 px-1.5 py-1 text-[10px] text-gray-400 text-center font-normal print:px-1 print:py-0.5 print:text-[8px]">S</th>}
                                  {mt.hasPresentation && <th className="border border-gray-200 px-1.5 py-1 text-[10px] text-gray-400 text-center font-normal print:px-1 print:py-0.5 print:text-[8px]">P({mt.presentationTotal})</th>}
                                  <th className="border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-700 text-center bg-orange-50/80 print:px-1.5 print:py-0.5 print:text-[9px]">Total</th>
                                </React.Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {report.students.map((student, idx) => {
                              const studentResults = student.results || [];
                              return (
                                <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                  <td className="border border-gray-200 px-3 py-2 text-xs font-mono text-gray-600 sticky left-0 bg-inherit z-10 print:px-2 print:py-1.5 print:text-[9px]">{student.admissionId}</td>
                                  <td className="border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 sticky left-16 bg-inherit z-10 print:px-2 print:py-1.5 print:text-[10px]">{student.fullName}</td>
                                  {report.mockTests.map((mt) => {
                                    const result = studentResults.find((r) => r.mockTestId === mt.id);
                                    const totalMarks = result?.totalMarks || 0;
                                    return (
                                      <React.Fragment key={mt.id}>
                                        {mt.hasReading && (
                                          <td className="border border-gray-200 px-1.5 py-2 text-center text-xs print:px-1 print:py-1.5 print:text-[9px]">
                                            {result && result.reading.total > 0 ? <span className="text-gray-700">{result.reading.obtained}</span> : <span className="text-gray-300">-</span>}
                                          </td>
                                        )}
                                        {mt.hasWriting && (
                                          <td className="border border-gray-200 px-1.5 py-2 text-center text-xs print:px-1 print:py-1.5 print:text-[9px]">
                                            {result && result.writing.total > 0 ? <span className="text-gray-700">{result.writing.obtained}</span> : <span className="text-gray-300">-</span>}
                                          </td>
                                        )}
                                        {mt.hasListening && (
                                          <td className="border border-gray-200 px-1.5 py-2 text-center text-xs print:px-1 print:py-1.5 print:text-[9px]">
                                            {result && result.listening.total > 0 ? <span className="text-gray-700">{result.listening.obtained}</span> : <span className="text-gray-300">-</span>}
                                          </td>
                                        )}
                                        {mt.hasSpeaking && (
                                          <td className="border border-gray-200 px-1.5 py-2 text-center text-xs font-semibold print:px-1 print:py-1.5 print:text-[9px]">
                                            {result && result.speaking.grade !== 'F' ? <span className="text-gray-700">{result.speaking.grade}</span> : <span className="text-gray-300">-</span>}
                                          </td>
                                        )}
                                        {mt.hasPresentation && (
                                          <td className="border border-gray-200 px-1.5 py-2 text-center text-xs print:px-1 print:py-1.5 print:text-[9px]">
                                            {result && result.presentation.total > 0 ? <span className="text-gray-700">{result.presentation.marks}</span> : <span className="text-gray-300">-</span>}
                                          </td>
                                        )}
                                        <td className="border border-gray-200 px-2 py-2 text-center text-sm font-bold text-gray-900 bg-orange-50/50 print:px-1.5 print:py-1.5 print:text-[11px]">
                                          {totalMarks > 0 ? totalMarks : '-'}
                                        </td>
                                      </React.Fragment>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No data available for this report</p>
                      </div>
                    )}
                  </div>

                  {/* Signature Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200 print:mt-auto print:pt-3 signature-section">
                    <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto print:gap-6">
                      <div className="text-center">
                        <div className="h-14 border-b-2 border-gray-400 mb-2 flex items-center justify-center print:h-12 signature-line">
                          {/* Empty - no signature */}
                        </div>
                        <p className="text-sm font-semibold text-gray-700 print:text-xs signature-label">Exam Coordinator</p>
                      </div>
                      <div className="text-center">
                        <div className="h-14 border-b-2 border-gray-400 mb-2 flex items-center justify-center print:h-12 signature-line">
                          <img 
                            src={msign} 
                            alt="Academic Director Signature" 
                            className="h-12 w-auto object-contain opacity-80 print:h-10 signature-img"
                          />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 print:text-xs signature-label">Academic Director</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-200 text-center print:mt-4 print:pt-3 footer-text">
                    <p className="text-sm font-semibold text-gray-700 print:text-xs footer-text">
                      Thank you for choosing Beyond the Syllabus.
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100 print:mt-2 print:pt-2">
                      <p className="text-xs text-gray-400 print:text-[10px] footer-address">
                        Beyond the Syllabus · Cambridge English Preparation Center · Dhaka, Bangladesh
                      </p>
                      <p className="text-xs text-gray-400 mt-1 print:text-[10px] print:mt-0.5 footer-address">
                        www.beyondthesyllabus.org
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {!selectedProgram && !report && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-16 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">Select a program to generate report</h3>
              <p className="text-sm text-gray-500 mt-1">Choose a program and click "Generate Report"</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700">
          <p>Individual Report view loaded from the IndividualReport component.</p>
          <p className="text-sm mt-1">The <strong>IndividualReport</strong> component handles this view with student search functionality.</p>
        </div>
      )}
    </div>
  );
};

export default BatchReport;