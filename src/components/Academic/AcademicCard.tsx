import React from 'react';
import { Pencil, Trash2, GraduationCap, Calendar, Link as LinkIcon, BookOpen } from 'lucide-react';
import type { Education } from '../../types/Data';

interface AcademicCardProps extends Education {
  onEdit: () => void;
  onDelete: () => void;
}

const AcademicCard: React.FC<AcademicCardProps> = ({
  institution,
  url,
  area,
  studyType,
  startDate,
  endDate,
  score,
  courses,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-slate-900 border border-[#1E293B] rounded-lg p-5 flex flex-col gap-2 relative group">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 bg-[#1E293B] hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm" title="Editar">
          <Pencil size={16} />
        </button>
        <button onClick={onDelete} className="p-2 bg-[#1E293B] hover:bg-red-500 text-white rounded-md transition-colors shadow-sm" title="Eliminar">
          <Trash2 size={16} />
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#d3e4fe] pr-20">{area} {studyType ? `(${studyType})` : ''}</h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#8c909f] mt-1">
          <div className="flex items-center gap-1">
            <GraduationCap size={14} className="text-blue-400" />
            <span>{institution}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-blue-400" />
            <span>{startDate} — {endDate ? endDate : 'Presente'}</span>
          </div>
          {score && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#c2c6d6]">Nota:</span> {score}
            </div>
          )}
          {url && (
            <div className="flex items-center gap-1">
              <LinkIcon size={14} className="text-blue-400" />
              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a>
            </div>
          )}
        </div>
      </div>

      {courses && courses.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-1 text-sm font-medium text-[#d3e4fe] mb-1">
            <BookOpen size={14} className="text-blue-400" />
            <span>Cursos Destacados:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {courses.map((course, idx) => (
              <span key={idx} className="bg-[#1E293B] text-[#c2c6d6] px-2 py-1 rounded text-xs">
                {course}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicCard;
