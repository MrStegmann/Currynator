import React, { useState, useRef, useEffect } from 'react';
import { Eye, Brain, FileDown, Trash2, Check, X, Edit2 } from 'lucide-react';

export interface CardCVProps {
  filename: string;
  hasJobDetails: boolean;
  onView: () => void;
  onAIReport: () => void;
  onGeneratePDF: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRename?: (newName: string) => void;
}

const CardCV: React.FC<CardCVProps> = ({
  filename,
  onView,
  onAIReport,
  onGeneratePDF,
  onEdit,
  onDelete,
  onRename
}) => {
  const displayLabel = filename.replace(/_specific|.json|_CV_Optimizated|/g, '');
  const [isFocused, setIsFocused] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(displayLabel);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentLabel]);

  const hasChanged = currentLabel !== displayLabel;

  const handleSave = () => {
    if (hasChanged && onRename) {
      onRename(currentLabel);
    }
    setIsFocused(false);
  };

  const handleCancel = () => {
    setCurrentLabel(displayLabel);
    setIsFocused(false);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-700 shadow-md p-1 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 items-center transition-all hover:border-blue-500">
      {/* Columna 1: Nombre */}
      <div className="flex flex-col gap-2 w-full px-2 py-2">
        <textarea
          ref={textareaRef}
          value={currentLabel}
          onChange={(e) => setCurrentLabel(e.target.value)}
          onFocus={() => setIsFocused(true)}
          rows={1}
          className="text-xl font-bold text-[#d3e4fe] bg-transparent outline-none border-b border-[#1E293B] focus:border-b-2 focus:border-blue-500 w-full pb-1 transition-all resize-none overflow-hidden"
        />
        {(isFocused || hasChanged) && hasChanged && (
          <div className="flex gap-2 mt-1">
            <button
              onMouseDown={(e) => { e.preventDefault(); handleSave(); }}
              className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors"
            >
              <Check size={14} /> Guardar
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); handleCancel(); }}
              className="flex items-center gap-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs rounded transition-colors"
            >
              <X size={14} /> Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Columna 2: Botones */}
      <div className="flex flex-col gap-2 w-full p-1">
        <div className="flex flex-row gap-2 w-full">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-[#d3e4fe] py-2 px-3 rounded-md transition-colors text-sm font-medium"
            title="Ver Currículum"
          >
            <Eye size={16} /> Ver
          </button>
          <button
            onClick={onAIReport}
            className="flex-1 flex items-center justify-center gap-2 bg-[#102034] hover:bg-[#1b2b3f] text-[#adc6ff] border border-[#1E293B] hover:border-[#3B82F6] py-2 px-3 rounded-md transition-colors text-sm font-medium"
            title="Informe de IA"
          >
            <Brain size={16} /> Informe IA
          </button>
        </div>
        <div className="flex flex-row gap-2 w-full mt-1">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-[#d3e4fe] py-2 px-3 rounded-md transition-colors text-sm font-medium"
            title="Editar CV"
          >
            <Edit2 size={16} /> Editar
          </button>
          <button
            onClick={onGeneratePDF}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-md transition-colors text-sm font-medium"
            title="Generar PDF"
          >
            <FileDown size={16} /> PDF
          </button>
        </div>
        <div className="flex flex-row gap-2 w-full mt-1">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 py-1.5 px-3 rounded-md transition-colors text-sm font-medium border border-transparent hover:border-red-500/30"
            title="Eliminar"
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCV;
