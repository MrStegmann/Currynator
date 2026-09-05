import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';

export const EducationArticle: React.FC = () => {
  const education = useResumeStore(state => state.data?.education);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Education</h2>
        <button
          onClick={toggleEdit}
          className={`p-1.5 rounded-md transition-colors ${
            isEditing 
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
          }`}
          aria-label={isEditing ? 'Cancel Edit Education' : 'Edit Education'}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {isEditing ? (
          <div>
            <p>Form goes here...</p>
          </div>
        ) : !education || education.length === 0 ? (
          <p>No education history provided.</p>
        ) : (
          education.map((edu, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="text-on-surface text-body-lg block">{edu.institution}</strong>
                  <span>{edu.studyType ? `${edu.studyType} in ${edu.area}` : edu.area}</span>
                </div>
                <div className="text-right text-label-md bg-surface-container py-1 px-2 rounded-md font-mono">
                  {edu.startDate} — {edu.endDate}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};
