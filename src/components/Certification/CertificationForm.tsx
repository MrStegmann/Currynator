import React, { useState } from 'react';
import type { Certificate } from '../../types/Data';

export interface CertificationFormProps {
  onCancel: () => void;
  onAdd: (data: Certificate) => void;
  initialData?: Certificate | null;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onCancel, onAdd, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [issuer, setIssuer] = useState(initialData?.issuer || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [url, setUrl] = useState(initialData?.url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: initialData?.id || Date.now().toString(),
      name,
      issuer,
      date,
      url
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Nombre *</label>
          <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. AWS Certified Developer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Emisor *</label>
          <input required value={issuer} onChange={e => setIssuer(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Amazon Web Services" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">Fecha de Emisión *</label>
          <input required value={date} onChange={e => setDate(e.target.value)} type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. Jun 2023" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8c909f] mb-1">URL de Credencial</label>
          <input value={url} onChange={e => setUrl(e.target.value)} type="url" className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://" />
        </div>
      </div>

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

export default CertificationForm;
