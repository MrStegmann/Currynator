import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-6 pb-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous"
        className="inline-flex items-center gap-1 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-sm font-medium text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-surface-container-lowest transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <span className="text-body-sm font-medium text-on-surface-variant px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/60">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next"
        className="inline-flex items-center gap-1 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-sm font-medium text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-surface-container-lowest transition-colors cursor-pointer"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
