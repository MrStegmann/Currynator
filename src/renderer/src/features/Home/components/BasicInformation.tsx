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

  return (
    <div className="w-full mb-6">
      <div className="border-b-2 border-white/20 pb-2 mb-3">
        <h2 className="text-xl font-semibold text-left">Información Básica</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input 
              name="firstName" 
              value={localState.firstName || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input 
              name="lastName" 
              value={localState.lastName || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              name="email" 
              type="email"
              value={localState.email || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <input 
              name="country" 
              value={localState.country || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input 
              name="city" 
              value={localState.city || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Título Profesional</label>
            <input 
              name="professionalTitle" 
              value={localState.professionalTitle || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resumen Profesional</label>
            <textarea 
              name="context" 
              value={localState.context || ''} 
              onChange={handleChange} 
              rows={4}
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none resize-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub Profile URL</label>
            <input 
              name="githubUrl" 
              type="url"
              value={localState.githubUrl || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn Profile URL</label>
            <input 
              name="linkedinUrl" 
              type="url"
              value={localState.linkedinUrl || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website / Portfolio URL</label>
            <input 
              name="websiteUrl" 
              type="url"
              value={localState.websiteUrl || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" 
            />
          </div>
        </div>
      </div>
      {isDirty && (
        <div className="mt-4 flex justify-end gap-3">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white font-medium rounded transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};
