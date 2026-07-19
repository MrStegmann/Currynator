import React from 'react';
import type { EducationCardProps } from '../../types/Education.types';

export const EducationCard: React.FC<EducationCardProps> = ({ education, onEdit, onDelete }) => {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-lg p-4 mb-3 flex flex-row justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">
          {education.degreeName} <span className="text-sm font-normal text-gray-400 ml-2">({education.currentStudy ? 'Actualmente' : education.graduationYear})</span>
        </h2>
        <h3 className="text-md font-medium text-blue-400">{education.institutionName}</h3>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(education.id)}
          className="px-3 py-1 bg-surface-deep hover:bg-white/10 text-white text-sm rounded transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={() => {
            if(window.confirm('¿Estás seguro de que deseas eliminar esta educación?')) {
              onDelete(education.id);
            }
          }}
          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm rounded transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
