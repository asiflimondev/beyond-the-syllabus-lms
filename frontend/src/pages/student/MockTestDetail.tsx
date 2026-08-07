import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '@api/student.api';
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  AlertCircle,
  BarChart3,
  User,
  GraduationCap
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';

interface SectionResult {
  obtained: number;
  total: number;
}

interface SpeakingResult {
  grade: string;
  comment: string;
}

interface PresentationResult {
  marks: number;
  total: number;
  comment: string;
}

interface MockTestResult {
  _id: string;
  mockTestId: {
    _id: string;
    title: string;
    testNumber: number;
    testDate: string;
  };
  reading: SectionResult;
  writing: SectionResult;
  listening: SectionResult;
  speaking: SpeakingResult;
  presentation: PresentationResult;
  totalMarks: number;
  percentage: number;
  grade: string;
  createdAt: string;
  updatedAt: string;
}

const MockTestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: profileData } = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => studentApi.getProfile(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['student-mock-test-result', id],
    queryFn: () => studentApi.getResult(id!),
    enabled: !!id,
  });

  const profile = profileData?.data?.data;
  const result = data?.data?.data as MockTestResult;

  // Print setup - kept for future use
  useReactToPrint({
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
          padding: 12mm;
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
          height: 40px !important;
        }
        .logo-cambridge {
          height: 32px !important;
        }
        .print-title {
          font-size: 22px !important;
        }
        .print-label {
          font-size: 10px !important;
        }
        .print-value {
          font-size: 14px !important;
        }
        .print-section-title {
          font-size: 12px !important;
        }
        .print-section-value {
          font-size: 14px !important;
        }
        .print-comment {
          font-size: 11px !important;
        }
        .print-footer {
          font-size: 10px !important;
        }
        .print-grade {
          font-size: 28px !important;
        }
        .print-score {
          font-size: 20px !important;
        }
        .print-student-name {
          font-size: 16px !important;
        }
        .print-student-info {
          font-size: 12px !important;
        }
        .signature-section {
          margin-top: auto !important;
          padding-top: 8px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        .content-area {
          flex: 1;
        }
        .signature-line {
          height: 40px !important;
        }
        .signature-img {
          height: 35px !important;
        }
      }
    `,
  });

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
      'A+': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'A': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'A-': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'B+': 'bg-blue-100 text-blue-800 border-blue-300',
      'B': 'bg-blue-100 text-blue-800 border-blue-300',
      'B-': 'bg-blue-100 text-blue-800 border-blue-300',
      'C+': 'bg-amber-100 text-amber-800 border-amber-300',
      'C': 'bg-amber-100 text-amber-800 border-amber-300',
      'D': 'bg-orange-100 text-orange-800 border-orange-300',
      'F': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[grade] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (obtained: number, total: number) => {
    if (total === 0) return <span className="text-gray-400">—</span>;
    const percentage = (obtained / total) * 100;
    if (percentage >= 60) {
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getSectionPercentage = (obtained: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((obtained / total) * 100);
  };

  // Format percentage to 2 decimal places
  const formatPercentage = (value: number): string => {
    return value.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading result...</span>
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-700">Failed to load result</h3>
        <p className="text-red-600 mt-1">The result for this mock test could not be found.</p>
        <button
          onClick={() => navigate('/student/mock-tests')}
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
        >
          Back to Mock Tests
        </button>
      </div>
    );
  }

  const hasReading = result.reading?.total > 0;
  const hasWriting = result.writing?.total > 0;
  const hasListening = result.listening?.total > 0;
  const hasSpeaking = result.speaking?.grade && result.speaking.grade !== 'F';
  const hasPresentation = result.presentation?.total > 0;

  const mockTest = result.mockTestId;
  const studentName = profile?.fullName || 'Student';
  const studentAdmissionId = profile?.admissionId || 'N/A';
  const studentPhone = profile?.phone || 'N/A';
  const programName = profile?.programId?.displayName?.en || 'N/A';

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/student/mock-tests')}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 text-gray-700 hover:text-gray-900 group no-print"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Back to Mock Tests</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display mt-3">Mock Test Result</h2>
          <p className="text-sm text-gray-500 mt-1">
            {mockTest?.title || `Mock Test`} • {formatDate(mockTest?.testDate)}
          </p>
        </div>
        {/* Print and Download buttons - Hidden */}
        <div className="hidden">
          <button
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div ref={printRef} id="report-print-area" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print:p-6">
        {/* Print Header with Logos */}
        <div className="hidden print:block mb-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <img src={btsLogo} alt="Beyond the Syllabus" className="h-12 w-auto object-contain logo-bts" />
              <div>
                <p className="text-xl font-bold text-gray-900">Beyond the Syllabus</p>
                <p className="text-xs text-gray-500">Cambridge English Preparation Center</p>
              </div>
            </div>
            <img src={cambridgeLogo} alt="Cambridge English" className="h-10 w-auto object-contain logo-cambridge" />
          </div>
        </div>

        {/* Student Information */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500" />
            Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</p>
              <p className="font-semibold text-gray-900 text-base print:text-sm print-student-name">{studentName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admission ID</p>
              <p className="font-mono font-semibold text-gray-900 print:text-sm print-student-info">{studentAdmissionId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
              <p className="font-semibold text-gray-900 print:text-sm print-student-info">{studentPhone}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Program</p>
              <p className="font-semibold text-gray-900 print:text-sm print-student-info">{programName}</p>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl ${getGradeColor(result.grade)} flex items-center justify-center border-2 print:w-16 print:h-16`}>
                <span className="text-3xl font-extrabold print:text-2xl print-grade">{result.grade}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 print:text-xl print-score">{formatPercentage(result.percentage)}%</span>
                  <span className="text-sm text-gray-400">overall</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">
                    {formatDate(result.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(mockTest?.testDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>Test</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span>{programName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section-wise Marks */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-500" />
            Performance Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reading */}
            {hasReading && (
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Reading</h4>
                  </div>
                  {getStatusIcon(result.reading.obtained, result.reading.total)}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{result.reading.obtained}</p>
                    <p className="text-xs text-gray-500">out of {result.reading.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {getSectionPercentage(result.reading.obtained, result.reading.total)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${getSectionPercentage(result.reading.obtained, result.reading.total)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Writing */}
            {hasWriting && (
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Writing</h4>
                  </div>
                  {getStatusIcon(result.writing.obtained, result.writing.total)}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{result.writing.obtained}</p>
                    <p className="text-xs text-gray-500">out of {result.writing.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {getSectionPercentage(result.writing.obtained, result.writing.total)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${getSectionPercentage(result.writing.obtained, result.writing.total)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Listening */}
            {hasListening && (
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-semibold text-gray-900">Listening</h4>
                  </div>
                  {getStatusIcon(result.listening.obtained, result.listening.total)}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{result.listening.obtained}</p>
                    <p className="text-xs text-gray-500">out of {result.listening.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {getSectionPercentage(result.listening.obtained, result.listening.total)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${getSectionPercentage(result.listening.obtained, result.listening.total)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Speaking */}
            {hasSpeaking && (
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <h4 className="font-semibold text-gray-900">Speaking</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getGradeColor(result.speaking.grade)}`}>
                    {result.speaking.grade}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Grade:</span> {result.speaking.grade}
                  </p>
                  {result.speaking.comment && (
                    <div className="mt-3 p-3 bg-amber-50/50 rounded-lg border border-amber-200/50">
                      <p className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Teacher's Feedback
                      </p>
                      <p className="text-sm text-gray-700 mt-1 print:text-sm print-comment">
                        {result.speaking.comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Presentation */}
            {hasPresentation && (
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Presentation</h4>
                  </div>
                  {getStatusIcon(result.presentation.marks, result.presentation.total)}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{result.presentation.marks}</p>
                    <p className="text-xs text-gray-500">out of {result.presentation.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {getSectionPercentage(result.presentation.marks, result.presentation.total)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-orange-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${getSectionPercentage(result.presentation.marks, result.presentation.total)}%` }}
                  />
                </div>
                {result.presentation.comment && (
                  <div className="mt-2 p-2 bg-orange-50/50 rounded-lg border border-orange-200/50">
                    <p className="text-xs text-orange-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      Feedback
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5 print:text-sm print-comment">
                      {result.presentation.comment}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</p>
                <p className="text-2xl font-bold text-gray-900">{result.totalMarks}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</p>
                <p className="text-2xl font-bold text-primary-600">{formatPercentage(result.percentage)}%</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</p>
                <p className={`text-2xl font-bold ${result.grade === 'F' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {result.grade}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[hasReading, hasWriting, hasListening, hasSpeaking, hasPresentation].filter(Boolean).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section - For Print */}
        <div className="hidden print:block mt-6 pt-4 border-t border-gray-200 signature-section">
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="h-12 border-b-2 border-gray-400 mb-2 flex items-center justify-center signature-line">
                {/* Empty - for Exam Coordinator signature */}
              </div>
              <p className="text-sm font-semibold text-gray-700">Exam Coordinator</p>
            </div>
            <div className="text-center">
              <div className="h-12 border-b-2 border-gray-400 mb-2 flex items-center justify-center signature-line">
                <span className="text-sm text-gray-400 italic">(Signature)</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Academic Director</p>
            </div>
          </div>
        </div>

        {/* Footer - For Print */}
        <div className="hidden print:block mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 print-footer">Beyond the Syllabus — Cambridge English Preparation Center</p>
        </div>
      </div>
    </div>
  );
};

export default MockTestDetail;