import React, { useState, useEffect } from 'react';
import type { WorkExperience, WorkExperienceFormModalProps } from '../../types/WorkExperience.types';

export const WorkExperienceFormModal: React.FC<WorkExperienceFormModalProps> = ({ experience, onSave, onCancel }) => {
  const [formData, setFormData] = useState<WorkExperience>({
    id: '',
    jobTitle: '',
    companyName: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    isCurrentRole: false,
    context: '',
    highlights: []
  });

  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      setFormData(prev => ({ ...prev, id: crypto.randomUUID() }));
    }
  }, [experience]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(checked ? { endMonth: '', endYear: '' } : {})
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-card border border-border-subtle rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold">{experience ? 'Editar' : 'Añadir'} Experiencia Laboral</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="work-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Puesto / Rol *</label>
                <input required name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Empresa *</label>
                <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Inicio (Mes / Año) *</label>
                <div className="flex gap-2">
                  <input required name="startMonth" placeholder="MM" maxLength={2} value={formData.startMonth} onChange={handleChange} className="w-1/3 p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" />
                  <input required name="startYear" placeholder="YYYY" maxLength={4} value={formData.startYear} onChange={handleChange} className="w-2/3 p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fin (Mes / Año)</label>
                <div className="flex gap-2">
                  <input disabled={formData.isCurrentRole} required={!formData.isCurrentRole} name="endMonth" placeholder="MM" maxLength={2} value={formData.endMonth} onChange={handleChange} className="w-1/3 p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none disabled:opacity-50" />
                  <input disabled={formData.isCurrentRole} required={!formData.isCurrentRole} name="endYear" placeholder="YYYY" maxLength={4} value={formData.endYear} onChange={handleChange} className="w-2/3 p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none disabled:opacity-50" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" id="isCurrentRole" name="isCurrentRole" checked={formData.isCurrentRole} onChange={handleChange} className="w-4 h-4 rounded" />
              <label htmlFor="isCurrentRole" className="text-sm">Actualmente en este puesto</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contexto</label>
              <textarea name="context" value={formData.context} onChange={handleChange} rows={3} className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Logros Destacados</label>
              <div className="flex gap-2 mb-2">
                <input 
                  value={highlightInput} 
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                  className="flex-1 p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
                  placeholder="Añade un logro..."
                />
                <button type="button" onClick={handleAddHighlight} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors">Añadir</button>
              </div>
              <ul className="flex flex-col gap-2">
                {formData.highlights.map((h, i) => (
                  <li key={i} className="flex justify-between items-center bg-surface-deep p-2 rounded border border-white/5">
                    <span className="text-sm text-gray-300">{h}</span>
                    <button type="button" onClick={() => handleRemoveHighlight(i)} className="text-red-400 hover:text-red-300 text-sm ml-4">✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-surface-card">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-300 hover:bg-white/5 rounded transition-colors">Cancelar</button>
          <button type="submit" form="work-form" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
};
