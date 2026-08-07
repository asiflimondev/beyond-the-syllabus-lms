import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@api/report.api';
import { studentManagementApi } from '@api/admin/student.api';
import { toast } from 'react-hot-toast';
import { Printer, Download, Search, UserCircle, AlertCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import btsLogo from '/bts-logo-t.png';
import cambridgeLogo from '/cambridge-logo.png';
import msign from '/msign.png';

const IndividualReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch individual report
  const { data: reportData, isLoading: reportLoading, refetch, isError } = useQuery({
    queryKey: ['individual-report', selectedStudentId],
    queryFn: () => reportApi.getIndividualReport(selectedStudentId),
    enabled: !!selectedStudentId,
  });

  const report = reportData?.data?.data;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page {
        size: portrait;
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
        .teacher-field {
          display: none !important;
        }
        .email-field {
          display: none !important;
        }
      }
    `,
  });

  // Search for students
  const handleSearch = async () => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      toast.error('Please enter at least 2 characters');
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const response = await studentManagementApi.getAll({
        search: searchTerm.trim(),
        limit: 20,
      });

      const students = response?.data?.data?.students || [];
      setSearchResults(students);

      if (students.length === 0) {
        toast.error('No students found matching your search');
        setShowResults(false);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Failed to search for students');
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Select a student from results
  const handleSelectStudent = (student: any) => {
    setSelectedStudentId(student.id);
    setSearchTerm(student.fullName + ' (' + student.admissionId + ')');
    setShowResults(false);
    setSearchResults([]);
    setTimeout(() => refetch(), 100);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-emerald-100 text-emerald-800',
      'A': 'bg-emerald-100 text-emerald-800',
      'A-': 'bg-emerald-100 text-emerald-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-amber-100 text-amber-800',
      'C': 'bg-amber-100 text-amber-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800',
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    if (selectedStudentId) {
      refetch();
    }
  }, [selectedStudentId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Individual Student Report</h2>
          <p className="text-sm text-gray-500 mt-1">Generate a detailed report for a single student</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative" ref={searchRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Search Student <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Admission ID or Student Name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!e.target.value) {
                    setShowResults(false);
                    setSearchResults([]);
                    setSelectedStudentId('');
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                      {student.fullName?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.fullName}</p>
                      <p className="text-xs text-gray-500">
                        {student.admissionId}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1.5">
              Enter Admission ID (e.g., BTS101) or student name
            </p>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>

            {selectedStudentId && (
              <button
                onClick={() => {
                  setSelectedStudentId('');
                  setSearchTerm('');
                  setSearchResults([]);
                  setShowResults(false);
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Selected Student Indicator */}
        {selectedStudentId && report && (
          <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
              {report.student.fullName?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{report.student.fullName}</p>
              <p className="text-xs text-gray-500">{report.student.admissionId}</p>
            </div>
            <span className="ml-auto text-xs text-emerald-600 font-medium">✓ Selected</span>
          </div>
        )}
      </div>

      {/* Report Content */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Failed to generate report. Please check the student and try again.</span>
        </div>
      )}

      {reportLoading && selectedStudentId && (
        <div className="flex items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading report...</span>
        </div>
      )}

      {report && (
        <>
          {/* Action Buttons */}
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

          {/* Report Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print-container">
            <div ref={printRef} id="report-print-area" className="p-8 print:p-6">
              {/* Report Header - With Logos - Left logo bigger */}
              <div className="flex items-center justify-between mb-6">
                <img src={btsLogo} alt="Beyond the Syllabus" className="h-20 w-auto object-contain" />
                <img src={cambridgeLogo} alt="Cambridge English" className="h-14 w-auto object-contain" />
              </div>

              <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
                <h1 className="text-3xl font-bold font-display tracking-tight">
                  <span className="text-[#f1592a]">Beyond</span>
                  <span className="text-[#0a0f2a]"> the</span>
                  <span className="text-[#0a0f2a]"> Syllabus</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Cambridge English Preparation Center</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600"></div>
                  <h2 className="text-xl font-bold text-gray-800">Student Progress Report</h2>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-orange-500"></div>
                </div>
                <p className="text-gray-600 text-sm mt-1">Individual Student Report</p>
              </div>

              {/* Student Info - No Teacher, No Email */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Student Name</p>
                  <p className="font-semibold text-gray-900">{report.student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Admission ID</p>
                  <p className="font-mono font-semibold text-gray-900">{report.student.admissionId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Program</p>
                  <p className="font-semibold text-gray-900">{report.student.programName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-900">{report.student.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Tests</p>
                  <p className="font-bold text-gray-900">{report.totalTests}</p>
                </div>
              </div>

              {/* Results Table */}
              {report.results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                        <th className="border border-gray-200 px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Test
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          R / {report.results[0]?.reading.total || 0}
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          W / {report.results[0]?.writing.total || 0}
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          L / {report.results[0]?.listening.total || 0}
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          S
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          P / {report.results[0]?.presentation.total || 0}
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          Total
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          %
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.results.map((result, idx) => (
                        <tr key={result.mockTestId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800">
                            {result.mockTestTitle}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-xs text-gray-500">
                            {formatDate(result.testDate)}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-sm">
                            {result.reading.total > 0 ? (
                              <span className="font-medium">{result.reading.obtained}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-sm">
                            {result.writing.total > 0 ? (
                              <span className="font-medium">{result.writing.obtained}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-sm">
                            {result.listening.total > 0 ? (
                              <span className="font-medium">{result.listening.obtained}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-sm font-semibold">
                            {result.speaking.grade !== 'F' ? (
                              <span>{result.speaking.grade}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-sm">
                            {result.presentation.total > 0 ? (
                              <span className="font-medium">{result.presentation.marks}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-sm font-semibold">
                            {result.totalMarks > 0 ? (
                              <span className="text-gray-900">{result.totalMarks}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-sm font-semibold">
                            {result.percentage > 0 ? (
                              <span className="text-gray-900">{Math.round(result.percentage)}%</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center">
                            {result.grade && result.grade !== 'F' ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getGradeColor(result.grade)}`}>
                                {result.grade}
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No test results available</p>
                </div>
              )}

              {/* Summary - Smaller boxes */}
              <div className="mt-6">
                <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-3 text-center">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Tests</p>
                    <p className="text-xl font-bold text-gray-900">{report.totalTests}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl border border-emerald-200 p-3 text-center">
                    <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Completed</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {report.results.filter(r => r.percentage > 0).length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-200 p-3 text-center">
                    <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Average</p>
                    <p className="text-xl font-bold text-blue-600">{report.averagePercentage}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-xl border border-orange-200 p-3 text-center">
                    <p className="text-[10px] font-medium text-orange-600 uppercase tracking-wider">Best Grade</p>
                    <p className="text-xl font-bold text-orange-500">
                      {report.results.length > 0
                        ? [...report.results].sort((a, b) => {
                            const order = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];
                            return order.indexOf(a.grade) - order.indexOf(b.grade);
                          })[0]?.grade || '-'
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Section - Exam Coordinator empty, Academic Director with msign */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                  {/* Left - Exam Coordinator (empty for signature image) */}
                  <div className="text-center">
                    <div className="h-12 border-b-2 border-gray-400 mb-2 flex items-center justify-center">
                      {/* Empty - placeholder for signature image */}
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Exam Coordinator</p>
                  </div>

                  {/* Right - Academic Director (with msign.png) */}
                  <div className="text-center">
                    <div className="h-12 border-b-2 border-gray-400 mb-2 flex items-center justify-center">
                      <img 
                        src={msign} 
                        alt="Academic Director Signature" 
                        className="h-10 w-auto object-contain opacity-80"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Academic Director</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>Beyond the Syllabus — Cambridge English Preparation Center</p>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedStudentId && !report && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-16 text-center">
          <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Search for a student</h3>
          <p className="text-sm text-gray-500 mt-1">Enter a student ID or name and click Search</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>💡 Example: BTS101, BTS102, or student name</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualReport;