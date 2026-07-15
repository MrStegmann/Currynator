import React from 'react';
import { Pencil, Trash2, Building, Calendar, Link as LinkIcon } from 'lucide-react';
import type { Work } from '../../types/Data';

interface ExperienceCardProps extends Work {
  onEdit: () => void;
  onDelete: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  name,
  position,
  url,
  startDate,
  endDate,
  summary,
  highlights,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-slate-900 border border-[#1E293B] rounded-lg p-5 flex flex-col gap-3 relative group">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 bg-[#1E293B] hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm" title="Editar">
          <Pencil size={16} />
        </button>
        <button onClick={onDelete} className="p-2 bg-[#1E293B] hover:bg-red-500 text-white rounded-md transition-colors shadow-sm" title="Eliminar">
          <Trash2 size={16} />
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#d3e4fe] pr-20">{position}</h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#8c909f] mt-1">
          <div className="flex items-center gap-1">
            <Building size={14} className="text-blue-400" />
            <span>{name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-blue-400" />
            <span>{startDate} — {endDate ? endDate : 'Presente'}</span>
          </div>
          {url && (
            <div className="flex items-center gap-1">
              <LinkIcon size={14} className="text-blue-400" />
              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a>
            </div>
          )}
        </div>
      </div>

      {summary && (
        <p className="text-sm text-[#c2c6d6] leading-relaxed">
          {summary}
        </p>
      )}

      {highlights && highlights.length > 0 && (
        <ul className="list-disc list-inside text-sm text-[#c2c6d6] flex flex-col gap-1 mt-1">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExperienceCard;
