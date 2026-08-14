import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@api/student.api';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Clock, Eye, Calendar, ChevronRight, GraduationCap } from 'lucide-react';

const MockTestsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: mockTestsData, isLoading } = useQuery({
    queryKey: ['student-mock-tests'],
    queryFn: () => studentApi.getMockTests(),
  });

  const data = mockTestsData?.data?.data;
  
  // Extract data from new response structure
  const programsWithResults = data?.programs || [];
  const pendingTests = data?.pendingTests || [];
  const currentProgram = data?.currentProgram;

  // Flatten all results from all programs into a single array for the grid view
  const allTests: any[] = [];
  
  // Add completed tests from all programs
  programsWithResults.forEach((program: any) => {
    program.results.forEach((result: any) => {
      allTests.push({
        _id: result.mockTestId,
        title: result.title,
        testNumber: result.testNumber,
        testDate: result.testDate,
        hasResult: true,
        result: {
          totalMarks: result.totalMarks,
          percentage: result.percentage,
          grade: result.grade,
        },
        programName: program.programName,
        programId: program.programId,
      });
    });
  });

  // Add pending tests (only from current program)
  pendingTests.forEach((test: any) => {
    allTests.push({
      _id: test._id,
      title: test.title,
      testNumber: test.testNumber,
      testDate: test.testDate,
      hasResult: false,
      result: null,
      programName: currentProgram?.displayName?.en || 'Current Program',
      programId: currentProgram?._id,
    });
  });

  // Sort by test date (newest first)
  const sortedTests = allTests.sort((a, b) => 
    new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
  );

  // Format percentage to 2 decimal places
  const formatPercentage = (value: number): string => {
    return value.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading mock tests...</span>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Mock Tests</h2>
          <p className="text-sm text-gray-500 mt-1">View all your mock tests and results</p>
        </div>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <FileText className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">{sortedTests.length} Tests</span>
        </div>
      </div>

      {sortedTests.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-16 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No mock tests available</h3>
          <p className="text-sm text-gray-400 mt-1">Check back later for new tests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedTests.map((test: any) => (
            <div
              key={test._id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/student/mock-tests/${test._id}`)}
            >
              {/* Status Bar */}
              <div className={`px-5 py-2.5 flex items-center justify-between border-b border-gray-100 ${
                test.hasResult ? 'bg-emerald-50/50' : 'bg-amber-50/50'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Test #{test.testNumber}
                  </span>
                  {test.programName && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {test.programName}
                    </span>
                  )}
                </div>
                {test.hasResult ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                    Pending
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  {test.title || `Mock Test ${test.testNumber}`}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(test.testDate).toLocaleDateString()}</span>
                </div>

                {test.result ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Marks</p>
                        <p className="text-base font-bold text-gray-900">{test.result.totalMarks || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Percentage</p>
                        <p className="text-base font-bold text-primary-600">{formatPercentage(test.result.percentage || 0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Grade</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getGradeColor(test.result.grade)}`}>
                          {test.result.grade || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Awaiting results</span>
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button 
                    className="group/btn w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockTestsPage;