import React, { useState } from 'react';
import { Pencil, X, Plus, Trash2, Edit2, Sparkles, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { SkillSchema, Skill } from '../../../../../shared/schema/resumeSchema';
import { Modal } from '../../../shared/components/Modal/Modal';
import { NonElementalLabel } from './NonElementalLabel';

export const SkillsArticle: React.FC = () => {
  const skills = useResumeStore(state => state.data?.skills);
  const addArrayItem = useResumeStore(state => state.addArrayItem);
  const updateArrayItem = useResumeStore(state => state.updateArrayItem);
  const deleteArrayItem = useResumeStore(state => state.deleteArrayItem);
  const analyzeSkills = useResumeStore(state => state.analyzeSkills);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAnalyzeSkills = async () => {
    setIsAnalyzing(true);
    setAnalyzeError(null);
    const result = await analyzeSkills();
    if (!result.success) {
      setAnalyzeError(result.error || 'Skill analysis failed');
    }
    setIsAnalyzing(false);
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<Skill>({
    resolver: zodResolver(SkillSchema)
  });

  const { fields: keywords, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control,
    name: "keywords" as never
  });

  const openAddModal = () => {
    setEditingIndex(null);
    reset({ name: '', keywords: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    if (!skills) return;
    setEditingIndex(index);
    reset(skills[index]);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Skill) => {
    if (editingIndex !== null) {
      await updateArrayItem('skills', editingIndex, data);
    } else {
      await addArrayItem('skills', data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this skill group?")) {
      await deleteArrayItem('skills', index);
    }
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Skills</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyzeSkills}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-label-md font-medium bg-primary-container text-primary hover:bg-primary hover:text-on-primary rounded-md transition-colors disabled:opacity-50"
            title="Categorize skills by tech stack using Groq AI"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isAnalyzing ? 'Categorizing...' : 'Categorize with AI'}
          </button>
          <button
            onClick={toggleEdit}
            className={`p-1.5 rounded-md transition-colors ${
              isEditing 
                ? 'bg-primary text-on-primary hover:bg-primary/90'
                : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
            }`}
            aria-label={isEditing ? 'Done Editing Skills' : 'Edit Skills'}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {analyzeError && (
          <div className="p-4 bg-error-container/20 border border-error/30 text-on-surface rounded-lg text-body-sm flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-error mt-0.5"><AlertCircle className="w-5 h-5" /></span>
              <div>
                <strong className="block text-error text-label-md font-semibold mb-0.5">Categorization Failed</strong>
                <p className="m-0 text-on-surface-variant text-body-sm">{analyzeError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyzeSkills}
                disabled={isAnalyzing}
                className="flex items-center gap-1 px-2.5 py-1 text-label-sm font-medium bg-error-container text-on-error-container hover:bg-error/20 rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
              <button onClick={() => setAnalyzeError(null)} className="p-1 text-on-surface-variant hover:text-on-surface rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {!skills || skills.length === 0 ? (
          <p>No skills provided.</p>
        ) : (
          skills.map((skillGroup, index) => (
            <div key={index} className="relative group">
              <div className="flex items-center mb-2">
                <strong className="text-on-surface">{skillGroup.name}</strong>
                {skillGroup.name === 'Non-Elemental' && <NonElementalLabel />}
              </div>
              <div className="flex flex-wrap gap-2">
                {skillGroup.keywords.map((kw, idx) => (
                  <span key={idx} className="bg-surface-container px-3 py-1 rounded-md text-label-md">
                    {kw}
                  </span>
                ))}
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
            <Plus className="w-5 h-5" /> Add Skill Group
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingIndex !== null ? "Edit Skill Group" : "Add Skill Group"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-label-md mb-1 text-on-surface">Skill Group Name <span className="text-error">*</span></label>
              <input type="text" placeholder="e.g. Frontend Technologies" {...register("name")} className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.name ? 'border-error' : 'border-outline-variant'}`} />
              {errors.name && <p className="text-error text-body-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="border-t border-outline-variant pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-label-md font-semibold text-on-surface m-0">Keywords <span className="text-error">*</span></h3>
                <button 
                  type="button" 
                  onClick={() => appendKeyword(' ' as never)}
                  className="flex items-center gap-1 text-primary hover:text-primary-container text-label-md bg-surface-container px-3 py-1.5 rounded-md"
                >
                  <Plus className="w-4 h-4" /> Add Keyword
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keywords.map((field, index) => (
                  <div key={field.id} className="flex gap-1 items-center bg-surface-container rounded-md pr-1">
                    <input 
                      type="text"
                      {...register(`keywords.${index}` as const)} 
                      className="p-1.5 bg-transparent text-label-md focus:outline-none focus:ring-1 focus:ring-primary w-32" 
                      placeholder="e.g. React"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeKeyword(index)}
                      className="text-outline-variant hover:text-error p-1 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.keywords && <p className="text-error text-body-sm mt-2">{errors.keywords.message}</p>}
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
              {isSubmitting ? 'Saving...' : 'Save Skill Group'}
            </button>
          </div>
        </form>
      </Modal>
    </article>
  );
};
