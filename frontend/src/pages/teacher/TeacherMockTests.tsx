import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { teacherApi } from '@api/teacher.api';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,

  Sparkles
} from 'lucide-react';

const TeacherMockTests: React.FC = () => {
  const navigate = useNavigate();

  const programsQuery: any = useQuery({
    queryKey: ['teacher-programs'],
    queryFn: () => teacherApi.getPrograms(),
  });

  const mockTestsQuery: any = useQuery({
    queryKey: ['teacher-all-mocktests'],
    queryFn: async () => {
      const programsRes = await teacherApi.getPrograms();
      const programsData = programsRes?.data?.data || [];
      let allMockTests: any[] = [];
      for (const program of programsData) {
        const mockTestsRes = await teacherApi.getMockTestsByProgram(program._id);
        const mockTests = mockTestsRes?.data?.data || [];
        allMockTests = [...allMockTests, ...mockTests.map((m: any) => ({
          ...m,
          programName: program.displayName?.en || program.name,
        }))];
      }
      return { data: { data: allMockTests } };
    },
  });

  const mockTests = mockTestsQuery?.data?.data?.data || [];

  if (mockTestsQuery.isLoading || programsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading mock tests...</span>
      </div>
    );
  }

  const totalTests = mockTests.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">Mock Tests</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Mock Tests</h2>
          <p className="text-sm text-gray-500 mt-1">View all mock tests and enter marks</p>
        </div>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <FileText className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">{totalTests} Tests</span>
        </div>
      </div>

      {mockTests.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-16 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No mock tests available</h3>
          <p className="text-sm text-gray-400 mt-1">Mock tests are created by Admin</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockTests.map((test: any) => {
            const sections = [];
            if (test.reading) sections.push('Reading');
            if (test.writing) sections.push('Writing');
            if (test.listening) sections.push('Listening');
            if (test.speaking) sections.push('Speaking');
            if (test.presentation) sections.push('Presentation');

            return (
              <div
                key={test._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/teacher/mark-entry/${test._id}`)}
              >
                {/* Program Badge */}
                <div className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary-600">
                    <BookOpen className="w-3.5 h-3.5" />
                    {test.programName}
                  </span>
                  <span className="text-xs text-gray-400">Test #{test.testNumber}</span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 font-display">
                        {test.title || `Mock Test ${test.testNumber}`}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                        <FileText className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{new Date(test.testDate).toLocaleDateString()}</span>
                    </div>
                    {sections.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1">
                        <Clock className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {sections.map((section, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enter Marks Button */}
                  <button
                    className="group/btn mt-4 w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/teacher/mark-entry/${test._id}`);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Enter Marks
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherMockTests;