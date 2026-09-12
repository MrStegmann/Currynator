import React, { useState } from 'react';
import { Pencil, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { EducationSchema, Education } from '../../../../../shared/schema/resumeSchema';
import { Modal } from '../../../shared/components/Modal/Modal';

import { CopyButton } from '../../../shared/components/CopyButton/CopyButton';

export const EducationArticle: React.FC = () => {
  const education = useResumeStore(state => state.data?.education);
  const addArrayItem = useResumeStore(state => state.addArrayItem);
  const updateArrayItem = useResumeStore(state => state.updateArrayItem);
  const deleteArrayItem = useResumeStore(state => state.deleteArrayItem);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toggleEdit = () => setIsEditing(!isEditing);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Education>({
    resolver: zodResolver(EducationSchema)
  });

  const openAddModal = () => {
    setEditingIndex(null);
    reset({ institution: '', area: '', studyType: '', startDate: '', endDate: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    if (!education) return;
    setEditingIndex(index);
    reset(education[index]);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Education) => {
    if (editingIndex !== null) {
      await updateArrayItem('education', editingIndex, data);
    } else {
      await addArrayItem('education', data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      await deleteArrayItem('education', index);
    }
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Education</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdit}
            className={`p-1.5 rounded-md transition-colors ${
              isEditing 
                ? 'bg-primary text-on-primary hover:bg-primary/90'
                : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
            }`}
            aria-label={isEditing ? 'Done Editing Education' : 'Edit Education'}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
          <CopyButton data={education} title="Copy Education JSON to clipboard" />
        </div>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {!education || education.length === 0 ? (
          <p>No education information provided.</p>
        ) : (
          education.map((edu, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0 relative group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="text-on-surface text-body-lg block">{edu.institution}</strong>
                  <span>{edu.studyType} {edu.studyType && edu.area ? 'in' : ''} {edu.area}</span>
                </div>
                <div className="text-right text-label-md bg-surface-container py-1 px-2 rounded-md font-mono shrink-0 ml-4">
                  {edu.startDate} — {edu.endDate}
                </div>
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
            <Plus className="w-5 h-5" /> Add Education
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingIndex !== null ? "Edit Education" : "Add Education"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-label-md mb-1 text-on-surface">Institution <span className="text-error">*</span></label>
              <input type="text" {...register("institution")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.institution ? 'border-error' : 'border-outline-variant'}`} />
              {errors.institution && <p className="text-error text-body-sm mt-1">{errors.institution.message}</p>}
            </div>
            
            <div>
              <label className="block text-label-md mb-1 text-on-surface">Area of Study <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. Computer Science" {...register("area")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.area ? 'border-error' : 'border-outline-variant'}`} />
              {errors.area && <p className="text-error text-body-sm mt-1">{errors.area.message}</p>}
            </div>

            <div>
              <label className="block text-label-md mb-1 text-on-surface">Study Type</label>
              <input type="text" placeholder="e.g. Bachelor" {...register("studyType")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.studyType ? 'border-error' : 'border-outline-variant'}`} />
              {errors.studyType && <p className="text-error text-body-sm mt-1">{errors.studyType.message}</p>}
            </div>

            <div>
              <label className="block text-label-md mb-1 text-on-surface">Start Date <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. 2018-09" {...register("startDate")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.startDate ? 'border-error' : 'border-outline-variant'}`} />
              {errors.startDate && <p className="text-error text-body-sm mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-label-md mb-1 text-on-surface">End Date <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. 2022-06 or Currently" {...register("endDate")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.endDate ? 'border-error' : 'border-outline-variant'}`} />
              {errors.endDate && <p className="text-error text-body-sm mt-1">{errors.endDate.message}</p>}
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
              {isSubmitting ? 'Saving...' : 'Save Education'}
            </button>
          </div>
        </form>
      </Modal>
    </article>
  );
};
