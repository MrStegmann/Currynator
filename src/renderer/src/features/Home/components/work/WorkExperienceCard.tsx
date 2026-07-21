import React from 'react';
import type { WorkExperienceCardProps } from '../../types/WorkExperience.types';

export const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({ experience, onEdit, onDelete }) => {
  return (
    <div className="border-b border-[#38434f] py-4 mb-2 last:border-b-0 last:pb-0">
      {/* First Row */}
      <div className="flex flex-row justify-between items-start mb-1">
        <h2 className="text-lg font-bold text-[#e9eaec]">{experience.jobTitle}</h2>
        <div className="text-sm text-[#e9eaec]/60">
          {experience.startMonth}/{experience.startYear} - {experience.isCurrentRole ? 'Actualmente' : `${experience.endMonth}/${experience.endYear}`}
        </div>
      </div>
      {/* Second Row */}
      <h3 className="text-md font-medium text-[#e9eaec]/90 mb-3">{experience.companyName}</h3>

      {/* Body */}
      <div className="text-sm text-[#e9eaec]/80 mb-3 whitespace-pre-wrap">
        {experience.context}
      </div>
      {experience.highlights && experience.highlights.length > 0 && (
        <ul className="list-disc list-inside text-sm text-[#e9eaec]/80 mb-4">
          {experience.highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => onEdit(experience.id)}
          className="px-4 py-1.5 hover:bg-[#38434f] text-[#e9eaec] font-semibold text-sm rounded-full transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={() => {
            if(window.confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
              onDelete(experience.id);
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
