import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@api/report.api';
import { toast } from 'react-hot-toast';
import { Printer, Download, RefreshCw, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Link, useLocation } from 'react-router-dom';

const BatchReport: React.FC = () => {
  const location = useLocation();
  const isIndividual = location.pathname.includes('/individual');
  
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch filters
  const { data: filtersData, isLoading: filtersLoading } = useQuery({
    queryKey: ['report-filters'],
    queryFn: () => reportApi.getFilters(),
  });

  const filters = filtersData?.data?.data;

  // Fetch batch report
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
        margin: 12mm;
      }
      @media print {
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
        }
        .no-print {
          display: none !important;
        }
        .print-container {
          padding: 0 !important;
          margin: 0 !important;
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
      month: 'short',
      day: 'numeric',
    });
  };

  // Get available programs for teacher
  const availablePrograms = filters?.programs || [];

  if (filtersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Reports</h2>
        <p className="text-sm text-gray-500 mt-1">Generate batch or individual student progress reports</p>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4 border-b border-gray-200">
          <Link
            to="/admin/reports"
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              !isIndividual
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Batch Report
          </Link>
          <Link
            to="/admin/reports/individual"
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isIndividual
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Individual Report
          </Link>
        </div>
      </div>

      {!isIndividual ? (
        // ==========================================
        // BATCH REPORT VIEW
        // ==========================================
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Program <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                  className="w-full px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
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

          {/* Report Content */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              Failed to generate report. Please try again.
            </div>
          )}

          {report && (
            <>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 no-print">
                <button
                  onClick={handlePrintReport}
                  disabled={isPrinting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
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

              {/* Report Preview - same as before */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print-container">
                <div ref={printRef} id="report-print-area" className="p-8 print:p-6">
                  {/* Report Header */}
                  <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 font-display">Beyond the Syllabus</h1>
                    <p className="text-gray-500 text-sm">Cambridge English Training Center</p>
                    <h2 className="text-xl font-semibold text-gray-800 mt-4">Student Progress Report</h2>
                    <p className="text-gray-600 text-sm mt-1">Batch / Program Report</p>
                  </div>

                  {/* Report Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-gray-500">Program</p>
                      <p className="font-semibold text-gray-900">{report.program.displayName?.en || report.program.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Teacher</p>
                      <p className="font-semibold text-gray-900">{report.teacher?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Students</p>
                      <p className="font-semibold text-gray-900">{report.totalStudents}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Generated</p>
                      <p className="font-semibold text-gray-900">{formatDate(report.generatedDate)}</p>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{report.totalStudents}</p>
                      <p className="text-xs text-gray-500">Total Students</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{report.totalMockTests}</p>
                      <p className="text-xs text-gray-500">Total Mock Tests</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {report.totalMockTests > 0 && report.students.length > 0
                          ? Math.round(
                              report.students.reduce((acc, s) => {
                                const completed = s.results.filter(r => r.percentage > 0).length;
                                return acc + (completed / Math.max(report.totalMockTests, 1)) * 100;
                              }, 0) / report.students.length
                            )
                          : 0}%
                      </p>
                      <p className="text-xs text-gray-500">Avg Completion</p>
                    </div>
                  </div>

                  {/* Table - same as before */}
                  {report.students.length > 0 && report.totalMockTests > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 sticky left-0 bg-gray-50 z-10">
                              ID
                            </th>
                            <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 sticky left-16 bg-gray-50 z-10">
                              Student
                            </th>
                            {report.mockTests.map((mt) => (
                              <th
                                key={mt.id}
                                className="border border-gray-200 px-2 py-2 text-center text-xs font-semibold text-gray-600 min-w-[120px]"
                                colSpan={(() => {
                                  let count = 1;
                                  if (mt.hasReading) count++;
                                  if (mt.hasWriting) count++;
                                  if (mt.hasListening) count++;
                                  if (mt.hasSpeaking) count++;
                                  if (mt.hasPresentation) count++;
                                  return count;
                                })()}
                              >
                                <div className="text-xs">{mt.title}</div>
                                <div className="text-[10px] font-normal text-gray-400">#{mt.testNumber}</div>
                              </th>
                            ))}
                          </tr>
                          <tr className="bg-gray-50/70">
                            <th className="border border-gray-200 px-3 py-1.5 text-xs text-gray-500 sticky left-0 bg-gray-50 z-10"></th>
                            <th className="border border-gray-200 px-3 py-1.5 text-xs text-gray-500 sticky left-16 bg-gray-50 z-10"></th>
                            {report.mockTests.map((mt) => (
                              <React.Fragment key={mt.id}>
                                <th className="border border-gray-200 px-1 py-1.5 text-[10px] text-gray-400 text-center font-normal">
                                  Total
                                </th>
                                {mt.hasReading && (
                                  <th className="border border-gray-200 px-1 py-1.5 text-[10px] text-gray-400 text-center font-normal">
                                    R({mt.readingTotal})
                                  </th>
                                )}
                                {mt.hasWriting && (
                                  <th className="border border-gray-200 px-1 py-1.5 text-[10px] text-gray-400 text-center font-normal">
                                    W({mt.writingTotal})
                                  </th>
                                )}
                                {mt.hasListening && (
                                  <th className="border border-gray-200 px-1 py-1.5 text-[10px] text-gray-400 text-center font-normal">
                                    L({mt.listeningTotal})
                                  </th>
                                )}
                                {mt.hasSpeaking && (
                                  <th className="border border-gray-200 px-1 py-1.5 text-[10px] text-gray-400 text-center font-normal">
                                    S
                                  </th>
                                )}
                                {mt.hasPresentation && (
                                  <th className="border border-gray-200 px-1 py-1.5 text-[10px] text-gray-400 text-center font-normal">
                                    P({mt.presentationTotal})
                                  </th>
                                )}
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {report.students.map((student, idx) => {
                            const studentResults = student.results || [];
                            return (
                              <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                <td className="border border-gray-200 px-3 py-2 text-xs font-mono text-gray-600 sticky left-0 bg-inherit z-10">
                                  {student.admissionId}
                                </td>
                                <td className="border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 sticky left-16 bg-inherit z-10">
                                  {student.fullName}
                                </td>
                                {report.mockTests.map((mt) => {
                                  const result = studentResults.find(
                                    (r) => r.mockTestId === mt.id
                                  );
                                  return (
                                    <React.Fragment key={mt.id}>
                                      <td className="border border-gray-200 px-2 py-2 text-center text-sm font-semibold">
                                        {result && result.totalMarks > 0 ? (
                                          <span className="text-gray-900">{result.totalMarks}</span>
                                        ) : (
                                          <span className="text-gray-300">-</span>
                                        )}
                                      </td>
                                      {mt.hasReading && (
                                        <td className="border border-gray-200 px-2 py-2 text-center text-xs">
                                          {result && result.reading.total > 0 ? (
                                            <span className="text-gray-700">{result.reading.obtained}</span>
                                          ) : (
                                            <span className="text-gray-300">-</span>
                                          )}
                                        </td>
                                      )}
                                      {mt.hasWriting && (
                                        <td className="border border-gray-200 px-2 py-2 text-center text-xs">
                                          {result && result.writing.total > 0 ? (
                                            <span className="text-gray-700">{result.writing.obtained}</span>
                                          ) : (
                                            <span className="text-gray-300">-</span>
                                          )}
                                        </td>
                                      )}
                                      {mt.hasListening && (
                                        <td className="border border-gray-200 px-2 py-2 text-center text-xs">
                                          {result && result.listening.total > 0 ? (
                                            <span className="text-gray-700">{result.listening.obtained}</span>
                                          ) : (
                                            <span className="text-gray-300">-</span>
                                          )}
                                        </td>
                                      )}
                                      {mt.hasSpeaking && (
                                        <td className="border border-gray-200 px-2 py-2 text-center text-xs font-semibold">
                                          {result && result.speaking.grade !== 'F' ? (
                                            <span className="text-gray-700">{result.speaking.grade}</span>
                                          ) : (
                                            <span className="text-gray-300">-</span>
                                          )}
                                        </td>
                                      )}
                                      {mt.hasPresentation && (
                                        <td className="border border-gray-200 px-2 py-2 text-center text-xs">
                                          {result && result.presentation.total > 0 ? (
                                            <span className="text-gray-700">{result.presentation.marks}</span>
                                          ) : (
                                            <span className="text-gray-300">-</span>
                                          )}
                                        </td>
                                      )}
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
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No data available for this report</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                    <p>Generated on {formatDate(report.generatedDate)}</p>
                    <p className="mt-0.5">Beyond the Syllabus — Cambridge English Training Center</p>
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
        // ==========================================
        // INDIVIDUAL REPORT VIEW - (This will be handled by IndividualReport component)
        // ==========================================
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700">
          <p>Individual Report view loaded from the IndividualReport component.</p>
          <p className="text-sm mt-1">The <strong>IndividualReport</strong> component handles this view with student search functionality.</p>
        </div>
      )}
    </div>
  );
};

export default BatchReport;