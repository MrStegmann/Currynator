import React from 'react';
import { Bot, Save } from 'lucide-react';
import type { DataProfile } from '../../types/Data';

interface Step6EditorProps {
  profileData: DataProfile & { razonamiento_ia?: string };
  onChange: (profile: DataProfile) => void;
  onSave: () => void;
}

const Step6Editor: React.FC<Step6EditorProps> = ({ profileData, onChange, onSave }) => {
  const handleBasicsChange = (field: string, value: string) => {
    onChange({
      ...profileData,
      basics: { ...profileData.basics, [field]: value }
    });
  };

  const handleWorkChange = (idx: number, field: string, value: string) => {
    const newWork = [...profileData.work];
    newWork[idx] = { ...newWork[idx], [field]: value };
    onChange({ ...profileData, work: newWork });
  };

  const handleWorkHighlightChange = (workIdx: number, hlIdx: number, value: string) => {
    const newWork = [...profileData.work];
    const newHighlights = [...newWork[workIdx].highlights];
    newHighlights[hlIdx] = value;
    newWork[workIdx] = { ...newWork[workIdx], highlights: newHighlights };
    onChange({ ...profileData, work: newWork });
  };



  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#d3e4fe]">6. Revisión y Edición Final</h2>
          <p className="text-sm text-[#8c909f]">Revisa los cambios realizados por la IA. Puedes editar cualquier campo directamente.</p>
        </div>
        <button
          onClick={onSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-md"
        >
          <Save size={18} /> Guardar
        </button>
      </div>

      {profileData.razonamiento_ia && (
        <div className="bg-[#1E293B]/60 border border-[#3B82F6]/50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="text-[#3B82F6]" size={24} />
            <h3 className="text-lg font-bold text-[#d3e4fe]">Razonamiento de la IA</h3>
          </div>
          <p className="text-sm text-[#c2c6d6] whitespace-pre-wrap">{profileData.razonamiento_ia}</p>
        </div>
      )}

      {/* Editor ATS Friendly (One Column) */}
      <div className="flex flex-col gap-6 bg-[#020617] border border-[#1E293B] rounded-lg p-6">

        {/* BASICS */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6">
          <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Perfil Principal</h3>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8c909f]">Label (Puesto)</label>
            <input
              value={profileData.basics.label}
              onChange={(e) => handleBasicsChange('label', e.target.value)}
              className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8c909f]">Resumen Profesional (Summary)</label>
            <textarea
              value={profileData.basics.summary}
              onChange={(e) => handleBasicsChange('summary', e.target.value)}
              rows={6}
              className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none resize-y"
            />
          </div>
        </div>

        {/* WORK EXPERIENCE */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6">
          <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Experiencia Laboral</h3>

          {profileData.work.map((w, wIdx) => (
            <div key={w.id || wIdx} className="flex flex-col gap-4 bg-slate-900 p-4 rounded-md border border-[#1E293B]">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#8c909f]">Puesto en {w.name}</label>
                <input
                  value={w.position}
                  onChange={(e) => handleWorkChange(wIdx, 'position', e.target.value)}
                  className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#8c909f]">Resumen del Puesto</label>
                <textarea
                  value={w.summary}
                  onChange={(e) => handleWorkChange(wIdx, 'summary', e.target.value)}
                  rows={3}
                  className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none resize-y"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#8c909f]">Logros Clave (Highlights)</label>
                {w.highlights.map((hl, hlIdx) => (
                  <textarea
                    key={hlIdx}
                    value={hl}
                    onChange={(e) => handleWorkHighlightChange(wIdx, hlIdx, e.target.value)}
                    rows={2}
                    className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none resize-y"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SKILLS */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-[#d3e4fe] border-l-4 border-[#3B82F6] pl-3">Habilidades Clave</h3>

          {profileData.skills.map((skill, sIdx) => (
            <div key={sIdx} className="flex flex-col gap-2 bg-slate-900 p-4 rounded-md border border-[#1E293B]">
              <label className="text-sm font-medium text-[#8c909f]">Categoría: {skill.name}</label>
              <input
                value={skill.keywords.join(', ')}
                onChange={(e) => {
                  const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
                  const newSkills = [...profileData.skills];
                  newSkills[sIdx] = { ...newSkills[sIdx], keywords };
                  onChange({ ...profileData, skills: newSkills });
                }}
                className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 text-[#d3e4fe] focus:border-[#3B82F6] outline-none"
              />
              <p className="text-xs text-[#8c909f]">Separadas por comas</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Step6Editor;
