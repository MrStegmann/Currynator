import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';

export const BasicsArticle: React.FC = () => {
  const basics = useResumeStore(state => state.data?.basics);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Basics</h2>
        <button
          onClick={toggleEdit}
          className={`p-1.5 rounded-md transition-colors ${
            isEditing 
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
          }`}
          aria-label={isEditing ? 'Cancel Edit Basics' : 'Edit Basics'}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-6 grid gap-4 text-body-md text-on-surface-variant">
        {isEditing ? (
          <div>
            <p>Form goes here...</p>
          </div>
        ) : !basics ? (
          <p>No basic information provided.</p>
        ) : (
          <>
            <div>
              <strong className="text-on-surface block mb-1">Name</strong>
              {basics.name || '—'}
            </div>
            <div>
              <strong className="text-on-surface block mb-1">Label</strong>
              {basics.label || '—'}
            </div>
            <div>
              <strong className="text-on-surface block mb-1">Email</strong>
              {basics.email || '—'}
            </div>
            {basics.phone && (
              <div>
                <strong className="text-on-surface block mb-1">Phone</strong>
                {basics.phone}
              </div>
            )}
            {basics.url && (
              <div>
                <strong className="text-on-surface block mb-1">URL</strong>
                <a href={basics.url} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                  {basics.url}
                </a>
              </div>
            )}
            {basics.summary && (
              <div>
                <strong className="text-on-surface block mb-1">Summary</strong>
                <p className="whitespace-pre-wrap">{basics.summary}</p>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
};
