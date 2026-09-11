import React from 'react';
import { Loader2 } from 'lucide-react';

interface ImportProgressBarProps {
  message: string;
  percentage: number;
}

export const ImportProgressBar: React.FC<ImportProgressBarProps> = ({ message, percentage }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-body-md font-medium text-on-surface">{message || 'Processing...'}</span>
        </div>
        <span className="text-label-md text-primary font-mono">{percentage}%</span>
      </div>

      <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
