import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMockTestApi } from '@api/admin/mockTest.api';
import { toast } from 'react-hot-toast';
import {
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const AdminMarkEntry: React.FC = () => {
  const { mockTestId } = useParams<{ mockTestId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [marksData, setMarksData] = useState<any[]>([]);
  const [mockTest, setMockTest] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string }>({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-mark-entry', mockTestId],
    queryFn: async () => {
      if (!mockTestId) return Promise.reject('No mock test ID');
      return await adminMockTestApi.getMarkEntryData(mockTestId);
    },
    enabled: Boolean(mockTestId),
  });

  useEffect(() => {
    if (data?.data?.data) {
      setMockTest(data.data.data.mockTest);
      setMarksData(data.data.data.students || []);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (marks: any[]) => {
      if (!mockTestId) return Promise.reject('No mock test ID');
      return adminMockTestApi.saveMarks(mockTestId, { marks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-mark-entry', mockTestId] });
      toast.success('Marks saved successfully!');
      setSaveStatus({ success: true, message: 'All marks saved successfully!' });
      setTimeout(() => setSaveStatus({}), 5000);
    },
    onError: (error: any) => {
      console.error('Save marks error:', error);
      toast.error(error.response?.data?.message || 'Failed to save marks');
      setSaveStatus({ success: false, message: error.response?.data?.message || 'Failed to save marks' });
      setTimeout(() => setSaveStatus({}), 5000);
    },
  });

  const updateStudentMarks = (studentId: string, field: string, value: any) => {
    setMarksData((prev) =>
      prev.map((student) => {
        if (student.studentId !== studentId) return student;

        const updatedResult = student.result
          ? { ...student.result }
          : {
              reading: { obtained: 0, total: mockTest?.reading?.totalMarks || 0 },
              writing: { obtained: 0, total: mockTest?.writing?.totalMarks || 0 },
              listening: { obtained: 0, total: mockTest?.listening?.totalMarks || 0 },
              speaking: { grade: 'F', comment: '' },
              presentation: { marks: 0, total: mockTest?.presentation?.totalMarks || 0, comment: '' },
              totalMarks: 0,
              percentage: 0,
              grade: 'F',
            };

        const fieldParts = field.split('.');
        if (fieldParts.length === 2) {
          const [section, subField] = fieldParts;
          if (section === 'reading' || section === 'writing' || section === 'listening') {
            updatedResult[section] = {
              ...updatedResult[section],
              [subField]: value,
            };
          } else if (section === 'speaking') {
            updatedResult.speaking = {
              ...updatedResult.speaking,
              [subField]: value,
            };
          } else if (section === 'presentation') {
            updatedResult.presentation = {
              ...updatedResult.presentation,
              [subField]: value,
            };
          }
        }

        let totalMarks = 0;
        let totalPossible = 0;

        if (mockTest?.reading) {
          totalMarks += updatedResult.reading?.obtained || 0;
          totalPossible += mockTest.reading.totalMarks || 0;
        }
        if (mockTest?.writing) {
          totalMarks += updatedResult.writing?.obtained || 0;
          totalPossible += mockTest.writing.totalMarks || 0;
        }
        if (mockTest?.listening) {
          totalMarks += updatedResult.listening?.obtained || 0;
          totalPossible += mockTest.listening.totalMarks || 0;
        }
        if (mockTest?.presentation) {
          totalMarks += updatedResult.presentation?.marks || 0;
          totalPossible += mockTest.presentation.totalMarks || 0;
        }

        const percentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;

        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'A-';
        else if (percentage >= 60) grade = 'B+';
        else if (percentage >= 50) grade = 'B';
        else if (percentage >= 40) grade = 'B-';
        else if (percentage >= 33) grade = 'C+';
        else if (percentage >= 25) grade = 'C';
        else if (percentage >= 10) grade = 'D';

        updatedResult.totalMarks = totalMarks;
        updatedResult.percentage = percentage;
        updatedResult.grade = grade;

        return {
          ...student,
          result: updatedResult,
        };
      })
    );
  };

  const handleSaveAll = () => {
    const marksToSave = marksData.map((student) => {
      const result = student.result || {};
      
      const markObj: any = {
        studentId: student.studentId,
      };

      markObj.reading = { obtained: result.reading?.obtained || 0, total: mockTest?.reading?.totalMarks || 0 };
      markObj.writing = { obtained: result.writing?.obtained || 0, total: mockTest?.writing?.totalMarks || 0 };
      markObj.listening = { obtained: result.listening?.obtained || 0, total: mockTest?.listening?.totalMarks || 0 };
      markObj.speaking = { grade: result.speaking?.grade || 'F', comment: result.speaking?.comment || '' };
      markObj.presentation = { 
        marks: result.presentation?.marks || 0, 
        total: mockTest?.presentation?.totalMarks || 0, 
        comment: result.presentation?.comment || '' 
      };

      return markObj;
    });

    saveMutation.mutate(marksToSave);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading mark entry data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700">Failed to load mark entry data</p>
        <p className="text-sm text-red-600">{(error as any)?.message || 'Unknown error'}</p>
        <button onClick={() => navigate('/admin/mock-tests')} className="mt-4 btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  if (!mockTest || marksData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">No students found for this mock test</p>
        <button onClick={() => navigate('/admin/mock-tests')} className="mt-4 btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  const totalStudents = marksData.length;
  const savedCount = marksData.filter((s) => s.result?._id).length;
  const pendingCount = totalStudents - savedCount;

  const hasReading = !!mockTest.reading;
  const hasWriting = !!mockTest.writing;
  const hasListening = !!mockTest.listening;
  const hasSpeaking = !!mockTest.speaking;
  const hasPresentation = !!mockTest.presentation;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/mock-tests')}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Mock Tests
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {mockTest.title || `Mock Test ${mockTest.testNumber}`}
          </h2>
          <p className="text-sm text-gray-500">
            Test #{mockTest.testNumber} • {new Date(mockTest.testDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{savedCount}</span> saved,
            <span className="font-medium ml-1 text-orange-600">{pendingCount}</span> pending
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saveMutation.isPending}
            className="btn-primary flex items-center space-x-2"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveStatus.message && (
        <div
          className={`p-3 rounded-lg flex items-center space-x-2 ${
            saveStatus.success
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {saveStatus.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Student
                </th>
                {hasReading && (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Reading
                    <span className="block text-[10px] font-normal text-gray-400">
                      /{mockTest.reading.totalMarks}
                    </span>
                  </th>
                )}
                {hasWriting && (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Writing
                    <span className="block text-[10px] font-normal text-gray-400">
                      /{mockTest.writing.totalMarks}
                    </span>
                  </th>
                )}
                {hasListening && (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Listening
                    <span className="block text-[10px] font-normal text-gray-400">
                      /{mockTest.listening.totalMarks}
                    </span>
                  </th>
                )}
                {hasSpeaking && (
                  <>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px]">
                      Speaking Grade
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Speaking Comment
                    </th>
                  </>
                )}
                {hasPresentation && (
                  <>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Presentation
                      <span className="block text-[10px] font-normal text-gray-400">
                        /{mockTest.presentation.totalMarks}
                      </span>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Presentation Comment
                    </th>
                  </>
                )}
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Total
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                  %
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {marksData.map((student) => {
                const result = student.result;
                return (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="font-medium text-sm text-gray-900">{student.fullName}</div>
                      <div className="text-xs text-gray-500">{student.admissionId}</div>
                    </td>

                    {hasReading && (
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          max={mockTest.reading.totalMarks}
                          value={result?.reading?.obtained ?? 0}
                          onChange={(e) =>
                            updateStudentMarks(student.studentId, 'reading.obtained', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </td>
                    )}

                    {hasWriting && (
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          max={mockTest.writing.totalMarks}
                          value={result?.writing?.obtained ?? 0}
                          onChange={(e) =>
                            updateStudentMarks(student.studentId, 'writing.obtained', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </td>
                    )}

                    {hasListening && (
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          max={mockTest.listening.totalMarks}
                          value={result?.listening?.obtained ?? 0}
                          onChange={(e) =>
                            updateStudentMarks(student.studentId, 'listening.obtained', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </td>
                    )}

                    {hasSpeaking && (
                      <>
                        <td className="px-3 py-2">
                          <select
                            value={result?.speaking?.grade || 'F'}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'speaking.grade', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          >
                            {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="Comment..."
                            value={result?.speaking?.comment || ''}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'speaking.comment', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </td>
                      </>
                    )}

                    {hasPresentation && (
                      <>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            max={mockTest.presentation.totalMarks}
                            value={result?.presentation?.marks ?? 0}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'presentation.marks', parseFloat(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="Comment..."
                            value={result?.presentation?.comment || ''}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'presentation.comment', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </td>
                      </>
                    )}

                    <td className="px-3 py-2 text-sm font-medium text-gray-900">
                      {result?.totalMarks ?? 0}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">
                      {result?.percentage ? Math.round(result.percentage) : 0}%
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          result?.grade === 'A+' || result?.grade === 'A' || result?.grade === 'A-'
                            ? 'bg-green-100 text-green-800'
                            : result?.grade === 'B+' || result?.grade === 'B' || result?.grade === 'B-'
                            ? 'bg-blue-100 text-blue-800'
                            : result?.grade === 'C+' || result?.grade === 'C'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result?.grade || 'F'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Total Students: <span className="font-medium text-gray-900">{totalStudents}</span>
        </div>
        <div>
          Saved: <span className="font-medium text-green-600">{savedCount}</span> •
          Pending: <span className="font-medium text-orange-600">{pendingCount}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminMarkEntry;