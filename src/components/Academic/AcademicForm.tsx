import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { Education } from '../../types/Data';

export interface AcademicFormProps {
  onCancel: () => void;
  onAdd: (data: Education) => void;
  initialData?: Education | null;
}

const AcademicForm: React.FC<AcademicFormProps> = ({ onCancel, onAdd, initialData }) => {
  const [institution, setInstitution] = useState(initialData?.institution || '');
  const [area, setArea] = useState(initialData?.area || '');
  const [studyType, setStudyType] = useState(initialData?.studyType || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [isCurrent, setIsCurrent] = useState(!initialData?.endDate && initialData ? true : false);
  const [url, setUrl] = useState(initialData?.url || '');
  const [score, setScore] = useState(initialData?.score || '');
  const [courses, setCourses] = useState(
    initialData?.courses?.length ? initialData.courses.map((value, i) => ({ id: Date.now() + i, value })) : []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: initialData?.id || Date.now().toString(),
      institution,
      url,
      area,
      studyType,
      startDate,
      endDate: isCurrent ? '' : endDate,
      score,
      courses: courses.map(c => c.value).filter(v => v.trim() !== '')
    });
  };

  const handleCourseChange = (id: number, value: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, value } : c));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Institución *</label>
          <input required value={institution} onChange={e => setInstitution(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Universidad Politécnica" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Área de estudio (Título) *</label>
          <input required value={area} onChange={e => setArea(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Ingeniería Informática" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Tipo de estudio (Opcional)</label>
          <input value={studyType} onChange={e => setStudyType(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Grado, Máster..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Nota / Score (Opcional)</label>
          <input value={score} onChange={e => setScore(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. 9.5, Sobresaliente..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Fecha de Inicio *</label>
          <input required value={startDate} onChange={e => setStartDate(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Sep 2016" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Fecha de Fin</label>
          <input required={!isCurrent} disabled={isCurrent} value={isCurrent ? '' : endDate} onChange={e => setEndDate(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50" placeholder="Ej. Jun 2020" />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="acaCurrent" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} className="w-4 h-4 bg-[#020617] border-[#1E293B] rounded text-blue-600 focus:ring-blue-500" />
            <label htmlFor="acaCurrent" className="text-sm font-medium text-[#8c909f]">Cursando actualmente</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8c909f] mb-1">URL (Opcional)</label>
        <input value={url} onChange={e => setUrl(e.target.value)} type="url" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. https://universidad.com" />
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-[#8c909f]">Cursos Relevantes (Opcional)</label>
          <button type="button" onClick={() => setCourses([...courses, { id: Date.now(), value: '' }])} className="text-blue-400 hover:text-blue-300">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {courses.map((c) => (
            <div key={c.id} className="flex gap-2">
              <input type="text" value={c.value} onChange={e => handleCourseChange(c.id, e.target.value)} className="flex-1 bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Estructuras de Datos Avanzadas" />
              <button type="button" onClick={() => setCourses(courses.filter(a => a.id !== c.id))} className="p-2 text-red-400 hover:bg-[#1E293B] rounded-md transition-colors">
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

export default AcademicForm;
