import React from 'react';
import type { EducationItem, CertificationItem } from '../../../types';

export interface WizardStepEducationCertProps {
  proposedEducation: EducationItem[];
  proposedCertifications: CertificationItem[];
  reasoning: string;
}

/**
 * Step 4 View: Education & Certifications Selection.
 *
 * @param props - Component props containing proposed education and certification items with AI reasoning.
 * @returns React element.
 */
export const WizardStepEducationCert: React.FC<WizardStepEducationCertProps> = ({
  proposedEducation,
  proposedCertifications,
  reasoning
}) => {
  return (
    <div className="space-y-4 text-slate-200">
      <div>
        <h4 className="text-sm font-semibold text-blue-400">Step 4: Education & Certifications Selection</h4>
        <p className="text-xs text-slate-400">
          Selects supporting academic degrees and certifications that align with your professional title.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Education</h5>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {proposedEducation.map((edu, idx) => (
              <div key={edu.id || idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-200">{edu.degreeName}</p>
                <p className="text-[11px] text-slate-400">{edu.institutionName} • {edu.currentStudy ? 'In Progress' : edu.graduationYear}</p>
              </div>
            ))}
            {proposedEducation.length === 0 && <p className="text-xs text-slate-500 italic">No education entries selected.</p>}
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Certifications</h5>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {proposedCertifications.map((cert, idx) => (
              <div key={cert.id || idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-200">{cert.certificationName}</p>
                <p className="text-[11px] text-slate-400">{cert.issuingOrganization} • {cert.currentStudy ? 'In Progress' : cert.grantedYear}</p>
              </div>
            ))}
            {proposedCertifications.length === 0 && <p className="text-xs text-slate-500 italic">No certification entries selected.</p>}
          </div>
        </div>
      </div>

      {reasoning && (
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-blue-400">AI Rationale:</span>
          <p className="text-slate-400">{reasoning}</p>
        </div>
      )}
    </div>
  );
};
