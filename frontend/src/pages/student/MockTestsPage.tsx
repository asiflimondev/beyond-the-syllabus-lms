import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@api/student.api';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Clock, Eye } from 'lucide-react';

const MockTestsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: mockTestsData, isLoading } = useQuery({
    queryKey: ['student-mock-tests'],
    queryFn: () => studentApi.getMockTests(),
  });

  const mockTests = mockTestsData?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading mock tests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mock Tests</h2>
        <p className="text-sm text-gray-500">View all your mock tests and results</p>
      </div>

      {mockTests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No mock tests available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTests.map((test: any) => (
            <div
              key={test._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/student/mock-tests/${test._id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Test #{test.testNumber}
                </span>
                {test.hasResult ? (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-600 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {test.title || `Mock Test ${test.testNumber}`}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(test.testDate).toLocaleDateString()}
              </p>

              {test.result && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {test.result.totalMarks || 0} marks
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">Percentage</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {test.result.percentage || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">Grade</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {test.result.grade || 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-end">
                <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockTestsPage;