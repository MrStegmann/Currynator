import React, { useState } from 'react';
import { Pencil, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { LanguageSchema, Language } from '../../../../../shared/schema/resumeSchema';
import { Modal } from '../../../shared/components/Modal/Modal';

export const LanguagesArticle: React.FC = () => {
  const languages = useResumeStore(state => state.data?.languages);
  const addArrayItem = useResumeStore(state => state.addArrayItem);
  const updateArrayItem = useResumeStore(state => state.updateArrayItem);
  const deleteArrayItem = useResumeStore(state => state.deleteArrayItem);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toggleEdit = () => setIsEditing(!isEditing);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Language>({
    resolver: zodResolver(LanguageSchema)
  });

  const openAddModal = () => {
    setEditingIndex(null);
    reset({ language: '', fluency: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    if (!languages) return;
    setEditingIndex(index);
    reset(languages[index]);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Language) => {
    if (editingIndex !== null) {
      await updateArrayItem('languages', editingIndex, data);
    } else {
      await addArrayItem('languages', data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this language?")) {
      await deleteArrayItem('languages', index);
    }
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Languages</h2>
        <button
          onClick={toggleEdit}
          className={`p-1.5 rounded-md transition-colors ${
            isEditing 
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
          }`}
          aria-label={isEditing ? 'Done Editing Languages' : 'Edit Languages'}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-6 grid gap-4 text-body-md text-on-surface-variant">
        {!languages || languages.length === 0 ? (
          <p>No languages provided.</p>
        ) : (
          languages.map((lang, index) => (
            <div key={index} className="flex justify-between items-center border-b border-outline-variant pb-4 last:border-0 last:pb-0 relative group">
              <div>
                <strong className="text-on-surface">{lang.language}</strong>
                {lang.fluency && <span className="text-on-surface-variant ml-2">• {lang.fluency}</span>}
              </div>

              {isEditing && (
                <div className="absolute top-0 right-0 flex gap-1 bg-surface-container-lowest border border-outline-variant p-1 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(index)} className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(index)} className="p-1 text-on-surface-variant hover:text-error rounded hover:bg-error-container transition-colors" title="Delete">
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
            <Plus className="w-5 h-5" /> Add Language
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingIndex !== null ? "Edit Language" : "Add Language"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-label-md mb-1 text-on-surface">Language <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. English" {...register("language")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.language ? 'border-error' : 'border-outline-variant'}`} />
              {errors.language && <p className="text-error text-body-sm mt-1">{errors.language.message}</p>}
            </div>
            
            <div>
              <label className="block text-label-md mb-1 text-on-surface">Fluency</label>
              <input type="text" placeholder="e.g. Native" {...register("fluency")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.fluency ? 'border-error' : 'border-outline-variant'}`} />
              {errors.fluency && <p className="text-error text-body-sm mt-1">{errors.fluency.message}</p>}
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
              {isSubmitting ? 'Saving...' : 'Save Language'}
            </button>
          </div>
        </form>
      </Modal>
    </article>
  );
};
