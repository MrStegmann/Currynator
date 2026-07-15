import React from 'react';

export interface JobDetails {
  companyName: string;
  jobTitle: string;
  companyInfo: string;
  companyUrl: string;
  jobFunctions: string;
  jobRequirements: string;
}

interface Step3JobDetailsProps {
  details: JobDetails;
  onChange: (details: JobDetails) => void;
}

const Step3JobDetails: React.FC<Step3JobDetailsProps> = ({ details, onChange }) => {
  const handleChange = (field: keyof JobDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#d3e4fe]">3. Detalles de la Oferta (Opcional pero recomendado)</h2>
      <p className="text-sm text-[#8c909f]">Rellena los detalles de la oferta de trabajo para que la IA pueda adaptar el currículum de la manera más efectiva posible.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Nombre de la Empresa</label>
          <input
            value={details.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            type="text"
            className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors"
            placeholder="Ej. Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">URL de la Empresa</label>
          <input
            value={details.companyUrl}
            onChange={(e) => handleChange('companyUrl', e.target.value)}
            type="url"
            className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors"
            placeholder="https://acme.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Puesto de Trabajo</label>
          <input
            value={details.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            type="text"
            className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors"
            placeholder="Ej. Senior Frontend Developer"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Quiénes Son (Sobre la empresa)</label>
          <textarea
            value={details.companyInfo}
            onChange={(e) => handleChange('companyInfo', e.target.value)}
            rows={3}
            className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors resize-y"
            placeholder="Pega aquí la descripción de la empresa de la oferta..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Funciones del Puesto</label>
          <textarea
            value={details.jobFunctions}
            onChange={(e) => handleChange('jobFunctions', e.target.value)}
            rows={4}
            className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors resize-y"
            placeholder="Pega aquí las responsabilidades o funciones del puesto..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Requisitos del Puesto</label>
          <textarea
            value={details.jobRequirements}
            onChange={(e) => handleChange('jobRequirements', e.target.value)}
            rows={4}
            className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors resize-y"
            placeholder="Pega aquí los requisitos, experiencia esperada y tecnologías requeridas..."
          />
        </div>
      </div>
    </div>
  );
};

export default Step3JobDetails;
