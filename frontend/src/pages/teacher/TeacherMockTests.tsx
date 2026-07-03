import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@api/teacher.api';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Calendar,
  Clock,
  X,
  Save
} from 'lucide-react';

const TeacherMockTests: React.FC = () => {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program');
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);

  const mockTestsQuery: any = useQuery({
    queryKey: ['teacher-mocktests', programId],
    queryFn: async () => {
      if (!programId) {
        return { data: { data: [] } };
      }
      return await teacherApi.getMockTestsByProgram(programId);
    },
    enabled: Boolean(programId),
  });

  const mockTests = mockTestsQuery?.data?.data?.data || [];

  const createMutation: any = useMutation({
    mutationFn: (data: any) => teacherApi.createMockTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-mocktests'] });
      toast.success('Mock test created successfully');
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create mock test');
    },
  });

  const updateMutation: any = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      teacherApi.updateMockTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-mocktests'] });
      toast.success('Mock test updated successfully');
      setIsFormOpen(false);
      setEditingTest(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update mock test');
    },
  });

  if (!programId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a program to view mock tests</p>
          <p className="text-sm text-gray-400">Go to My Programs and select a program</p>
        </div>
      </div>
    );
  }

  if (mockTestsQuery.isLoading) {
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
          <p className="text-sm text-gray-500">Create and manage mock tests for your program</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Mock Test</span>
        </button>
      </div>

      {mockTests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No mock tests created yet</p>
          <p className="text-sm text-gray-400">Create your first mock test for this program</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTests.map((test: any) => (
            <div key={test._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {test.title || `Mock Test ${test.testNumber}`}
                  </h3>
                  <p className="text-sm text-gray-500">Test #{test.testNumber}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTest(test);
                      setIsFormOpen(true);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                  <span>{new Date(test.testDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary-600" />
                  <span>
                    Reading: {test.reading?.totalMarks || 0} marks, 
                    Writing: {test.writing?.totalMarks || 0} marks
                  </span>
                </div>
              </div>

              <button
                className="mt-4 w-full px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Enter Marks</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Mock Test Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFormOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTest ? 'Edit Mock Test' : 'Create Mock Test'}
                </h3>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingTest(null);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 text-center py-8">
                  Mock test form will be implemented here.
                  <br />
                  This will include Reading, Writing, Listening, Speaking, and Presentation sections.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingTest(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editingTest) {
                        updateMutation.mutate({ id: editingTest._id, data: {} });
                      } else {
                        createMutation.mutate({ programId, title: 'New Test', testDate: new Date() });
                      }
                    }}
                    className="btn-primary flex items-center space-x-2"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingTest ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMockTests;