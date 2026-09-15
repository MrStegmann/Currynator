import React from 'react';
import { Eye, Pencil, Trash2, Calendar, Clock, ArrowRightCircle, Download, RefreshCw, Sparkles } from 'lucide-react';
import { ApplicationCv } from '../models/applicationCvSchema';
import { JobApplication, JobApplicationStatus } from '../../../../../main/shared/schema/jobApplicationSchema';

const STATUS_ORDER: JobApplicationStatus[] = [
  'pending',
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
  pending: {
    label: 'Pendiente',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
  },
  applied: {
    label: 'Solicitado',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
  },
  called: {
    label: 'Llamada',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300',
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
  onPreviewCv?: (id: string) => void;
  onDownloadCv?: (id: string) => void;
  onRegenerateCv?: (id: string) => void;
  isRegenerating?: boolean;
}

export const CvItemCard: React.FC<CvItemCardProps> = ({
  cvItem,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onPreviewCv,
  onDownloadCv,
  onRegenerateCv,
  isRegenerating = false,
}) => {
  // Normalize fields between ApplicationCv and JobApplication
  const id = cvItem.id;
  const title = 'title' in cvItem ? cvItem.title : cvItem.targetVacancyTitle;
  const description = 'jobDescription' in cvItem ? cvItem.jobDescription : cvItem.jobDescriptionSnippet;
  const createdAt = 'created_at' in cvItem ? cvItem.created_at : cvItem.createdAt;
  const updatedAt = 'updated_at' in cvItem ? cvItem.updated_at : cvItem.updatedAt;
  const status: JobApplicationStatus = 'status' in cvItem ? cvItem.status : 'pending';
  const matchScore = 'match_score' in cvItem ? cvItem.match_score : undefined;

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

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

  const handlePreviewClick = () => {
    if (onPreviewCv) {
      onPreviewCv(id);
    } else if (onView) {
      onView(id);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        {/* Top-left status badge & match score */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>

            {matchScore !== undefined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Sparkles className="w-3 h-3" />
                {matchScore}% Match
              </span>
            )}
          </div>

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
        {/* Card Action Buttons: Preview CV, Download CV, Regenerate CV */}
        <div className="flex items-center gap-2 pt-1 pb-1">
          <button
            type="button"
            onClick={handlePreviewClick}
            aria-label="Preview CV"
            title="Preview Curriculum Vitae"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview CV</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadCv?.(id)}
            aria-label="Download CV"
            title="Download CV in PDF"
            className="inline-flex items-center justify-center p-1.5 text-xs font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="sr-only">Download CV</span>
          </button>

          <button
            type="button"
            onClick={() => onRegenerateCv?.(id)}
            disabled={isRegenerating}
            aria-label="Regenerate CV"
            title="Regenerate CV via Groq AI"
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium text-secondary-container-on bg-secondary-container/30 hover:bg-secondary-container/50 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-primary' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-body-sm text-on-surface-variant/80">
          <span className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Creado: {formatDate(createdAt)}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Actualizado: {formatDate(updatedAt)}</span>
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={() => onEdit?.(id)}
            aria-label="Edit CV"
            title="Editar CV"
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(id)}
            aria-label="Delete CV"
            title="Eliminar CV"
            className="p-1.5 text-error hover:bg-error-container/20 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
