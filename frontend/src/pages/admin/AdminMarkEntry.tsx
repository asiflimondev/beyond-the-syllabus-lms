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
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  ChevronRight
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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading mark entry data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700">Failed to load mark entry data</h3>
        <p className="text-sm text-red-600 mt-1">{(error as any)?.message || 'Unknown error'}</p>
        <button 
          onClick={() => navigate('/admin/mock-tests')} 
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!mockTest || marksData.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-amber-700">No students found</h3>
        <p className="text-sm text-amber-600 mt-1">No students are enrolled in this mock test</p>
        <button 
          onClick={() => navigate('/admin/mock-tests')} 
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/mock-tests')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 text-gray-700 hover:text-gray-900 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Back to Mock Tests</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display mt-3">
            {mockTest.title || `Mock Test ${mockTest.testNumber}`}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-1.5">
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Test #{mockTest.testNumber}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(mockTest.testDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {totalStudents} Students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-500">
              <span className="font-medium text-emerald-600">{savedCount}</span> saved
            </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="text-sm text-gray-500">
              <span className="font-medium text-amber-600">{pendingCount}</span> pending
            </span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
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

      {/* Status Message */}
      {saveStatus.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            saveStatus.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {saveStatus.success ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium">{saveStatus.message}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                  Student
                </th>
                {hasReading && (
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                    Reading
                    <span className="block text-[10px] font-normal text-gray-400">
                      /{mockTest.reading.totalMarks}
                    </span>
                  </th>
                )}
                {hasWriting && (
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                    Writing
                    <span className="block text-[10px] font-normal text-gray-400">
                      /{mockTest.writing.totalMarks}
                    </span>
                  </th>
                )}
                {hasListening && (
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                    Listening
                    <span className="block text-[10px] font-normal text-gray-400">
                      /{mockTest.listening.totalMarks}
                    </span>
                  </th>
                )}
                {hasSpeaking && (
                  <>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[90px]">
                      Speaking Grade
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      Speaking Comment
                    </th>
                  </>
                )}
                {hasPresentation && (
                  <>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                      Presentation
                      <span className="block text-[10px] font-normal text-gray-400">
                        /{mockTest.presentation.totalMarks}
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      Presentation Comment
                    </th>
                  </>
                )}
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                  Total
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[60px]">
                  %
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[60px]">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {marksData.map((student, index) => {
                const result = student.result;
                return (
                  <tr key={student.studentId} className={`hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-gray-900">{student.fullName}</div>
                      <div className="text-xs text-gray-500 font-mono">{student.admissionId}</div>
                    </td>

                    {hasReading && (
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max={mockTest.reading.totalMarks}
                          value={result?.reading?.obtained ?? 0}
                          onChange={(e) =>
                            updateStudentMarks(student.studentId, 'reading.obtained', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white"
                        />
                      </td>
                    )}

                    {hasWriting && (
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max={mockTest.writing.totalMarks}
                          value={result?.writing?.obtained ?? 0}
                          onChange={(e) =>
                            updateStudentMarks(student.studentId, 'writing.obtained', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white"
                        />
                      </td>
                    )}

                    {hasListening && (
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max={mockTest.listening.totalMarks}
                          value={result?.listening?.obtained ?? 0}
                          onChange={(e) =>
                            updateStudentMarks(student.studentId, 'listening.obtained', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white"
                        />
                      </td>
                    )}

                    {hasSpeaking && (
                      <>
                        <td className="px-3 py-3">
                          <select
                            value={result?.speaking?.grade || 'F'}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'speaking.grade', e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white"
                          >
                            {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            placeholder="Add comment..."
                            value={result?.speaking?.comment || ''}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'speaking.comment', e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white placeholder:text-gray-400"
                          />
                        </td>
                      </>
                    )}

                    {hasPresentation && (
                      <>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min="0"
                            max={mockTest.presentation.totalMarks}
                            value={result?.presentation?.marks ?? 0}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'presentation.marks', parseFloat(e.target.value) || 0)
                            }
                            className="w-16 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            placeholder="Add comment..."
                            value={result?.presentation?.comment || ''}
                            onChange={(e) =>
                              updateStudentMarks(student.studentId, 'presentation.comment', e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white placeholder:text-gray-400"
                          />
                        </td>
                      </>
                    )}

                    <td className="px-3 py-3 text-sm font-semibold text-gray-900">
                      {result?.totalMarks ?? 0}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700">
                      {result?.percentage ? Math.round(result.percentage) : 0}%
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          result?.grade === 'A+' || result?.grade === 'A' || result?.grade === 'A-'
                            ? 'bg-emerald-100 text-emerald-800'
                            : result?.grade === 'B+' || result?.grade === 'B' || result?.grade === 'B-'
                            ? 'bg-blue-100 text-blue-800'
                            : result?.grade === 'C+' || result?.grade === 'C'
                            ? 'bg-amber-100 text-amber-800'
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

      {/* Footer Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm px-5 py-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span>Total Students: <span className="font-semibold text-gray-900">{totalStudents}</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Saved: <span className="font-semibold text-emerald-600">{savedCount}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Pending: <span className="font-semibold text-amber-600">{pendingCount}</span>
          </span>
          <span className="w-px h-5 bg-gray-200" />
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            Progress: <span className="font-semibold text-gray-900">{totalStudents > 0 ? Math.round((savedCount / totalStudents) * 100) : 0}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminMarkEntry;