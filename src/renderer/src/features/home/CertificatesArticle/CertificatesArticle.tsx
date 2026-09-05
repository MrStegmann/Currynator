import React from 'react';
import { Pencil } from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';

export const CertificatesArticle: React.FC = () => {
  const certificates = useResumeStore(state => state.data?.certificates);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Certificates</h2>
        <button
          className="p-1.5 rounded-md text-on-surface-variant hover:bg-primary-container hover:text-primary transition-colors"
          aria-label="Edit Certificates"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 grid gap-6 text-body-md text-on-surface-variant">
        {!certificates || certificates.length === 0 ? (
          <p>No certificates provided.</p>
        ) : (
          certificates.map((cert, index) => (
            <div key={index} className="border-b border-outline-variant pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="text-on-surface text-body-lg block">{cert.name}</strong>
                  <span>{cert.issuer}</span>
                </div>
                <div className="text-right text-label-md bg-surface-container py-1 px-2 rounded-md font-mono">
                  {cert.date}
                </div>
              </div>
              {cert.url && (
                <div>
                  <a href={cert.url} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    {cert.url}
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  );
};
