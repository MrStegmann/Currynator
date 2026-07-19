import React, { useState, useEffect } from 'react';
import type { Certification, CertificationFormModalProps } from '../../types/Certification.types';

export const CertificationFormModal: React.FC<CertificationFormModalProps> = ({ certification, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Certification>({
    id: '',
    certificationName: '',
    issuingOrganization: '',
    grantedYear: '',
    currentStudy: false
  });

  useEffect(() => {
    if (certification) {
      setFormData(certification);
    } else {
      setFormData(prev => ({ ...prev, id: crypto.randomUUID() }));
    }
  }, [certification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(checked ? { grantedYear: '' } : {})
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-card border border-border-subtle rounded-xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold">{certification ? 'Editar' : 'Añadir'} Certificado</h2>
        </div>
        
        <div className="p-6">
          <form id="certification-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Certificado *</label>
              <input required name="certificationName" value={formData.certificationName} onChange={handleChange} className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organización Emisora *</label>
              <input required name="issuingOrganization" value={formData.issuingOrganization} onChange={handleChange} className="w-full p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Año de Emisión</label>
              <input 
                disabled={formData.currentStudy} 
                required={!formData.currentStudy} 
                name="grantedYear" 
                placeholder="YYYY" 
                maxLength={4} 
                value={formData.grantedYear} 
                onChange={handleChange} 
                className="w-1/2 p-2 rounded bg-surface-deep border border-border-subtle focus:border-primary outline-none disabled:opacity-50" 
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="currentStudyCert" name="currentStudy" checked={formData.currentStudy} onChange={handleChange} className="w-4 h-4 rounded" />
              <label htmlFor="currentStudyCert" className="text-sm">En progreso (no finalizado)</label>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-surface-card">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-300 hover:bg-white/5 rounded transition-colors">Cancelar</button>
          <button type="submit" form="certification-form" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
};
