import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface FloatingScoreButtonProps {
  onScore: () => void;
  isScoring: boolean;
  selectedCount: number;
}

export const FloatingScoreButton: React.FC<FloatingScoreButtonProps> = ({
  onScore,
  isScoring,
  selectedCount
}) => {
  return (
    <button
      type="button"
      onClick={onScore}
      disabled={isScoring}
      aria-label="AI Score Projects"
      title={
        selectedCount > 0
          ? `Score ${selectedCount} selected project${selectedCount > 1 ? 's' : ''} with Groq AI`
          : 'Score all projects with Groq AI'
      }
      className="fixed top-20 right-20 z-40 p-3 bg-primary text-on-primary rounded-full shadow-lg hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 transition-all cursor-pointer border border-primary/20 flex items-center justify-center group"
    >
      {isScoring ? (
        <Loader2 className="w-5 h-5 animate-spin text-on-primary" />
      ) : (
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-on-primary group-hover:rotate-12 transition-transform" />
          {selectedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-error text-on-error font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
              {selectedCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
};
