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
  Trash2,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Users
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

interface ProgramWithCount {
  _id: string;
  name: string;
  displayName: {
    en: string;
    bn: string;
  };
  mockTestCount: number;
}

interface MockTest {
  _id: string;
  title: string;
  description: string;
  testNumber: number;
  testDate: string;
  isActive: boolean;
  programId: string;
  programName?: string;
  reading?: { totalMarks: number; description: string };
  writing?: { totalMarks: number; description: string };
  listening?: { totalMarks: number; description: string };
  speaking?: { description: string };
  presentation?: { totalMarks: number; description: string };
}

const AdminMockTests: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());
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

  // Fetch all programs
  const programsQuery = useQuery({
    queryKey: ['admin-programs-list'],
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

  // Fetch mock tests for each program and calculate counts
  const mockTestsQuery = useQuery({
    queryKey: ['admin-all-mocktests-counts'],
    queryFn: async () => {
      const allPrograms = extractPrograms();
      const programsWithCounts: ProgramWithCount[] = [];
      
      for (const program of allPrograms) {
        try {
          const mockTestsRes = await adminMockTestApi.getMockTestsByProgram(program.id);
          console.log(`📊 Mock tests for program ${program.displayName?.en || program.name}:`, mockTestsRes?.data?.data);
          const mockTests = mockTestsRes?.data?.data || [];
          programsWithCounts.push({
            _id: program.id,
            name: program.name,
            displayName: program.displayName,
            mockTestCount: mockTests.length,
          });
        } catch (error) {
          console.error(`Error fetching mock tests for program ${program.id}:`, error);
          programsWithCounts.push({
            _id: program.id,
            name: program.name,
            displayName: program.displayName,
            mockTestCount: 0,
          });
        }
      }
      
      return programsWithCounts;
    },
    enabled: programs.length > 0,
  });

  const programsWithCounts: ProgramWithCount[] = mockTestsQuery.data || [];

  // Fetch mock tests for selected program
  const { data: mockTestsData, isLoading: mockTestsLoading, refetch } = useQuery({
    queryKey: ['admin-mocktests', selectedProgramId],
    queryFn: () => adminMockTestApi.getMockTestsByProgram(selectedProgramId),
    enabled: !!selectedProgramId,
  });

  const mockTests: MockTest[] = mockTestsData?.data?.data || [];
  
  // Debug: Log mock tests when they change
  React.useEffect(() => {
    if (selectedProgramId && mockTests.length > 0) {
      console.log(`✅ Found ${mockTests.length} mock tests for program:`, mockTests);
    }
    if (selectedProgramId && mockTests.length === 0 && mockTestsData) {
      console.log(`ℹ️ No mock tests found for program ${selectedProgramId}`);
      console.log('Response data:', mockTestsData);
    }
  }, [selectedProgramId, mockTests, mockTestsData]);

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => adminMockTestApi.createMockTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-mocktests-counts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-mocktests'] });
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

  // UPDATE mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminMockTestApi.updateMockTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-mocktests-counts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-mocktests'] });
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

  // DELETE mutation - PERMANENT DELETE with cascade
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminMockTestApi.permanentlyDeleteMockTest(id),
    onSuccess: (data) => {
      const resultsDeleted = data?.data?.data?.resultsDeleted || 0;
      toast.success(`Mock test and ${resultsDeleted} associated results deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['admin-all-mocktests-counts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-mocktests'] });
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

  const handleOpenEdit = (test: MockTest) => {
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

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"? This will also delete all associated results.`)) {
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

  const toggleProgram = (programId: string) => {
    const newExpanded = new Set(expandedPrograms);
    if (newExpanded.has(programId)) {
      newExpanded.delete(programId);
      setSelectedProgramId('');
    } else {
      newExpanded.add(programId);
      setSelectedProgramId(programId);
      // Refetch mock tests when expanding
      setTimeout(() => refetch(), 100);
    }
    setExpandedPrograms(newExpanded);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (programsQuery.isLoading || mockTestsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading programs...</span>
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
            <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {editingTest ? 'Edit Mock Test' : 'Create Mock Test'}
                  </h3>
                  <p className="text-sm text-orange-100">
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
                <label className="label font-medium text-gray-700">Select Programme *</label>
                <select 
                  value={selectedProgramId} 
                  onChange={(e) => setSelectedProgramId(e.target.value)} 
                  className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                >
                  <option value="">Select a programme</option>
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
                  <span className="w-1 h-5 bg-orange-500 rounded-full" />
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
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Test description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="label font-medium text-gray-700">Test Date *</label>
                    <input
                      type="date"
                      value={formData.testDate}
                      onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="border-t border-gray-200/50 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-orange-500 rounded-full" />
                  Select Sections to Include
                </h4>
                <p className="text-xs text-gray-500 mb-4">Toggle sections on/off. Only enabled sections will be included.</p>

                <div className="space-y-3">
                  {/* Reading */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-orange-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('reading')} className="text-orange-600 hover:text-orange-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Writing */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-orange-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('writing')} className="text-orange-600 hover:text-orange-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Listening */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-orange-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('listening')} className="text-orange-600 hover:text-orange-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Speaking */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-orange-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('speaking')} className="text-orange-600 hover:text-orange-700 transition-colors">
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Presentation */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-orange-200/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleSection('presentation')} className="text-orange-600 hover:text-orange-700 transition-colors">
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
                          className="w-24 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
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
                          className="w-full px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
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
            <FileText className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">Mock Tests</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Mock Tests</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create, manage, and enter marks for mock tests</p>
        </div>
        <button 
          onClick={handleOpenCreate} 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Create Mock Test</span>
        </button>
      </div>

      {/* Programs with Mock Tests */}
      {programs.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-16 text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No programs found</p>
          <p className="text-sm text-gray-400 mt-1">Create a program first to add mock tests</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {programsWithCounts.map((program: ProgramWithCount) => (
              <div key={program._id} className="transition-all">
                {/* Program Header */}
                <button
                  onClick={() => toggleProgram(program._id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      expandedPrograms.has(program._id) ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <GraduationCap className={`w-4 h-4 ${
                        expandedPrograms.has(program._id) ? 'text-orange-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">
                        {program.displayName?.en || program.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {program.mockTestCount} mock test{program.mockTestCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {expandedPrograms.has(program._id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Mock Tests List */}
                {expandedPrograms.has(program._id) && (
                  <div className="px-6 pb-4 pt-2 bg-gray-50/30">
                    {mockTestsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-orange-500 border-t-transparent"></div>
                        <span className="ml-3 text-sm text-gray-600">Loading mock tests...</span>
                      </div>
                    ) : mockTests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm">No mock tests created for this program</p>
                        <button
                          onClick={handleOpenCreate}
                          className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Create your first mock test
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockTests.map((test: MockTest) => {
                          const sections = [];
                          if (test.reading) sections.push('Reading');
                          if (test.writing) sections.push('Writing');
                          if (test.listening) sections.push('Listening');
                          if (test.speaking) sections.push('Speaking');
                          if (test.presentation) sections.push('Presentation');

                          return (
                            <div
                              key={test._id}
                              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-900 truncate">
                                    {test.title || `Mock Test ${test.testNumber}`}
                                  </h5>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Test #{test.testNumber}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(test.testDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">{sections.join(' • ')}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                  <button
                                    onClick={() => navigate(`/admin/mark-entry/${test._id}`)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    title="Enter Marks"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEdit(test)}
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(test._id, test.title)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <button
                                className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-700 font-medium rounded-lg border border-orange-200/50 hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 text-sm"
                                onClick={() => navigate(`/admin/mark-entry/${test._id}`)}
                              >
                                <Users className="w-4 h-4 inline-block mr-1.5" />
                                Enter Marks
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal - Rendered via createPortal */}
      {renderModal()}
    </div>
  );
};

export default AdminMockTests;