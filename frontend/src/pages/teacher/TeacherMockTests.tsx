import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@api/teacher.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Calendar,
  Clock,
  X,
  Save,
  Loader2,
  CheckSquare,
  Square,
} from 'lucide-react';

interface SectionConfig {
  enabled: boolean;
  totalMarks: number;
  description: string;
}

interface MockTestFormData {
  title: string;
  description: string;
  testDate: string;
  reading: SectionConfig;
  writing: SectionConfig;
  listening: SectionConfig;
  speaking: { enabled: boolean; description: string };
  presentation: SectionConfig;
}

const TeacherMockTests: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [formData, setFormData] = useState<MockTestFormData>({
    title: '',
    description: '',
    testDate: new Date().toISOString().split('T')[0],
    reading: { enabled: true, totalMarks: 40, description: 'Reading comprehension' },
    writing: { enabled: true, totalMarks: 40, description: 'Writing tasks' },
    listening: { enabled: true, totalMarks: 40, description: 'Listening comprehension' },
    speaking: { enabled: true, description: 'Speaking assessment' },
    presentation: { enabled: true, totalMarks: 20, description: 'Presentation' },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programsQuery: any = useQuery({
    queryKey: ['teacher-programs'],
    queryFn: () => teacherApi.getPrograms(),
  });

  const programs = programsQuery?.data?.data?.data || [];

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

  const createMutation: any = useMutation({
    mutationFn: (data: any) => teacherApi.createMockTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-all-mocktests'] });
      toast.success('Mock test created successfully!');
      setIsFormOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create mock test error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to create mock test';
      toast.error(message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      testDate: new Date().toISOString().split('T')[0],
      reading: { enabled: true, totalMarks: 40, description: 'Reading comprehension' },
      writing: { enabled: true, totalMarks: 40, description: 'Writing tasks' },
      listening: { enabled: true, totalMarks: 40, description: 'Listening comprehension' },
      speaking: { enabled: true, description: 'Speaking assessment' },
      presentation: { enabled: true, totalMarks: 20, description: 'Presentation' },
    });
    setEditingTest(null);
    setSelectedProgramId('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const toggleSection = (section: keyof MockTestFormData) => {
    if (section === 'speaking') {
      setFormData({
        ...formData,
        speaking: { ...formData.speaking, enabled: !formData.speaking.enabled },
      });
    } else {
      const sectionKey = section as keyof Omit<MockTestFormData, 'title' | 'description' | 'testDate' | 'speaking'>;
      setFormData({
        ...formData,
        [sectionKey]: {
          ...(formData[sectionKey] as SectionConfig),
          enabled: !(formData[sectionKey] as SectionConfig).enabled,
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedProgramId) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.title) {
      toast.error('Please enter a test title');
      return;
    }
    if (!formData.testDate) {
      toast.error('Please select a test date');
      return;
    }

    const hasEnabledSection =
      formData.reading.enabled ||
      formData.writing.enabled ||
      formData.listening.enabled ||
      formData.speaking.enabled ||
      formData.presentation.enabled;

    if (!hasEnabledSection) {
      toast.error('Please enable at least one section');
      return;
    }

    setIsSubmitting(true);

    // 🔥 CRITICAL: Build submit data with ONLY enabled sections
    const submitData: any = {
      programId: selectedProgramId,
      title: formData.title,
      description: formData.description || '',
      testDate: formData.testDate,
    };

    // 🔥 ONLY add sections that are ENABLED
    // Reading
    if (formData.reading.enabled) {
      submitData.reading = {
        totalMarks: formData.reading.totalMarks || 40,
        description: formData.reading.description || 'Reading comprehension',
      };
    }

    // Writing
    if (formData.writing.enabled) {
      submitData.writing = {
        totalMarks: formData.writing.totalMarks || 40,
        description: formData.writing.description || 'Writing tasks',
      };
    }

    // Listening
    if (formData.listening.enabled) {
      submitData.listening = {
        totalMarks: formData.listening.totalMarks || 40,
        description: formData.listening.description || 'Listening comprehension',
      };
    }

    // Speaking
    if (formData.speaking.enabled) {
      submitData.speaking = {
        description: formData.speaking.description || 'Speaking assessment',
      };
    }

    // Presentation
    if (formData.presentation.enabled) {
      submitData.presentation = {
        totalMarks: formData.presentation.totalMarks || 20,
        description: formData.presentation.description || 'Presentation',
      };
    }

    console.log('📤 Submitting ONLY enabled sections:', JSON.stringify(submitData, null, 2));

    try {
      await createMutation.mutateAsync(submitData);
    } catch (error) {
      // Error already handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-sm text-gray-500">View all your mock tests and create new ones</p>
        </div>
        <button onClick={handleOpenCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Mock Test</span>
        </button>
      </div>

      {mockTests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No mock tests created yet</p>
          <p className="text-sm text-gray-400">Create your first mock test for any of your programs</p>
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
                onClick={() => navigate(`/teacher/mark-entry/${test._id}`)}
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
                    navigate(`/teacher/mark-entry/${test._id}`);
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

      {/* Create Mock Test Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setIsFormOpen(false); resetForm(); }} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create Mock Test</h3>
                <button onClick={() => { setIsFormOpen(false); resetForm(); }} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Select Program */}
                <div>
                  <label className="label">Select Program *</label>
                  <select 
                    value={selectedProgramId} 
                    onChange={(e) => setSelectedProgramId(e.target.value)} 
                    className="input-field"
                  >
                    <option value="">Select a program</option>
                    {programs.map((program: any) => (
                      <option key={program._id} value={program._id}>
                        {program.displayName?.en || program.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Basic Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Test Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., Mock Test 1"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Test description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Test Date *</label>
                      <input
                        type="date"
                        value={formData.testDate}
                        onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Sections */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Select Sections to Include</h4>
                  <p className="text-xs text-gray-500 mb-4">Toggle sections on/off. Only enabled sections will be included.</p>

                  <div className="space-y-4">
                    {/* Reading */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => toggleSection('reading')} className="text-primary-600">
                            {formData.reading.enabled ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                          <label className="font-medium text-gray-900">Reading</label>
                        </div>
                        {formData.reading.enabled && (
                          <input
                            type="number"
                            min="1"
                            value={formData.reading.totalMarks}
                            onChange={(e) => setFormData({
                              ...formData,
                              reading: { ...formData.reading, totalMarks: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                            placeholder="Marks"
                          />
                        )}
                      </div>
                      {formData.reading.enabled && (
                        <div className="mt-2 ml-10">
                          <input
                            type="text"
                            placeholder="Description"
                            value={formData.reading.description}
                            onChange={(e) => setFormData({
                              ...formData,
                              reading: { ...formData.reading, description: e.target.value }
                            })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Writing */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => toggleSection('writing')} className="text-primary-600">
                            {formData.writing.enabled ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                          <label className="font-medium text-gray-900">Writing</label>
                        </div>
                        {formData.writing.enabled && (
                          <input
                            type="number"
                            min="1"
                            value={formData.writing.totalMarks}
                            onChange={(e) => setFormData({
                              ...formData,
                              writing: { ...formData.writing, totalMarks: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                            placeholder="Marks"
                          />
                        )}
                      </div>
                      {formData.writing.enabled && (
                        <div className="mt-2 ml-10">
                          <input
                            type="text"
                            placeholder="Description"
                            value={formData.writing.description}
                            onChange={(e) => setFormData({
                              ...formData,
                              writing: { ...formData.writing, description: e.target.value }
                            })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Listening */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => toggleSection('listening')} className="text-primary-600">
                            {formData.listening.enabled ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                          <label className="font-medium text-gray-900">Listening</label>
                        </div>
                        {formData.listening.enabled && (
                          <input
                            type="number"
                            min="1"
                            value={formData.listening.totalMarks}
                            onChange={(e) => setFormData({
                              ...formData,
                              listening: { ...formData.listening, totalMarks: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                            placeholder="Marks"
                          />
                        )}
                      </div>
                      {formData.listening.enabled && (
                        <div className="mt-2 ml-10">
                          <input
                            type="text"
                            placeholder="Description"
                            value={formData.listening.description}
                            onChange={(e) => setFormData({
                              ...formData,
                              listening: { ...formData.listening, description: e.target.value }
                            })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Speaking */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => toggleSection('speaking')} className="text-primary-600">
                            {formData.speaking.enabled ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                          <label className="font-medium text-gray-900">Speaking</label>
                        </div>
                      </div>
                      {formData.speaking.enabled && (
                        <div className="mt-2 ml-10">
                          <input
                            type="text"
                            placeholder="Description"
                            value={formData.speaking.description}
                            onChange={(e) => setFormData({
                              ...formData,
                              speaking: { ...formData.speaking, description: e.target.value }
                            })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Presentation */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => toggleSection('presentation')} className="text-primary-600">
                            {formData.presentation.enabled ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                          <label className="font-medium text-gray-900">Presentation</label>
                        </div>
                        {formData.presentation.enabled && (
                          <input
                            type="number"
                            min="1"
                            value={formData.presentation.totalMarks}
                            onChange={(e) => setFormData({
                              ...formData,
                              presentation: { ...formData.presentation, totalMarks: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                            placeholder="Marks"
                          />
                        )}
                      </div>
                      {formData.presentation.enabled && (
                        <div className="mt-2 ml-10">
                          <input
                            type="text"
                            placeholder="Description"
                            value={formData.presentation.description}
                            onChange={(e) => setFormData({
                              ...formData,
                              presentation: { ...formData.presentation, description: e.target.value }
                            })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button onClick={() => { setIsFormOpen(false); resetForm(); }} className="btn-secondary">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Create</span>
                      </>
                    )}
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