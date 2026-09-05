import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';

export const WorkArticle: React.FC = () => {
  const work = useResumeStore(state => state.data?.work);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Work</h2>
        <button
          onClick={toggleEdit}
          className={`p-1.5 rounded-md transition-colors ${
            isEditing 
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
          }`}
          aria-label={isEditing ? 'Cancel Edit Work' : 'Edit Work'}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {isEditing ? (
          <div>
            <p>Form goes here...</p>
          </div>
        ) : !work || work.length === 0 ? (
          <p>No work experience provided.</p>
        ) : (
          work.map((job, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="text-on-surface text-body-lg block">{job.position}</strong>
                  <span>{job.name}</span>
                </div>
                <div className="text-right text-label-md bg-surface-container py-1 px-2 rounded-md font-mono">
                  {job.startDate} — {job.endDate}
                </div>
              </div>
              {job.url && (
                <div className="mb-2">
                  <a href={job.url} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    {job.url}
                  </a>
                </div>
              )}
              {job.summary && <p className="mb-2 whitespace-pre-wrap">{job.summary}</p>}
              {job.highlights && job.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {job.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  );
};
