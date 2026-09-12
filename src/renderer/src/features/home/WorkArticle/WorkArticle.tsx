import React, { useState, useEffect, useRef } from 'react';
import { Pencil, X, Plus, Trash2, Edit2, Sparkles, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { Work } from '../../../../../shared/schema/resumeSchema';
import { Modal } from '../../../shared/components/Modal/Modal';
import { CopyButton } from '../../../shared/components/CopyButton/CopyButton';

const WorkFormSchema = z.object({
  name: z.string().optional().default(''),
  position: z.string().optional().default(''),
  url: z.string().url("Invalid URL").optional().or(z.literal('')),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  summary: z.string().optional(),
  highlights: z.array(z.object({ text: z.string() })).optional().default([])
});

interface WorkFormInput {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights: { text: string }[];
}

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WorkFormInput) => Promise<void>;
  initialData?: Work | null;
}

const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formattedHighlights = (initialData?.highlights || []).map(h => (typeof h === 'string' ? { text: h } : { text: (h as any).text || '' }));

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<WorkFormInput>({
    resolver: zodResolver(WorkFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      position: initialData?.position || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      url: initialData?.url || '',
      summary: initialData?.summary || '',
      highlights: formattedHighlights
    }
  });

  const { fields: highlights, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: "highlights"
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { ref: nameRef, ...nameProps } = register("name");

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Edit Work Experience" : "Add Work Experience"}
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-label-md mb-1 text-on-surface">Company Name <span className="text-error">*</span></label>
            <input 
              type="text" 
              {...nameProps}
              ref={(e) => {
                nameRef(e);
                inputRef.current = e;
              }}
              className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.name ? 'border-error' : 'border-outline-variant'}`} 
            />
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
              onClick={() => appendHighlight({ text: '' })}
              className="flex items-center gap-1 text-primary hover:text-primary-container text-label-md bg-surface-container px-3 py-1.5 rounded-md"
            >
              <Plus className="w-4 h-4" /> Add Highlight
            </button>
          </div>
          
          <div className="space-y-3">
            {highlights.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <textarea 
                  {...register(`highlights.${index}.text` as const)} 
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
            onClick={onClose}
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
  );
};

export const WorkArticle: React.FC = () => {
  const work = useResumeStore(state => state.data?.work);
  const addArrayItem = useResumeStore(state => state.addArrayItem);
  const updateArrayItem = useResumeStore(state => state.updateArrayItem);
  const deleteArrayItem = useResumeStore(state => state.deleteArrayItem);
  const analyzeWork = useResumeStore(state => state.analyzeWork);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAnalyzeWork = async () => {
    setIsAnalyzing(true);
    setAnalyzeError(null);
    const result = await analyzeWork();
    if (!result.success) {
      setAnalyzeError(result.error || 'Work analysis failed');
    }
    setIsAnalyzing(false);
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const openAddModal = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = async (data: WorkFormInput) => {
    const formattedWork: Work = {
      name: data.name || '',
      position: data.position || '',
      url: data.url || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      summary: data.summary || '',
      highlights: (data.highlights || [])
        .map((h: any) => (typeof h === 'string' ? h : h?.text || ''))
        .filter(t => typeof t === 'string' && t.trim() !== '')
    };

    if (editingIndex !== null) {
      await updateArrayItem('work', editingIndex, formattedWork);
    } else {
      await addArrayItem('work', formattedWork);
    }
    setEditingIndex(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (index: number) => {
    await deleteArrayItem('work', index);
    setEditingIndex(null);
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Work</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyzeWork}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-label-md font-medium bg-primary-container text-primary hover:bg-primary hover:text-on-primary rounded-md transition-colors disabled:opacity-50"
            title="Refine work experience phrasing using Groq AI"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
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
          <CopyButton data={work} title="Copy Work JSON to clipboard" />
        </div>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {analyzeError && (
          <div className="p-4 bg-error-container/20 border border-error/30 text-on-surface rounded-lg text-body-sm flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-error mt-0.5"><AlertCircle className="w-5 h-5" /></span>
              <div>
                <strong className="block text-error text-label-md font-semibold mb-0.5">Work Experience Analysis Failed</strong>
                <p className="m-0 text-on-surface-variant text-body-sm">{analyzeError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyzeWork}
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
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 w-full py-3 mt-2 border-2 border-dashed border-outline-variant rounded-lg text-primary hover:bg-primary-container hover:border-primary transition-colors font-medium"
          >
            <Plus className="w-5 h-5" /> Add Work Experience
          </button>
        )}
      </div>

      <WorkModal 
        key={isModalOpen ? (editingIndex !== null ? `edit-${editingIndex}` : 'add-new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingIndex !== null && work ? work[editingIndex] : null}
      />
    </article>
  );
};
