import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMockTestApi } from '@api/admin/mockTest.api';
import { programsApi } from '@api/programs.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import {
  FileText,
  Plus,
  Eye,
  Calendar,
  Clock,
  X,
  Save,
  Loader2,
  CheckSquare,
  Square,
  Edit,
  Trash2
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

const AdminMockTests: React.FC = () => {
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

  // Fetch ALL programs using programsApi (for Admin)
  const programsQuery: any = useQuery({
    queryKey: ['admin-programs'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  // Extract programs from the response
  const extractPrograms = (): any[] => {
    if (!programsQuery.data) return [];
    const responseData = programsQuery.data.data;
    if (!responseData) return [];
    if (responseData.data?.programs && Array.isArray(responseData.data.programs)) {
      return responseData.data.programs;
    }
    if (responseData.programs && Array.isArray(responseData.programs)) {
      return responseData.programs;
    }
    if (Array.isArray(responseData)) {
      return responseData;
    }
    return [];
  };

  const programs = extractPrograms();

  // Fetch mock tests using admin API
  const mockTestsQuery: any = useQuery({
    queryKey: ['admin-all-mocktests'],
    queryFn: async () => {
      const programsRes = await programsApi.getAll({ isActive: true, limit: 100 });
      const programsData = programsRes?.data?.data?.programs || [];
      let allMockTests: any[] = [];
      for (const program of programsData) {
        try {
          const mockTestsRes = await adminMockTestApi.getMockTestsByProgram(program.id);
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

  // CREATE mutation - using admin API
  const createMutation: any = useMutation({
    mutationFn: (data: any) => adminMockTestApi.createMockTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-mocktests'] });
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

  // UPDATE mutation - using admin API
  const updateMutation: any = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminMockTestApi.updateMockTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-mocktests'] });
      toast.success('Mock test updated successfully!');
      setIsFormOpen(false);
      setEditingTest(null);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update mock test error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to update mock test';
      toast.error(message);
    },
  });

  // DELETE mutation - using admin API
  const deleteMutation: any = useMutation({
    mutationFn: (id: string) => adminMockTestApi.deleteMockTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-mocktests'] });
      toast.success('Mock test deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Delete mock test error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete mock test');
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

  const handleOpenEdit = (test: any) => {
    setEditingTest(test);
    setSelectedProgramId(test.programId);
    setFormData({
      title: test.title || '',
      description: test.description || '',
      testDate: test.testDate ? new Date(test.testDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      reading: {
        enabled: !!test.reading,
        totalMarks: test.reading?.totalMarks || 40,
        description: test.reading?.description || 'Reading comprehension',
      },
      writing: {
        enabled: !!test.writing,
        totalMarks: test.writing?.totalMarks || 40,
        description: test.writing?.description || 'Writing tasks',
      },
      listening: {
        enabled: !!test.listening,
        totalMarks: test.listening?.totalMarks || 40,
        description: test.listening?.description || 'Listening comprehension',
      },
      speaking: {
        enabled: !!test.speaking,
        description: test.speaking?.description || 'Speaking assessment',
      },
      presentation: {
        enabled: !!test.presentation,
        totalMarks: test.presentation?.totalMarks || 20,
        description: test.presentation?.description || 'Presentation',
      },
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this mock test? All associated results will also be deleted.')) {
      deleteMutation.mutate(id);
    }
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

    const submitData: any = {
      programId: selectedProgramId,
      title: formData.title,
      description: formData.description || '',
      testDate: formData.testDate,
    };

    if (formData.reading.enabled && formData.reading.totalMarks > 0) {
      submitData.reading = {
        totalMarks: formData.reading.totalMarks,
        description: formData.reading.description || 'Reading comprehension',
      };
    }
    if (formData.writing.enabled && formData.writing.totalMarks > 0) {
      submitData.writing = {
        totalMarks: formData.writing.totalMarks,
        description: formData.writing.description || 'Writing tasks',
      };
    }
    if (formData.listening.enabled && formData.listening.totalMarks > 0) {
      submitData.listening = {
        totalMarks: formData.listening.totalMarks,
        description: formData.listening.description || 'Listening comprehension',
      };
    }
    if (formData.speaking.enabled) {
      submitData.speaking = {
        description: formData.speaking.description || 'Speaking assessment',
      };
    }
    if (formData.presentation.enabled && formData.presentation.totalMarks > 0) {
      submitData.presentation = {
        totalMarks: formData.presentation.totalMarks,
        description: formData.presentation.description || 'Presentation',
      };
    }

    try {
      if (editingTest) {
        await updateMutation.mutateAsync({ id: editingTest._id, data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
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

  // Modal content
  const renderModal = () => {
    if (!isFormOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm" onClick={() => { setIsFormOpen(false); resetForm(); }} />
        <div className="relative z-[10000] min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/50 animate-scale-in">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {editingTest ? 'Edit Mock Test' : 'Create Mock Test'}
                  </h3>
                  <p className="text-sm text-primary-100">
                    {editingTest ? 'Update mock test details' : 'Add a new mock test'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setIsFormOpen(false); resetForm(); }} 
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Select Program */}
              <div>
                <label className="label font-medium text-gray-700">Select Program *</label>
                <select 
                  value={selectedProgramId} 
                  onChange={(e) => setSelectedProgramId(e.target.value)} 
                  className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                >
                  <option value="">Select a program</option>
                  {programs.map((program: any) => (
                    <option key={program.id} value={program.id}>
                      {program.displayName?.en || program.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary-500 rounded-full" />
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="label font-medium text-gray-700">Test Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Mock Test 1"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Test description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Test Date *</label>
                    <input
                      type="date"
                      value={formData.testDate}
                      onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="border-t border-gray-200/50 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary-500 rounded-full" />
                  Select Sections to Include
                </h4>
                <p className="text-xs text-gray-500 mb-4">Toggle sections on/off. Only enabled sections will be included.</p>

                <div className="space-y-3">
                  {/* Reading */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-primary-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('reading')} className="text-primary-600 hover:text-primary-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Writing */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-primary-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('writing')} className="text-primary-600 hover:text-primary-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Listening */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-primary-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('listening')} className="text-primary-600 hover:text-primary-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Speaking */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-primary-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('speaking')} className="text-primary-600 hover:text-primary-700 transition-colors">
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Presentation */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-primary-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('presentation')} className="text-primary-600 hover:text-primary-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200/50">
                <button 
                  onClick={() => { setIsFormOpen(false); resetForm(); }} 
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{editingTest ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingTest ? 'Update Mock Test' : 'Create Mock Test'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">Mock Tests</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Mock Tests</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create, manage, and enter marks for mock tests</p>
        </div>
        <button 
          onClick={handleOpenCreate} 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Create Mock Test</span>
        </button>
      </div>

      {/* Mock Tests Grid */}
      {mockTests.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-16 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No mock tests created yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first mock test for any program</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg font-display">
                      {test.title || `Mock Test ${test.testNumber}`}
                    </h3>
                    <p className="text-sm text-gray-500">Test #{test.testNumber}</p>
                    <p className="text-xs text-primary-600 mt-1">{test.programName}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => navigate(`/admin/mark-entry/${test._id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Enter Marks"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(test)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                    <span>{new Date(test.testDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Clock className="w-4 h-4 mr-2 text-primary-500" />
                    <span className="text-xs">{sections.join(' • ')}</span>
                  </div>
                </div>

                <button
                  className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-700 font-medium rounded-xl border border-primary-200/50 hover:from-primary-500 hover:to-primary-600 hover:text-white transition-all duration-300"
                  onClick={() => navigate(`/admin/mark-entry/${test._id}`)}
                >
                  <Eye className="w-4 h-4 inline-block mr-2" />
                  Enter Marks
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal - Rendered via createPortal */}
      {renderModal()}
    </div>
  );
};

export default AdminMockTests;