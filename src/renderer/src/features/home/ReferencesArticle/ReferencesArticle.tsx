import React from 'react';
import { Pencil } from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';

export const ReferencesArticle: React.FC = () => {
  const references = useResumeStore(state => state.data?.references);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">References</h2>
        <button
          className="p-1.5 rounded-md text-on-surface-variant hover:bg-primary-container hover:text-primary transition-colors"
          aria-label="Edit References"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {!references || references.length === 0 ? (
          <p>No references provided.</p>
        ) : (
          references.map((ref, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0">
              <strong className="text-on-surface text-body-lg block mb-2">{ref.name}</strong>
              <blockquote className="border-l-4 border-outline-variant pl-4 italic text-on-surface-variant">
                "{ref.reference}"
              </blockquote>
            </div>
          ))
        )}
      </div>
    </article>
  );
};
