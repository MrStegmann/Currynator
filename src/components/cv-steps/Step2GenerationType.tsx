import React from 'react';

export type GenerationType = 'general' | 'specific' | null;

interface Step2GenerationTypeProps {
  generationType: GenerationType;
  onChange: (type: GenerationType) => void;
}

const Step2GenerationType: React.FC<Step2GenerationTypeProps> = ({ generationType, onChange }) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#d3e4fe]">2. Tipo de Optimización</h2>
      <p className="text-sm text-[#8c909f]">¿Quieres optimizar el currículum de manera general o adaptarlo para una oferta de empleo específica?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div
          onClick={() => onChange('general')}
          className={`p-6 rounded-lg border cursor-pointer transition-all flex flex-col gap-3 ${generationType === 'general'
              ? 'border-[#3B82F6] bg-slate-900 shadow-lg shadow-[#3B82F6]/10'
              : 'border-[#1E293B] bg-[#020617] hover:bg-slate-900'
            }`}
        >
          <h3 className="text-xl font-bold text-[#d3e4fe]">Generación General</h3>
          <p className="text-sm text-[#8c909f]">Mejora general del currículum actual. Refina las descripciones, aplica la metodología STAR a la experiencia e incrementa el impacto profesional sin enfocar en una empresa concreta.</p>
        </div>

        <div
          onClick={() => onChange('specific')}
          className={`p-6 rounded-lg border cursor-pointer transition-all flex flex-col gap-3 ${generationType === 'specific'
              ? 'border-[#3B82F6] bg-slate-900 shadow-lg shadow-[#3B82F6]/10'
              : 'border-[#1E293B] bg-[#020617] hover:bg-slate-900'
            }`}
        >
          <h3 className="text-xl font-bold text-[#d3e4fe]">Puesto Específico</h3>
          <p className="text-sm text-[#8c909f]">Adapta totalmente el currículum para una oferta de empleo. Destaca las habilidades y la experiencia más relevante para coincidir con las palabras clave y requisitos de la vacante.</p>
        </div>
      </div>
    </div>
  );
};

export default Step2GenerationType;
