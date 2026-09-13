import React from 'react';
import { Eye, Pencil, Trash2, Calendar, Clock, ArrowRightCircle } from 'lucide-react';
import { ApplicationCv } from '../models/applicationCvSchema';
import { JobApplication, JobApplicationStatus } from '../../../../../main/shared/schema/jobApplicationSchema';

const STATUS_ORDER: JobApplicationStatus[] = [
  'applied',
  'called',
  'interview',
  'techTest',
  'rejected',
  'gotTheJob',
];

const STATUS_CONFIG: Record<
  JobApplicationStatus,
  { label: string; badgeClass: string }
> = {
  applied: {
    label: 'Solicitado',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
  },
  called: {
    label: 'Llamada',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
  },
  interview: {
    label: 'Entrevista',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
  },
  techTest: {
    label: 'Prueba técnica',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300',
  },
  rejected: {
    label: 'Descartado',
    badgeClass: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
  },
  gotTheJob: {
    label: '¡Conseguido!',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
};

interface CvItemCardProps {
  cvItem: ApplicationCv | JobApplication;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: JobApplicationStatus) => void;
}

export const CvItemCard: React.FC<CvItemCardProps> = ({
  cvItem,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  // Normalize fields between ApplicationCv and JobApplication
  const id = cvItem.id;
  const title = 'title' in cvItem ? cvItem.title : cvItem.targetVacancyTitle;
  const description = 'jobDescription' in cvItem ? cvItem.jobDescription : cvItem.jobDescriptionSnippet;
  const createdAt = 'created_at' in cvItem ? cvItem.created_at : cvItem.createdAt;
  const updatedAt = 'updated_at' in cvItem ? cvItem.updated_at : cvItem.updatedAt;
  const status: JobApplicationStatus = 'status' in cvItem ? cvItem.status : 'applied';

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.applied;

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

  const handleNextStatus = () => {
    const currentIndex = STATUS_ORDER.indexOf(status);
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    const nextStatus = STATUS_ORDER[nextIndex];
    onStatusChange?.(id, nextStatus);
  };

  return (
    <div className="flex flex-col justify-between bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        {/* Top-left status badge */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
          >
            {statusInfo.label}
          </span>

          {onStatusChange && (
            <button
              type="button"
              onClick={handleNextStatus}
              aria-label="Avanzar estado"
              title="Avanzar estado del proceso"
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <ArrowRightCircle className="w-4 h-4" />
              <span>Avanzar</span>
            </button>
          )}
        </div>

        <h3 className="text-title-medium text-on-surface font-semibold line-clamp-2 mb-2 m-0">
          {title}
        </h3>

        <p className="text-body-medium text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-outline-variant/50 flex flex-col gap-3">
        <div className="flex items-center justify-between text-body-sm text-on-surface-variant/80">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Creado: {formatDate(createdAt)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Actualizado: {formatDate(updatedAt)}</span>
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onView?.(id)}
            aria-label="View CV"
            title="Ver CV"
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(id)}
            aria-label="Edit CV"
            title="Editar CV"
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(id)}
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
