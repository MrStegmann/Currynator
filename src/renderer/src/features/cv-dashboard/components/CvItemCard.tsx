import React from 'react';
import { Eye, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { ApplicationCv } from '../models/applicationCvSchema';

interface CvItemCardProps {
  cvItem: ApplicationCv;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CvItemCard: React.FC<CvItemCardProps> = ({
  cvItem,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col justify-between bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-title-medium text-on-surface font-semibold line-clamp-2 m-0">
            {cvItem.targetVacancyTitle}
          </h3>
        </div>

        <p className="text-body-medium text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
          {cvItem.jobDescriptionSnippet}
        </p>
      </div>

      <div className="pt-4 border-t border-outline-variant/50 flex flex-col gap-3">
        <div className="flex items-center justify-between text-body-sm text-on-surface-variant/80">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Creado: {formatDate(cvItem.createdAt)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Actualizado: {formatDate(cvItem.updatedAt)}</span>
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onView?.(cvItem.id)}
            aria-label="View CV"
            title="Ver CV"
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(cvItem.id)}
            aria-label="Edit CV"
            title="Editar CV"
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(cvItem.id)}
            aria-label="Delete CV"
            title="Eliminar CV"
            className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
