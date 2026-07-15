import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

export interface CardDataProps {
  filename: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CardData: React.FC<CardDataProps> = ({ filename, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900 border border-[#1E293B] shadow-md p-1 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 items-center transition-all hover:border-[#3B82F6]">
      {/* Columna 1: Nombre */}
      <div className="text-xl font-bold text-[#d3e4fe] text-left wrap-break-words px-2">
        {filename.replace('.json', '')}
      </div>

      {/* Columna 2: Botones */}
      <div className="flex flex-row md:flex-col gap-2 w-full p-1">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-[#d3e4fe] py-2 px-3 rounded-md transition-colors text-sm font-medium"
        >
          <Eye size={16} /> Ver
        </button>
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-md transition-colors text-sm font-medium"
        >
          <Edit2 size={16} /> Editar
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-2 px-3 rounded-md transition-colors text-sm font-medium"
        >
          <Trash2 size={16} /> Eliminar
        </button>
      </div>
    </div>
  );
};

export default CardData;
