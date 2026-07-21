import React, { useState, useEffect } from 'react';
import type { BasicInformationState } from '../types/BasicInformation.types';

export interface SummarySectionProps {
  state: BasicInformationState;
  onSave: (state: BasicInformationState) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ state, onSave }) => {
  const [localState, setLocalState] = useState<BasicInformationState>(state);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalState(state);
    setIsDirty(false);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  
  return (
    <div className="w-full bg-[#1d2226] rounded-lg border border-[#38434f] p-6 shadow-sm">
      <div className="pb-4 mb-4 flex justify-between items-center border-b border-[#38434f]">
        <h2 className="text-xl font-semibold">Resumen Profesional</h2>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <textarea 
          name="context" 
          value={localState.context || ''} 
          onChange={handleChange} 
          rows={7} 
          className={`${inputClass} resize-none`} 
          placeholder="Escribe un breve resumen de tu perfil profesional..."
        />
      </div>
      
      {isDirty && (
        <div className="mt-6 pt-4 border-t border-[#38434f] flex justify-end gap-3">
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
