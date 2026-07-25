import React from 'react';
import type { ResumeData } from '../../types/resume.types';

interface ResumeATSPreviewProps {
  resume: ResumeData;
  containerId?: string;
}

/**
 * ATS-Friendly Professional Two-Column CV layout optimized for IT/Software Engineers.
 * Enforces monochrome typography (#000000), strict container bounding, and semantic markup.
 */
export const ResumeATSPreview: React.FC<ResumeATSPreviewProps> = ({
  resume,
  containerId = 'ats-resume-preview-document'
}) => {
  const { personalDetails, summary, skills, languages, experience, education, projects, certifications } = resume;

  return (
    <div className="w-full flex justify-center p-4 overflow-x-auto">
      {/* A4 Printable Container */}
      <article
        id={containerId}
        className="ats-monochrome-container bg-white text-[#000000] w-[210mm] min-h-[297mm] p-[12mm] shadow-2xl rounded-sm font-sans box-border overflow-hidden select-text text-left"
        style={{
          color: '#000000',
          wordBreak: 'break-word',
          hyphens: 'auto',
          overflowWrap: 'break-word'
        }}
      >
        {/* Header Bar */}
        <header className="border-b border-[#000000] pb-4 mb-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#000000] mb-0.5">
              {personalDetails.fullName || 'Candidate Name'}
            </h1>
            <p className="text-sm font-semibold text-[#000000] uppercase tracking-wide">
              {personalDetails.professionalTitle || 'Software Engineer'}
            </p>
          </div>

          {/* Profile Photo Integration (If available) */}
          {personalDetails.avatarUrl && (
            <img
              src={personalDetails.avatarUrl}
              alt={personalDetails.fullName}
              className="w-16 h-16 rounded-full border border-[#000000] object-cover shrink-0"
            />
          )}
        </header>

        {/* 2-Column Main Workspace (30% Left / 70% Right) */}
        <div className="flex gap-6 w-full items-start">
          {/* Left Column (30% width) */}
          <aside className="w-[30%] shrink-0 flex flex-col gap-4 text-xs">
            {/* Contact Details */}
            <section className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1.5">
                Contact Information
              </h2>
              {personalDetails.email && <div className="truncate">{personalDetails.email}</div>}
              {personalDetails.phoneNumber && <div className="truncate">{personalDetails.phoneNumber}</div>}
              {personalDetails.location && <div className="truncate">{personalDetails.location}</div>}
              {personalDetails.linkedinUrl && <div className="truncate">{personalDetails.linkedinUrl}</div>}
              {personalDetails.githubUrl && <div className="truncate">{personalDetails.githubUrl}</div>}
              {personalDetails.websiteUrl && <div className="truncate">{personalDetails.websiteUrl}</div>}
            </section>

            {/* Technical Skills */}
            {skills.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                  Technical Skills
                </h2>
                {skills.map((cat, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <h3 className="text-[11px] font-bold text-[#000000]">{cat.category}</h3>
                    <p className="text-[11px] leading-snug">{cat.skills.join(', ')}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                  Languages
                </h2>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {languages.map((lang, idx) => (
                    <li key={idx}>{lang}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                  Education
                </h2>
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5 text-[11px]">
                    <h3 className="text-[11px] font-bold text-[#000000]">{edu.degreeName}</h3>
                    <div className="text-[#000000]">{edu.institutionName}</div>
                    <div className="text-[#000000] italic">{edu.graduationYear}</div>
                  </div>
                ))}
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                  Certifications
                </h2>
                {certifications.map((c) => (
                  <div key={c.id} className="space-y-0.5 text-[11px]">
                    <h3 className="text-[11px] font-bold text-[#000000]">{c.certificationName}</h3>
                    <div className="text-[#000000]">{c.issuingOrganization} ({c.grantedYear})</div>
                  </div>
                ))}
              </section>
            )}
          </aside>

          {/* Right Column (70% width) - Prioritized for ATS parsing */}
          <main className="w-[70%] flex flex-col gap-4 text-xs">
            {/* Professional Summary */}
            {summary && (
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-xs leading-relaxed text-[#000000]">{summary}</p>
              </section>
            )}

            {/* Work Experience */}
            {experience.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                  Work Experience
                </h2>
                {experience.map((exp) => (
                  <article key={exp.id} className="space-y-1">
                    <div className="flex items-baseline justify-between font-bold text-xs">
                      <h3 className="text-xs font-bold text-[#000000]">{exp.jobTitle} • {exp.companyName}</h3>
                      <span className="text-[11px] font-normal text-[#000000]">
                        {exp.startMonth} {exp.startYear} – {exp.isCurrentRole ? 'Present' : `${exp.endMonth || ''} ${exp.endYear || ''}`}
                      </span>
                    </div>

                    {exp.context && <p className="text-[11px] italic text-[#000000]">{exp.context}</p>}

                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs leading-relaxed">
                      {exp.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </section>
            )}

            {/* Technical Projects */}
            {projects.length > 0 && (
              <section className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                  Technical Projects
                </h2>
                {projects.map((p) => (
                  <article key={p.id} className="space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xs font-bold text-[#000000]">{p.name}</h3>
                      <span className="text-[11px] font-mono">{p.technologies.join(', ')}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{p.description}</p>
                  </article>
                ))}
              </section>
            )}
          </main>
        </div>
      </article>
    </div>
  );
};
