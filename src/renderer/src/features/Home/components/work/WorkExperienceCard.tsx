import React from 'react';
import type { WorkExperienceCardProps } from '../../types/WorkExperience.types';

export const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({ experience, onEdit, onDelete }) => {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-lg p-4 mb-3">
      {/* First Row */}
      <div className="flex flex-row justify-between items-start mb-1">
        <h2 className="text-lg font-bold text-white">{experience.jobTitle}</h2>
        <div className="text-sm text-gray-400">
          {experience.startMonth}/{experience.startYear} - {experience.isCurrentRole ? 'Actualmente' : `${experience.endMonth}/${experience.endYear}`}
        </div>
      </div>
      {/* Second Row */}
      <h3 className="text-md font-medium text-blue-400 mb-3">{experience.companyName}</h3>

      {/* Body */}
      <div className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">
        {experience.context}
      </div>
      {experience.highlights && experience.highlights.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-300 mb-4">
          {experience.highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => onEdit(experience.id)}
          className="px-3 py-1 bg-surface-deep hover:bg-white/10 text-white text-sm rounded transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={() => {
            if(window.confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
              onDelete(experience.id);
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
