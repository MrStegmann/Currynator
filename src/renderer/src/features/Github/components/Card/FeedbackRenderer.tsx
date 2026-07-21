import React from 'react';
import type { FeedbackItem } from '../../types';
import { AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

interface FeedbackRendererProps {
  worseParts: FeedbackItem[];
  warnings: FeedbackItem[];
  tips: FeedbackItem[];
}

export const FeedbackRenderer: React.FC<FeedbackRendererProps> = ({ worseParts, warnings, tips }) => {
  if (worseParts.length === 0 && warnings.length === 0 && tips.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-[#38434f]/50 pt-4">
      {worseParts.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Worse Parts & Defects
          </h4>
          {worseParts.map(item => (
            <div key={item.id} className="text-sm text-[#e9eaec] bg-red-500/10 border border-red-500/20 p-3 rounded-md">
              <strong>{item.title}:</strong> {item.message}
              {item.actionableSuggestion && <div className="mt-1 text-red-300">💡 {item.actionableSuggestion}</div>}
            </div>
          ))}
        </div>
      )}
      
      {warnings.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Warnings
          </h4>
          {warnings.map(item => (
            <div key={item.id} className="text-sm text-[#e9eaec] bg-amber-500/10 border border-amber-500/20 p-3 rounded-md">
              <strong>{item.title}:</strong> {item.message}
              {item.actionableSuggestion && <div className="mt-1 text-amber-300">💡 {item.actionableSuggestion}</div>}
            </div>
          ))}
        </div>
      )}

      {tips.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Improvement Tips
          </h4>
          {tips.map(item => (
            <div key={item.id} className="text-sm text-[#e9eaec] bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
              <strong>{item.title}:</strong> {item.message}
              {item.actionableSuggestion && <div className="mt-1 text-blue-300">👉 {item.actionableSuggestion}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
