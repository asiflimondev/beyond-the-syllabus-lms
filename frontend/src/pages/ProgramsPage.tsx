import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import ProgramList from '@components/programs/ProgramList';
import ProgramForm from '@components/programs/ProgramForm';
import { programsApi, Program } from '@api/programs.api';
import { Sparkles, BookOpen } from 'lucide-react';

const ProgramsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Create program mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => programsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program created successfully');
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create program');
    },
  });

  // Update program mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      programsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program updated successfully');
      setIsFormOpen(false);
      setEditingProgram(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update program');
    },
  });

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: any) => {
    if (editingProgram) {
      updateMutation.mutate({ id: editingProgram.id, data });
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProgram(null);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingProgram(null);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Page Header - Removed duplicate button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">Programs</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Manage Programs</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Create, edit, and manage all your Cambridge English programs
          </p>
        </div>
        {/* Only ONE New Program button */}
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Sparkles className="w-5 h-5" />
          <span>New Program</span>
        </button>
      </div>

      {/* Program List - The "New Program" button inside the empty state will also be removed */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5 overflow-hidden">
        <ProgramList onEdit={handleEdit} onCreate={handleCreateNew} />
      </div>

      {/* Program Form Modal */}
      <ProgramForm
        isOpen={isFormOpen}
        onClose={handleClose}
        onSubmit={editingProgram ? handleUpdate : handleCreate}
        program={editingProgram}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProgramsPage;