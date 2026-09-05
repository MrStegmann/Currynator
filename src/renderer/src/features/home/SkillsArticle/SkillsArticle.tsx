import React from 'react';
import { Pencil } from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';

export const SkillsArticle: React.FC = () => {
  const skills = useResumeStore(state => state.data?.skills);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Skills</h2>
        <button
          className="p-1.5 rounded-md text-on-surface-variant hover:bg-primary-container hover:text-primary transition-colors"
          aria-label="Edit Skills"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {!skills || skills.length === 0 ? (
          <p>No skills provided.</p>
        ) : (
          skills.map((skill, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0">
              <strong className="text-on-surface text-body-lg block mb-2">{skill.name}</strong>
              <div className="flex flex-wrap gap-2">
                {skill.keywords.map((keyword, idx) => (
                  <span key={idx} className="bg-surface-container text-on-surface px-3 py-1 rounded-full text-body-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};
