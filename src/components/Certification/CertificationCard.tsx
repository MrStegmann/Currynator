import React from 'react';
import { Pencil, Trash2, Award, Calendar, Link as LinkIcon } from 'lucide-react';
import type { Certificate } from '../../types/Data';

interface CertificationCardProps extends Certificate {
  onEdit: () => void;
  onDelete: () => void;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  name,
  issuer,
  date,
  url,
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
        <h3 className="text-lg font-semibold text-[#d3e4fe] pr-20 flex items-center gap-2">
          <Award size={18} className="text-blue-400" />
          {name}
        </h3>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#8c909f] mt-2">
          <div className="flex items-center gap-1">
            <span className="font-medium text-[#c2c6d6]">Emisor:</span>
            <span>{issuer}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-blue-400" />
            <span>{date}</span>
          </div>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 hover:underline transition-colors">
              <LinkIcon size={14} /> Credencial
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;
