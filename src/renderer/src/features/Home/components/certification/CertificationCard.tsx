import React from 'react';
import type { CertificationCardProps } from '../../types/Certification.types';

export const CertificationCard: React.FC<CertificationCardProps> = ({ certification, onEdit, onDelete }) => {
  return (
    <div className="border-b border-[#38434f] py-4 mb-2 last:border-b-0 last:pb-0 flex flex-row justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-[#e9eaec] mb-1">
          {certification.certificationName} <span className="text-sm font-normal text-[#e9eaec]/60 ml-2">({certification.currentStudy ? 'En progreso' : certification.grantedYear})</span>
        </h2>
        <h3 className="text-md font-medium text-[#e9eaec]/90">{certification.issuingOrganization}</h3>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(certification.id)}
          className="px-4 py-1.5 hover:bg-[#38434f] text-[#e9eaec] font-semibold text-sm rounded-full transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={() => {
            if(window.confirm('¿Estás seguro de que deseas eliminar este certificado?')) {
              onDelete(certification.id);
            }
          }}
          className="px-4 py-1.5 hover:bg-red-500/10 text-red-400 font-semibold text-sm rounded-full transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
