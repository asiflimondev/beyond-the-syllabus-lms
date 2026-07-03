import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import ProgramList from '@components/programs/ProgramList';
import ProgramForm from '@components/programs/ProgramForm';
import { programsApi, Program } from '@api/programs.api';

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
      <ProgramList onEdit={handleEdit} onCreate={handleCreateNew} />

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