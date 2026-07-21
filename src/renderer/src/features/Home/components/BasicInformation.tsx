import React, { useState, useEffect } from 'react';
import type { BasicInformationState, BasicInformationProps } from '../types/BasicInformation.types';

export const BasicInformation: React.FC<BasicInformationProps> = ({ state, onSave }) => {
  const [localState, setLocalState] = useState<BasicInformationState>(state);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalState(state);
    setIsDirty(false);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalState(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleCancel = () => {
    setLocalState(state);
    setIsDirty(false);
  };

  const handleSave = () => {
    onSave(localState);
    setIsDirty(false);
  };

  const inputClass = "w-full p-2.5 rounded bg-[#000000] border border-[#38434f] focus:border-[#70b5f9] outline-none text-[#e9eaec] transition-colors";
  const labelClass = "block text-sm font-medium mb-1.5 text-[#e9eaec]/80";

  return (
    <div className="w-full bg-[#1d2226] rounded-lg border border-[#38434f] p-6 shadow-sm">
      <div className="pb-4 mb-6 flex justify-between items-center border-b border-[#38434f]">
        <h2 className="text-xl font-semibold">Información Básica</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input name="firstName" value={localState.firstName || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Apellido</label>
            <input name="lastName" value={localState.lastName || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" value={localState.email || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex gap-4">
             <div className="w-1/3">
                <label className={labelClass}>Prefijo</label>
                <input name="phonePrefix" placeholder="+34" value={localState.phonePrefix || ''} onChange={handleChange} className={inputClass} />
             </div>
             <div className="w-2/3">
                <label className={labelClass}>Teléfono</label>
                <input name="phoneNumber" type="tel" value={localState.phoneNumber || ''} onChange={handleChange} className={inputClass} />
             </div>
          </div>
          <div>
            <label className={labelClass}>País</label>
            <input name="country" value={localState.country || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input name="city" value={localState.city || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Título Profesional</label>
            <input name="professionalTitle" value={localState.professionalTitle || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Resumen Profesional</label>
            <textarea name="context" value={localState.context || ''} onChange={handleChange} rows={7} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>GitHub Profile URL</label>
            <input name="githubUrl" type="url" value={localState.githubUrl || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn Profile URL</label>
            <input name="linkedinUrl" type="url" value={localState.linkedinUrl || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Website / Portfolio URL</label>
            <input name="websiteUrl" type="url" value={localState.websiteUrl || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </div>
      
      {isDirty && (
        <div className="mt-8 pt-4 border-t border-[#38434f] flex justify-end gap-3">
          <button onClick={handleCancel} className="px-5 py-2 border border-[#38434f] hover:bg-white/5 text-[#e9eaec] font-semibold rounded-full transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full transition-colors">
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};
