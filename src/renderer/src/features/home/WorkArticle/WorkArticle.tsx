import React, { useState } from 'react';
import { Pencil, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { WorkSchema, Work } from '../../../../shared/schema/resumeSchema';
import { Modal } from '../../../shared/components/Modal/Modal';

export const WorkArticle: React.FC = () => {
  const work = useResumeStore(state => state.data?.work);
  const addArrayItem = useResumeStore(state => state.addArrayItem);
  const updateArrayItem = useResumeStore(state => state.updateArrayItem);
  const deleteArrayItem = useResumeStore(state => state.deleteArrayItem);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toggleEdit = () => setIsEditing(!isEditing);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<Work>({
    resolver: zodResolver(WorkSchema)
  });

  const { fields: highlights, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: "highlights" as never // zod array of strings workaround
  });

  const openAddModal = () => {
    setEditingIndex(null);
    reset({ name: '', position: '', startDate: '', endDate: '', url: '', summary: '', highlights: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    if (!work) return;
    setEditingIndex(index);
    reset(work[index]);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Work) => {
    if (editingIndex !== null) {
      await updateArrayItem('work', editingIndex, data);
    } else {
      await addArrayItem('work', data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this work experience?")) {
      await deleteArrayItem('work', index);
    }
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Work</h2>
        <button
          onClick={toggleEdit}
          className={`p-1.5 rounded-md transition-colors ${
            isEditing 
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
          }`}
          aria-label={isEditing ? 'Done Editing Work' : 'Edit Work'}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {!work || work.length === 0 ? (
          <p>No work experience provided.</p>
        ) : (
          work.map((job, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0 relative group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="text-on-surface text-body-lg block">{job.position}</strong>
                  <span>{job.name}</span>
                </div>
                <div className="text-right text-label-md bg-surface-container py-1 px-2 rounded-md font-mono shrink-0 ml-4">
                  {job.startDate} — {job.endDate}
                </div>
              </div>
              {job.url && (
                <div className="mb-2">
                  <a href={job.url} className="text-primary hover:underline break-all" target="_blank" rel="noreferrer">
                    {job.url}
                  </a>
                </div>
              )}
              {job.summary && <p className="mb-2 whitespace-pre-wrap">{job.summary}</p>}
              {job.highlights && job.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {job.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
              
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
            <Plus className="w-5 h-5" /> Add Work Experience
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingIndex !== null ? "Edit Work Experience" : "Add Work Experience"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-label-md mb-1 text-on-surface">Company Name <span className="text-error">*</span></label>
              <input type="text" {...register("name")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.name ? 'border-error' : 'border-outline-variant'}`} />
              {errors.name && <p className="text-error text-body-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-label-md mb-1 text-on-surface">Position <span className="text-error">*</span></label>
              <input type="text" {...register("position")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.position ? 'border-error' : 'border-outline-variant'}`} />
              {errors.position && <p className="text-error text-body-sm mt-1">{errors.position.message}</p>}
            </div>

            <div>
              <label className="block text-label-md mb-1 text-on-surface">Start Date <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. 2021-01" {...register("startDate")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.startDate ? 'border-error' : 'border-outline-variant'}`} />
              {errors.startDate && <p className="text-error text-body-sm mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-label-md mb-1 text-on-surface">End Date <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. 2023-12 or Currently" {...register("endDate")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.endDate ? 'border-error' : 'border-outline-variant'}`} />
              {errors.endDate && <p className="text-error text-body-sm mt-1">{errors.endDate.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-label-md mb-1 text-on-surface">URL</label>
              <input type="url" {...register("url")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.url ? 'border-error' : 'border-outline-variant'}`} />
              {errors.url && <p className="text-error text-body-sm mt-1">{errors.url.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-label-md mb-1 text-on-surface">Summary</label>
              <textarea {...register("summary")} rows={3} className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y" />
            </div>
          </div>

          <div className="border-t border-outline-variant pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-headline-sm text-on-surface m-0">Highlights</h3>
              <button 
                type="button" 
                onClick={() => appendHighlight(' ' as never)}
                className="flex items-center gap-1 text-primary hover:text-primary-container text-label-md bg-surface-container px-3 py-1.5 rounded-md"
              >
                <Plus className="w-4 h-4" /> Add Highlight
              </button>
            </div>
            
            <div className="space-y-3">
              {highlights.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <textarea 
                    {...register(`highlights.${index}` as const)} 
                    rows={2}
                    className="flex-1 p-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y" 
                    placeholder="e.g. Increased revenue by 20%..."
                  />
                  <button 
                    type="button" 
                    onClick={() => removeHighlight(index)}
                    className="text-outline-variant hover:text-error mt-1 p-1.5 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
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
              {isSubmitting ? 'Saving...' : 'Save Work'}
            </button>
          </div>
        </form>
      </Modal>
    </article>
  );
};
