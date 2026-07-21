import React, { useState, useEffect, useRef } from 'react';
import type { BasicInformationState, BasicInformationProps } from '../types/BasicInformation.types';

export const BasicInformation: React.FC<BasicInformationProps> = ({ state, onSave }) => {
  const [localState, setLocalState] = useState<BasicInformationState>(state);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalState(state);
    setIsDirty(false);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalState(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalState(prev => ({ ...prev, avatarUrl: reader.result as string }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
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

      <div className="flex flex-col gap-6 w-full">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row gap-8 w-full items-start">
          {/* Avatar Column */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
             <div 
               className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#38434f] bg-[#000000] cursor-pointer group flex items-center justify-center"
               onClick={handleAvatarClick}
             >
               {localState.avatarUrl ? (
                 <img src={localState.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <svg className="w-12 h-12 text-[#e9eaec]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
               )}
               {/* Hover overlay */}
               <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
                 <span className="text-white text-xs font-semibold">Cambiar</span>
               </div>
             </div>
             <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
             />
          </div>
          
          {/* Details Column */}
          <div className="flex-grow flex flex-col gap-4 w-full">
            <div>
              <label className={labelClass}>Nombre Completo</label>
              <input name="fullName" value={localState.fullName || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Título Profesional</label>
              <input name="professionalTitle" value={localState.professionalTitle || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>País</label>
                <input name="country" value={localState.country || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ciudad</label>
                <input name="city" value={localState.city || ''} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-2 pt-6 border-t border-[#38434f]/50">
          {/* Contact Column */}
          <div className="flex flex-col gap-4">
             <h3 className="text-lg font-medium text-[#e9eaec]/90 mb-2">Contacto</h3>
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
          </div>

          {/* Social Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-[#e9eaec]/90 mb-2">Enlaces</h3>
            <div>
              <label className={labelClass}>LinkedIn Profile URL</label>
              <input name="linkedinUrl" type="url" value={localState.linkedinUrl || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>GitHub Profile URL</label>
              <input name="githubUrl" type="url" value={localState.githubUrl || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Website / Portfolio URL</label>
              <input name="websiteUrl" type="url" value={localState.websiteUrl || ''} onChange={handleChange} className={inputClass} />
            </div>
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

