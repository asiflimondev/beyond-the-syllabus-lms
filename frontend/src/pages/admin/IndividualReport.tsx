import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@api/report.api';
import { studentManagementApi } from '@api/admin/student.api';
import { programsApi } from '@api/programs.api';
import { toast } from 'react-hot-toast';
import { 
  Printer, 
  Download, 
  Search,
  AlertCircle, 
  GraduationCap, 
  Users,
  SortAsc,
  SortDesc,
  Filter,
  ChevronDown,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';
import msign from '/msign.png';

// Types
interface StudentWithProgram {
  id: string;
  fullName: string;
  admissionId: string;
  phone: string;
  email: string;
  status: string;
  programName: string;
  programId: string;
}

const IndividualReport: React.FC = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<StudentWithProgram[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('current');
  
  const printRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: reportData, isLoading: reportLoading, refetch, isError } = useQuery({
    queryKey: ['individual-report', selectedStudentId],
    queryFn: () => reportApi.getIndividualReport(selectedStudentId),
    enabled: !!selectedStudentId,
  });

  const report = reportData?.data?.data;

  // Fetch all students with their programs
  useEffect(() => {
    const fetchAllStudents = async () => {
      setIsLoadingStudents(true);
      try {
        // Fetch all active programs
        const programsRes = await programsApi.getAll({ isActive: true, limit: 100 });
        const programs = programsRes?.data?.data?.programs || [];
        
        // Create a map of program names
        const programMap = new Map();
        programs.forEach((p: any) => {
          programMap.set(p.id, p.displayName?.en || p.name);
        });
        setAvailablePrograms(programs);

        // Fetch all students (not deleted)
        const studentsRes = await studentManagementApi.getAll({
          limit: 1000,
          isDeleted: 'false'
        });
        
        const students = studentsRes?.data?.data?.students || [];
        
        // Format students with program names
        const formattedStudents = students.map((s: any) => {
          let programName = 'No Program';
          let programId = '';
          
          // Check if program is an object
          if (s.program) {
            if (typeof s.program === 'object') {
              programName = s.program.displayName?.en || s.program.name || 'No Program';
              programId = s.program.id || s.program._id || '';
            }
          }
          // If program is just an ID, try to find it in the map
          else if (s.programId) {
            const foundProgram = programs.find((p: any) => p.id === s.programId || p._id === s.programId);
            if (foundProgram) {
              programName = foundProgram.displayName?.en || foundProgram.name || 'No Program';
              programId = foundProgram.id || foundProgram._id || '';
            }
          }
          
          return {
            id: s.id || s._id,
            fullName: s.fullName,
            admissionId: s.admissionId,
            phone: s.phone || '',
            email: s.email || '',
            status: s.status || 'unknown',
            programId: programId,
            programName: programName,
          };
        });

        setAllStudents(formattedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students');
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchAllStudents();
  }, []);

  // Extract unique programs from report results and set default to current
  useEffect(() => {
    if (report && report.results) {
      // Get unique program IDs from results
      const programMap = new Map();
      report.results.forEach((result: any) => {
        if (result.programId && result.programId !== 'unknown') {
          const programId = result.programId;
          if (!programMap.has(programId)) {
            programMap.set(programId, {
              id: programId,
              name: result.programName || 'Unknown Program',
              testCount: 0,
            });
          }
          const program = programMap.get(programId);
          program.testCount++;
        }
      });
      
      const programs = Array.from(programMap.values());
      setAvailablePrograms(programs);
      
      // Set default to current program if exists
      if (report.student?.currentProgramId) {
        const hasCurrent = programs.some((p: any) => p.id === report.student.currentProgramId);
        if (hasCurrent) {
          setSelectedProgramId(report.student.currentProgramId);
        } else if (programs.length > 0) {
          setSelectedProgramId(programs[0].id);
        } else {
          setSelectedProgramId('current');
        }
      } else if (programs.length > 0) {
        setSelectedProgramId(programs[0].id);
      } else {
        setSelectedProgramId('current');
      }
    }
  }, [report]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProgramDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          height: 100vh;
          padding: 12mm;
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
        .teacher-field {
          display: none !important;
        }
        .email-field {
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
        .receipt-section-title {
          font-size: 13px !important;
        }
        table {
          font-size: 12px !important;
        }
        th, td {
          padding: 6px 10px !important;
        }
        .summary-box p {
          font-size: 20px !important;
        }
        .summary-box .label {
          font-size: 10px !important;
        }
        .signature-label {
          font-size: 13px !important;
        }
        .footer-text {
          font-size: 11px !important;
        }
        .signature-line {
          height: 55px !important;
        }
        .signature-img {
          height: 45px !important;
        }
        .content-area {
          flex: 1;
        }
        .signature-section {
          margin-top: auto !important;
          padding-top: 10px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        .report-header {
          margin-bottom: 6px !important;
          padding-bottom: 6px !important;
        }
        .student-info-grid {
          padding: 12px 16px !important;
          margin-bottom: 10px !important;
          gap: 6px !important;
        }
        .summary-grid {
          gap: 4px !important;
          margin-bottom: 8px !important;
        }
        .footer-address {
          font-size: 10px !important;
        }
        .program-filter-section {
          display: none !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudentId(student.id);
    setSearchTerm(student.fullName + ' (' + student.admissionId + ')');
    setShowResults(false);
    setSearchResults([]);
    setSelectedProgramId('current');
    setAvailablePrograms([]);
    setTimeout(() => refetch(), 100);
  };

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
      month: 'long',
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

  // Get filtered results based on selected program
  const getFilteredResults = () => {
    if (!report || !report.results) return [];
    
    if (selectedProgramId === 'current') {
      return report.results.filter((result: any) => result.programId === report.student?.currentProgramId);
    }
    
    return report.results.filter((result: any) => result.programId === selectedProgramId);
  };

  // Get filtered stats
  const getFilteredStats = () => {
    const filteredResults = getFilteredResults();
    
    if (filteredResults.length === 0) {
      return {
        totalTests: 0,
        completedTests: 0,
        averagePercentage: 0,
        bestGrade: '-',
      };
    }

    const completed = filteredResults.filter((r: any) => r.percentage > 0);
    const avg = filteredResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / filteredResults.length;
    
    const order = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];
    const best = filteredResults.length > 0
      ? [...filteredResults].sort((a, b) => order.indexOf(a.grade) - order.indexOf(b.grade))[0]?.grade || '-'
      : '-';

    return {
      totalTests: filteredResults.length,
      completedTests: completed.length,
      averagePercentage: Math.round(avg),
      bestGrade: best,
    };
  };

  useEffect(() => {
    if (selectedStudentId) {
      refetch();
    }
  }, [selectedStudentId, refetch]);

  const filteredResults = getFilteredResults();
  const stats = getFilteredStats();

  // Get program name for display
  const getProgramDisplayName = (programId: string) => {
    if (programId === 'current') {
      return report?.student?.programName || 'Current Program';
    }
    const program = availablePrograms.find((p: any) => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  // Get filtered students by program
  const getFilteredStudents = () => {
    if (selectedProgramFilter === 'all') {
      return allStudents;
    }
    return allStudents.filter((student) => student.programId === selectedProgramFilter);
  };

  // Sort students
  const getSortedStudents = () => {
    const filtered = getFilteredStudents();
    if (sortOrder === 'newest') {
      return [...filtered].sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else {
      return [...filtered].sort((a, b) => b.fullName.localeCompare(a.fullName));
    }
  };

  // Filter students by search term
  const getFilteredAndSearchedStudents = () => {
    let students = getSortedStudents();
    if (!searchTerm.trim()) return students;
    
    const term = searchTerm.toLowerCase().trim();
    return students.filter((student) => 
      student.fullName.toLowerCase().includes(term) ||
      student.admissionId.toLowerCase().includes(term)
    );
  };

  const displayedStudents = getFilteredAndSearchedStudents();

  // Get the current display text for the filter
  const getFilterDisplayText = () => {
    if (selectedProgramId === 'current') return report?.student?.programName || 'Current Program';
    const program = availablePrograms.find((p: any) => p.id === selectedProgramId);
    return program?.name || 'Unknown Program';
  };

  return (
    <div className="space-y-6">
      {/* Navigation - Back to Batch Report */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/reports"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Batch Report
        </Link>
        <div className="h-6 w-px bg-gray-200" />
        <span className="text-sm text-gray-500">
          Individual Student Report
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Individual Student Report</h2>
          <p className="text-sm text-gray-500 mt-1">Search or browse students to generate detailed reports</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative" ref={searchRef}>
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
                      <p className="text-xs text-gray-500">{student.admissionId}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
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
                  setAvailablePrograms([]);
                  setSelectedProgramId('current');
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

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

      {/* Program Filter and Sort Controls - Only when not viewing a report */}
      {!selectedStudentId && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm no-print">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4 text-orange-500" />
              <span>Filter by Program:</span>
            </div>
            
            {/* Program Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 min-w-[180px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {selectedProgramFilter === 'all' ? 'All Programs' : getProgramDisplayName(selectedProgramFilter)}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProgramDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showProgramDropdown && (
                <div className="absolute z-30 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedProgramFilter('all');
                      setShowProgramDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      selectedProgramFilter === 'all' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    All Programs
                    {selectedProgramFilter === 'all' && (
                      <span className="ml-auto text-xs text-orange-500">✓</span>
                    )}
                  </button>
                  {availablePrograms.map((program: any) => (
                    <button
                      key={program.id}
                      onClick={() => {
                        setSelectedProgramFilter(program.id);
                        setShowProgramDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-100 ${
                        selectedProgramFilter === program.id ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      {program.displayName?.en || program.name}
                      {selectedProgramFilter === program.id && (
                        <span className="ml-auto text-xs text-orange-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">
                {displayedStudents.length} students
              </span>
              <div className="h-6 w-px bg-gray-300" />
              <button
                onClick={() => setSortOrder('newest')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortOrder === 'newest' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <SortDesc className="w-3.5 h-3.5" />
                A-Z
              </button>
              <button
                onClick={() => setSortOrder('oldest')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortOrder === 'oldest' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <SortAsc className="w-3.5 h-3.5" />
                Z-A
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Filter - Only show when viewing a report */}
      {selectedStudentId && report && availablePrograms.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-2xl border border-orange-200 p-4 shadow-sm no-print">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              <span>Filter Results:</span>
            </div>
            
            {/* Enhanced Dropdown for Report Filter */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-orange-300 hover:border-orange-400 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 min-w-[200px] justify-between shadow-sm hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-orange-500" />
                  {getFilterDisplayText()}
                  {selectedProgramId !== 'current' && (
                    <span className="ml-1 text-xs text-gray-400">
                      ({availablePrograms.find((p: any) => p.id === selectedProgramId)?.testCount || 0} tests)
                    </span>
                  )}
                  {selectedProgramId === 'current' && (
                    <span className="ml-1 text-xs text-gray-400">
                      ({report.results.filter((r: any) => r.programId === report.student?.currentProgramId).length} tests)
                    </span>
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${showProgramDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showProgramDropdown && (
                <div className="absolute z-30 mt-2 w-full bg-white rounded-xl border-2 border-orange-200 shadow-xl overflow-hidden max-h-72 overflow-y-auto">
                  {/* Current Program Option - Always shown first */}
                  {report.student?.currentProgramId && (
                    <button
                      onClick={() => {
                        setSelectedProgramId('current');
                        setShowProgramDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 transition-colors flex items-center gap-3 ${
                        selectedProgramId === 'current' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${selectedProgramId === 'current' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <span className="flex items-center gap-1.5">
                        {report.student.programName}
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Current</span>
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {report.results.filter((r: any) => r.programId === report.student.currentProgramId).length} tests
                      </span>
                      {selectedProgramId === 'current' && (
                        <span className="text-xs text-orange-500 font-bold">✓</span>
                      )}
                    </button>
                  )}
                  
                  {/* Other Programs that have results */}
                  {availablePrograms
                    .filter((p: any) => p.id !== report.student?.currentProgramId && p.testCount > 0)
                    .map((program: any) => (
                      <button
                        key={program.id}
                        onClick={() => {
                          setSelectedProgramId(program.id);
                          setShowProgramDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 transition-colors flex items-center gap-3 border-t border-gray-100 ${
                          selectedProgramId === program.id ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${selectedProgramId === program.id ? 'bg-orange-500' : 'bg-gray-300'}`} />
                        <span>{program.name}</span>
                        <span className="ml-auto text-xs text-gray-400">{program.testCount} tests</span>
                        {selectedProgramId === program.id && (
                          <span className="text-xs text-orange-500 font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  
                  {/* If no other programs have results */}
                  {availablePrograms.filter((p: any) => p.id !== report.student?.currentProgramId && p.testCount > 0).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center border-t border-gray-100">
                      No other programs with results
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {selectedProgramId === 'current' && (
              <span className="text-xs text-emerald-600 ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Current Program
              </span>
            )}
            {selectedProgramId !== 'current' && (
              <span className="text-xs text-gray-500 ml-auto">
                Showing {filteredResults.length} tests
              </span>
            )}
          </div>
        </div>
      )}

      {/* Students List */}
      {!selectedStudentId && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-semibold text-gray-900">All Students</h3>
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {displayedStudents.length} students
              </span>
            </div>
          </div>

          {isLoadingStudents ? (
            <div className="flex items-center justify-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading students...</span>
            </div>
          ) : displayedStudents.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No students found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm ? 'Try adjusting your search or filter' : 'No students available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayedStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {student.fullName?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                      {student.fullName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-mono">{student.admissionId}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {student.programName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      student.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : student.status === 'pending_registration'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {student.status === 'pending_registration' ? 'Pending' : student.status || 'Unknown'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Individual Report View */}
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

      {report && selectedStudentId && (
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
            <button
              onClick={() => {
                setSelectedStudentId('');
                setSearchTerm('');
                setSelectedProgramId('current');
                setAvailablePrograms([]);
              }}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Back to Students
            </button>
            <Link
              to="/admin/reports"
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Batch Report
            </Link>
            {selectedProgramId !== 'current' && (
              <span className="px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {getProgramDisplayName(selectedProgramId)}
              </span>
            )}
            {selectedProgramId === 'current' && (
              <span className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Current Program
              </span>
            )}
            <span className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">
              {filteredResults.length} tests
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print-container">
            <div ref={printRef} id="report-print-area" className="p-8 print:p-6">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4 print:pb-4 print:mb-4">
                <div className="flex items-center gap-4">
                  <img src={btsLogo} alt="BTS Logo" className="h-20 w-auto object-contain print:h-16 logo-bts" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight print:text-2xl brand-name">Beyond the Syllabus</h1>
                    <p className="text-sm text-gray-500 print:text-xs brand-sub">Cambridge English Preparation Centre</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src={cambridgeLogo} alt="Cambridge English" className="h-16 w-auto object-contain print:h-14 logo-cambridge" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6 print:mb-4 report-header">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-wider uppercase relative inline-block print:text-3xl receipt-title">
                  Student Progress Report
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full print:h-0.5"></span>
                </h2>
                <p className="text-base text-gray-500 mt-2 print:text-sm">
                  {selectedProgramId === 'current' 
                    ? report?.student?.programName || 'Current Program'
                    : getProgramDisplayName(selectedProgramId)}
                </p>
              </div>

              <div className="content-area">
                {/* Student Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5 p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 print:p-4 print:mb-4 print:gap-4 student-info-grid">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Student Name</p>
                    <p className="font-semibold text-gray-900 text-lg print:text-base receipt-value">{report.student.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Admission ID</p>
                    <p className="font-mono font-semibold text-gray-900 text-lg print:text-base receipt-value">{report.student.admissionId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Current Program</p>
                    <p className="font-semibold text-gray-900 text-lg print:text-base receipt-value">{report.student.programName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Phone</p>
                    <p className="text-gray-900 text-lg print:text-base receipt-value">{report.student.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Total Tests</p>
                    <p className="font-bold text-gray-900 text-lg print:text-base receipt-value">{stats.totalTests}</p>
                  </div>
                  {selectedProgramId !== 'current' && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Program</p>
                      <p className="font-semibold text-primary-600 text-lg print:text-base receipt-value">{getProgramDisplayName(selectedProgramId)}</p>
                    </div>
                  )}
                  {selectedProgramId === 'current' && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider print:text-[10px] receipt-label">Program</p>
                      <p className="font-semibold text-emerald-600 text-lg print:text-base receipt-value">{report.student.programName}</p>
                    </div>
                  )}
                </div>

                {/* Results Table */}
                {filteredResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse print:text-xs">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                          <th className="border border-gray-200 px-4 py-2.5 text-left text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">Test</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">Date</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">R / {filteredResults[0]?.reading.total || 0}</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">W / {filteredResults[0]?.writing.total || 0}</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">L / {filteredResults[0]?.listening.total || 0}</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">S</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">P / {filteredResults[0]?.presentation.total || 0}</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">Total</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">%</th>
                          <th className="border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 print:px-3 print:py-2 print:text-[10px]">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.map((result: any, idx: number) => (
                          <tr key={result.mockTestId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                            <td className="border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 print:px-3 print:py-2 print:text-xs">{result.mockTestTitle}</td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-xs text-gray-500 print:px-3 print:py-2 print:text-[10px]">{formatDate(result.testDate)}</td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-sm print:px-3 print:py-2 print:text-xs">
                              {result.reading.total > 0 ? <span className="font-medium">{result.reading.obtained}</span> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-sm print:px-3 print:py-2 print:text-xs">
                              {result.writing.total > 0 ? <span className="font-medium">{result.writing.obtained}</span> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-sm print:px-3 print:py-2 print:text-xs">
                              {result.listening.total > 0 ? <span className="font-medium">{result.listening.obtained}</span> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-sm font-semibold print:px-3 print:py-2 print:text-xs">
                              {result.speaking.grade !== 'F' ? <span>{result.speaking.grade}</span> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-sm print:px-3 print:py-2 print:text-xs">
                              {result.presentation.total > 0 ? <span className="font-medium">{result.presentation.marks}</span> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-sm font-semibold print:px-3 print:py-2 print:text-xs">
                              {result.totalMarks > 0 ? <span className="text-gray-900">{result.totalMarks}</span> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center text-sm font-semibold print:px-3 print:py-2 print:text-xs">
                              {result.percentage > 0 ? <span className="text-gray-900">{Math.round(result.percentage)}%</span> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="border border-gray-200 px-3 py-2.5 text-center print:px-3 print:py-2 print:text-xs">
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
                    <p>No test results available for the selected program</p>
                  </div>
                )}

                <div className="mt-5 summary-grid">
                  <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto print:gap-3">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-4 text-center print:p-3 summary-box">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider print:text-[9px] label">Total Tests</p>
                      <p className="text-2xl font-bold text-gray-900 print:text-xl">{stats.totalTests}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl border border-emerald-200 p-4 text-center print:p-3 summary-box">
                      <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider print:text-[9px] label">Completed</p>
                      <p className="text-2xl font-bold text-emerald-600 print:text-xl">{stats.completedTests}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-200 p-4 text-center print:p-3 summary-box">
                      <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider print:text-[9px] label">Average</p>
                      <p className="text-2xl font-bold text-blue-600 print:text-xl">{stats.averagePercentage}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-xl border border-orange-200 p-4 text-center print:p-3 summary-box">
                      <p className="text-[10px] font-medium text-orange-600 uppercase tracking-wider print:text-[9px] label">Best Grade</p>
                      <p className="text-2xl font-bold text-orange-500 print:text-xl">{stats.bestGrade}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="mt-6 pt-4 border-t border-gray-200 print:mt-auto print:pt-3 signature-section">
                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto print:gap-6">
                  <div className="text-center">
                    <div className="h-14 border-b-2 border-gray-400 mb-2 flex items-center justify-center print:h-14 signature-line">
                      {/* Empty - no signature */}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 print:text-xs signature-label">Exam Coordinator</p>
                  </div>
                  <div className="text-center">
                    <div className="h-14 border-b-2 border-gray-400 mb-2 flex items-center justify-center print:h-14 signature-line">
                      <img 
                        src={msign} 
                        alt="Academic Director Signature" 
                        className="h-12 w-auto object-contain opacity-80 print:h-12 signature-img"
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
                    Beyond the Syllabus · Cambridge English Preparation Centre · Dhaka, Bangladesh
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
    </div>
  );
};

export default IndividualReport;