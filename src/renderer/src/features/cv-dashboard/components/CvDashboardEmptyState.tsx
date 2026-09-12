import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface CvDashboardEmptyStateProps {
  onCreateNewCv?: () => void;
}

export const CvDashboardEmptyState: React.FC<CvDashboardEmptyStateProps> = ({ onCreateNewCv }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl max-w-2xl mx-auto shadow-sm my-8">
      <div className="p-4 bg-primary-container/20 text-primary rounded-full mb-4">
        <FileText className="w-12 h-12 text-primary" />
      </div>
      <p className="text-on-surface-variant text-body-lg mb-6 leading-relaxed max-w-md">
        No has creado todavía ningún curriculum personalizado para ninguna vacante. Empieza ahora pulsando en el botón de abajo.
      </p>
      <button
        type="button"
        onClick={onCreateNewCv}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-medium rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-sm active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        <span>Crear nuevo CV</span>
      </button>
    </div>
  );
};
