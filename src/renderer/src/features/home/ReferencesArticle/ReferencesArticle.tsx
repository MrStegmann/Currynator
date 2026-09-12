import React, { useState } from 'react';
import { Pencil, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { ReferenceSchema, Reference } from '../../../../../shared/schema/resumeSchema';
import { Modal } from '../../../shared/components/Modal/Modal';
import { CopyButton } from '../../../shared/components/CopyButton/CopyButton';

export const ReferencesArticle: React.FC = () => {
  const references = useResumeStore(state => state.data?.references);
  const addArrayItem = useResumeStore(state => state.addArrayItem);
  const updateArrayItem = useResumeStore(state => state.updateArrayItem);
  const deleteArrayItem = useResumeStore(state => state.deleteArrayItem);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toggleEdit = () => setIsEditing(!isEditing);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Reference>({
    resolver: zodResolver(ReferenceSchema)
  });

  const openAddModal = () => {
    setEditingIndex(null);
    reset({ name: '', reference: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    if (!references) return;
    setEditingIndex(index);
    reset(references[index]);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Reference) => {
    if (editingIndex !== null) {
      await updateArrayItem('references', editingIndex, data);
    } else {
      await addArrayItem('references', data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this reference?")) {
      await deleteArrayItem('references', index);
    }
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">References</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdit}
            className={`p-1.5 rounded-md transition-colors ${
              isEditing 
                ? 'bg-primary text-on-primary hover:bg-primary/90'
                : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
            }`}
            aria-label={isEditing ? 'Done Editing References' : 'Edit References'}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
          <CopyButton data={references} title="Copy References JSON to clipboard" />
        </div>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {!references || references.length === 0 ? (
          <p>No references provided.</p>
        ) : (
          references.map((ref, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0 relative group">
              <blockquote className="border-l-4 border-primary pl-4 mb-2 italic">
                "{ref.reference}"
              </blockquote>
              <div className="text-right">
                <strong className="text-on-surface">— {ref.name}</strong>
              </div>

              {isEditing && (
                <div className="absolute -top-3 -right-3 flex gap-1 bg-surface-container-lowest border border-outline-variant p-1 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(index)} className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-surface-container transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(index)} className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error-container transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {isEditing && (
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 w-full py-3 mt-2 border-2 border-dashed border-outline-variant rounded-lg text-primary hover:bg-primary-container hover:border-primary transition-colors font-medium"
          >
            <Plus className="w-5 h-5" /> Add Reference
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingIndex !== null ? "Edit Reference" : "Add Reference"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-label-md mb-1 text-on-surface">Name <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. John Doe" {...register("name")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.name ? 'border-error' : 'border-outline-variant'}`} />
              {errors.name && <p className="text-error text-body-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-label-md mb-1 text-on-surface">Reference Text <span className="text-error">*</span></label>
              <textarea {...register("reference")} rows={4} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y ${errors.reference ? 'border-error' : 'border-outline-variant'}`} placeholder="e.g. It was a pleasure working with..." />
              {errors.reference && <p className="text-error text-body-sm mt-1">{errors.reference.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant mt-8">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-outline-variant rounded-md text-on-surface hover:bg-surface-container-lowest transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-container transition-colors font-medium shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Reference'}
            </button>
          </div>
        </form>
      </Modal>
    </article>
  );
};
