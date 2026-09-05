import React from 'react';
import { Pencil } from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';

export const LanguagesArticle: React.FC = () => {
  const languages = useResumeStore(state => state.data?.languages);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Languages</h2>
        <button
          className="p-1.5 rounded-md text-on-surface-variant hover:bg-primary-container hover:text-primary transition-colors"
          aria-label="Edit Languages"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 grid gap-4 text-body-md text-on-surface-variant">
        {!languages || languages.length === 0 ? (
          <p>No languages provided.</p>
        ) : (
          languages.map((lang, index) => (
            <div key={index} className="flex justify-between items-center border-b border-outline-variant pb-4 last:border-0 last:pb-0">
              <strong className="text-on-surface text-body-lg">{lang.language}</strong>
              {lang.fluency && <span className="text-on-surface-variant">{lang.fluency}</span>}
            </div>
          ))
        )}
      </div>
    </article>
  );
};
