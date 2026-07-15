import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { DataProfile } from '../../types/Data';
import { Plus, Trash2, Save } from 'lucide-react';

interface EditCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: DataProfile | null;
  onSave: (editedData: DataProfile) => void;
}

const EditCVModal: React.FC<EditCVModalProps> = ({ isOpen, onClose, cvData, onSave }) => {
  const [formData, setFormData] = useState<DataProfile | null>(null);

  useEffect(() => {
    if (cvData) {
      const data = JSON.parse(JSON.stringify(cvData)); // Deep copy
      // Initialize missing sections to avoid undefined crashes
      if (!data.basics) data.basics = {};
      if (!data.work) data.work = [];
      if (!data.education) data.education = [];
      if (!data.skills) data.skills = [];
      if (!data.languages) data.languages = [];
      setFormData(data);
    }
  }, [cvData]);

  if (!isOpen || !formData) return null;

  const handleBasicsChange = (field: string, value: string) => {
    setFormData(prev => prev ? { ...prev, basics: { ...(prev.basics || {}), [field]: value } as any } : null);
  };

  const handleArrayItemChange = (section: keyof DataProfile, index: number, field: string, value: any) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[section] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const handleArrayStringItemChange = (section: keyof DataProfile, index: number, arrayField: string, strIndex: number, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[section] as any[])];
      const newStringArray = [...newArray[index][arrayField]];
      newStringArray[strIndex] = value;
      newArray[index] = { ...newArray[index], [arrayField]: newStringArray };
      return { ...prev, [section]: newArray };
    });
  };

  const handleAddStringItem = (section: keyof DataProfile, index: number, arrayField: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[section] as any[])];
      const newStringArray = [...(newArray[index][arrayField] || []), ""];
      newArray[index] = { ...newArray[index], [arrayField]: newStringArray };
      return { ...prev, [section]: newArray };
    });
  };

  const handleRemoveStringItem = (section: keyof DataProfile, index: number, arrayField: string, strIndex: number) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[section] as any[])];
      const newStringArray = [...newArray[index][arrayField]];
      newStringArray.splice(strIndex, 1);
      newArray[index] = { ...newArray[index], [arrayField]: newStringArray };
      return { ...prev, [section]: newArray };
    });
  };

  const handleAddItem = (section: keyof DataProfile, emptyItem: any) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[section] as any[]) || [], emptyItem];
      return { ...prev, [section]: newArray };
    });
  };

  const handleRemoveItem = (section: keyof DataProfile, index: number) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[section] as any[])];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar CV: ${formData.basics?.name || 'Currículum'}`}>
      <div className="flex flex-col gap-8 pb-4">

        {/* BASICS */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6">
          <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Perfil Principal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#8c909f]">Nombre</label>
              <input
                value={formData.basics?.name || ''}
                onChange={(e) => handleBasicsChange('name', e.target.value)}
                className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#8c909f]">Título (Label)</label>
              <input
                value={formData.basics?.label || ''}
                onChange={(e) => handleBasicsChange('label', e.target.value)}
                className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#8c909f]">Email</label>
              <input
                value={formData.basics?.email || ''}
                onChange={(e) => handleBasicsChange('email', e.target.value)}
                className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#8c909f]">Teléfono</label>
              <input
                value={formData.basics?.phone || ''}
                onChange={(e) => handleBasicsChange('phone', e.target.value)}
                className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8c909f]">Resumen Profesional</label>
            <textarea
              value={formData.basics?.summary || ''}
              onChange={(e) => handleBasicsChange('summary', e.target.value)}
              rows={4}
              className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none resize-y"
            />
          </div>
        </div>

        {/* WORK EXPERIENCE */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Experiencia Laboral</h3>
            <button onClick={() => handleAddItem('work', { name: '', position: '', startDate: '', endDate: '', summary: '', highlights: [] })} className="flex items-center gap-1 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md transition-colors">
              <Plus size={16} /> Añadir
            </button>
          </div>
          {(formData.work || []).map((w, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-4 bg-slate-900 p-4 rounded-md border border-[#1E293B] relative">
              <button onClick={() => handleRemoveItem('work', wIdx)} className="absolute top-4 right-4 text-[#ef4444] hover:text-red-400 p-1">
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Empresa</label>
                  <input value={w.name || ''} onChange={(e) => handleArrayItemChange('work', wIdx, 'name', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Puesto</label>
                  <input value={w.position || ''} onChange={(e) => handleArrayItemChange('work', wIdx, 'position', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Fecha Inicio</label>
                  <input value={w.startDate || ''} onChange={(e) => handleArrayItemChange('work', wIdx, 'startDate', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Fecha Fin</label>
                  <input value={w.endDate || ''} onChange={(e) => handleArrayItemChange('work', wIdx, 'endDate', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#8c909f]">Resumen</label>
                <textarea value={w.summary || ''} onChange={(e) => handleArrayItemChange('work', wIdx, 'summary', e.target.value)} rows={2} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none resize-y" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-[#8c909f]">Logros (Highlights)</label>
                  <button onClick={() => handleAddStringItem('work', wIdx, 'highlights')} className="text-xs text-blue-400 hover:text-blue-300">Añadir Logro</button>
                </div>
                {(w.highlights || []).map((hl: string, hlIdx: number) => (
                  <div key={hlIdx} className="flex gap-2 items-start">
                    <textarea value={hl} onChange={(e) => handleArrayStringItemChange('work', wIdx, 'highlights', hlIdx, e.target.value)} rows={1} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-1.5 text-sm text-[#d3e4fe] focus:border-[#3B82F6] outline-none resize-y" />
                    <button onClick={() => handleRemoveStringItem('work', wIdx, 'highlights', hlIdx)} className="text-[#8c909f] hover:text-red-400 p-1 mt-1"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* EDUCATION */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Educación</h3>
            <button onClick={() => handleAddItem('education', { institution: '', area: '', studyType: '', startDate: '', endDate: '' })} className="flex items-center gap-1 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md transition-colors">
              <Plus size={16} /> Añadir
            </button>
          </div>
          {(formData.education || []).map((ed, eIdx) => (
            <div key={eIdx} className="flex flex-col gap-4 bg-slate-900 p-4 rounded-md border border-[#1E293B] relative">
              <button onClick={() => handleRemoveItem('education', eIdx)} className="absolute top-4 right-4 text-[#ef4444] hover:text-red-400 p-1">
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Institución</label>
                  <input value={ed.institution || ''} onChange={(e) => handleArrayItemChange('education', eIdx, 'institution', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Área/Carrera</label>
                  <input value={ed.area || ''} onChange={(e) => handleArrayItemChange('education', eIdx, 'area', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Tipo de Estudio</label>
                  <input value={ed.studyType || ''} onChange={(e) => handleArrayItemChange('education', eIdx, 'studyType', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Fechas</label>
                  <div className="flex gap-2">
                    <input value={ed.startDate || ''} placeholder="Inicio" onChange={(e) => handleArrayItemChange('education', eIdx, 'startDate', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                    <input value={ed.endDate || ''} placeholder="Fin" onChange={(e) => handleArrayItemChange('education', eIdx, 'endDate', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SKILLS */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Habilidades</h3>
            <button onClick={() => handleAddItem('skills', { name: '', level: '', keywords: [] })} className="flex items-center gap-1 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md transition-colors">
              <Plus size={16} /> Añadir
            </button>
          </div>
          {(formData.skills || []).map((sk, sIdx) => (
            <div key={sIdx} className="flex flex-col gap-3 bg-slate-900 p-4 rounded-md border border-[#1E293B] relative">
              <button onClick={() => handleRemoveItem('skills', sIdx)} className="absolute top-4 right-4 text-[#ef4444] hover:text-red-400 p-1">
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Categoría</label>
                  <input value={sk.name || ''} onChange={(e) => handleArrayItemChange('skills', sIdx, 'name', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8c909f]">Keywords (Separadas por comas)</label>
                  <input
                    value={(sk.keywords || []).join(', ')}
                    onChange={(e) => handleArrayItemChange('skills', sIdx, 'keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                    className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LANGUAGES */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Idiomas</h3>
            <button onClick={() => handleAddItem('languages', { language: '', fluency: '' })} className="flex items-center gap-1 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md transition-colors">
              <Plus size={16} /> Añadir
            </button>
          </div>
          {(formData.languages || []).map((lang, lIdx) => (
            <div key={lIdx} className="flex gap-4 items-end bg-slate-900 p-4 rounded-md border border-[#1E293B]">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[#8c909f]">Idioma</label>
                <input value={lang.language || ''} onChange={(e) => handleArrayItemChange('languages', lIdx, 'language', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[#8c909f]">Nivel</label>
                <input value={lang.fluency || ''} onChange={(e) => handleArrayItemChange('languages', lIdx, 'fluency', e.target.value)} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-3 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none" />
              </div>
              <button onClick={() => handleRemoveItem('languages', lIdx)} className="text-[#ef4444] hover:text-red-400 p-2 mb-1">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-md"
          >
            <Save size={18} /> Guardar Cambios
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCVModal;
