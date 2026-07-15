import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { Work } from '../../types/Data';

export interface ExperienceFormProps {
  onCancel: () => void;
  onAdd: (data: Work) => void;
  initialData?: Work | null;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ onCancel, onAdd, initialData }) => {
  const [position, setPosition] = useState(initialData?.position || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [isCurrent, setIsCurrent] = useState(!initialData?.endDate && initialData ? true : false);
  const [name, setName] = useState(initialData?.name || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [highlights, setHighlights] = useState(
    initialData?.highlights?.length ? initialData.highlights.map((value, i) => ({ id: Date.now() + i, value })) : [{ id: Date.now(), value: '' }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: initialData?.id || Date.now().toString(),
      name,
      position,
      url,
      startDate,
      endDate: isCurrent ? '' : endDate,
      summary,
      highlights: highlights.map(h => h.value).filter(v => v.trim() !== '')
    });
  };

  const handleHighlightChange = (id: number, value: string) => {
    setHighlights(prev => prev.map(h => h.id === id ? { ...h, value } : h));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Empresa *</label>
          <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. TechCorp Inc." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Puesto *</label>
          <input required value={position} onChange={e => setPosition(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Ingeniero de Software" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Fecha de Inicio *</label>
          <input required value={startDate} onChange={e => setStartDate(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Ene 2020" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Fecha de Fin</label>
          <input required={!isCurrent} disabled={isCurrent} value={isCurrent ? '' : endDate} onChange={e => setEndDate(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50" placeholder="Ej. Dic 2023" />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="expCurrent" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} className="w-4 h-4 bg-[#020617] border-[#1E293B] rounded text-blue-600 focus:ring-blue-500" />
            <label htmlFor="expCurrent" className="text-sm font-medium text-[#8c909f]">Trabajo actual</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8c909f] mb-1">URL (Opcional)</label>
        <input value={url} onChange={e => setUrl(e.target.value)} type="url" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. https://empresa.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8c909f] mb-1">Resumen (Opcional)</label>
        <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Describe brevemente el puesto..." />
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-[#8c909f]">Logros / Highlights (Método STAR)</label>
          <button type="button" onClick={() => setHighlights([...highlights, { id: Date.now(), value: '' }])} className="text-blue-400 hover:text-blue-300">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {highlights.map((h) => (
            <div key={h.id} className="flex gap-2">
              <input type="text" value={h.value} onChange={e => handleHighlightChange(h.id, e.target.value)} className="flex-1 bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Aumenté las ventas un 20%..." />
              <button type="button" onClick={() => setHighlights(highlights.filter(a => a.id !== h.id))} className="p-2 text-red-400 hover:bg-[#1E293B] rounded-md transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Modal */}
      <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-[#1E293B]">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md font-medium text-white border border-[#1E293B] hover:bg-[#1E293B] transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors">
          {initialData ? 'Guardar' : 'Añadir'}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;
