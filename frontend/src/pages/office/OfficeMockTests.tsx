import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { officeMockTestApi } from '@api/admin/mockTest.api';
import { programsApi } from '@api/programs.api';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';

const OfficeMockTests: React.FC = () => {
  const navigate = useNavigate();

  // Fetch ALL programs using programsApi (for Office)
  const programsQuery: any = useQuery({
    queryKey: ['office-programs'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  // Fetch mock tests using office API
  const mockTestsQuery: any = useQuery({
    queryKey: ['office-all-mocktests'],
    queryFn: async () => {
      const programsRes = await programsApi.getAll({ isActive: true, limit: 100 });
      const programsData = programsRes?.data?.data?.programs || [];
      let allMockTests: any[] = [];
      for (const program of programsData) {
        try {
          const mockTestsRes = await officeMockTestApi.getMockTestsByProgram(program.id);
          const mockTests = mockTestsRes?.data?.data || [];
          allMockTests = [...allMockTests, ...mockTests.map((m: any) => ({
            ...m,
            programName: program.displayName?.en || program.name,
          }))];
        } catch (error) {
          console.error(`Error fetching mock tests for program ${program.id}:`, error);
        }
      }
      return { data: { data: allMockTests } };
    },
  });

  const mockTests = mockTestsQuery?.data?.data?.data || [];

  if (mockTestsQuery.isLoading || programsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading mock tests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mock Tests</h2>
          <p className="text-sm text-gray-500">View all mock tests and enter marks</p>
        </div>
      </div>

      {mockTests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No mock tests available</p>
          <p className="text-sm text-gray-400">Mock tests are created by Admin</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/office/mark-entry/${test._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {test.title || `Mock Test ${test.testNumber}`}
                    </h3>
                    <p className="text-sm text-gray-500">Test #{test.testNumber}</p>
                    <p className="text-xs text-primary-600 mt-1">{test.programName}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                    <span>{new Date(test.testDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Clock className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="text-xs">{sections.join(' • ')}</span>
                  </div>
                </div>

                <button
                  className="mt-4 w-full px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm flex items-center justify-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/office/mark-entry/${test._id}`);
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Enter Marks</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OfficeMockTests;