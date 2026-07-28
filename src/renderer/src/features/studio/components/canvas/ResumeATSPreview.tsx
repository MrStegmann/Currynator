import React from 'react';
import type { ResumeData, WorkExperienceItem, ProjectItem } from '../../types/resume.types';
import type { LeftColumnItem, RightColumnItem } from '../../utils/paginationUtils';

interface ResumeATSPreviewProps {
  resume: ResumeData;
  containerId?: string;
  showMainHeader?: boolean;
  leftItemsOverride?: LeftColumnItem[];
  rightItemsOverride?: RightColumnItem[];
  pageNumber?: number;
  totalPages?: number;
}

/**
 * Render component for the ATS Header section.
 */
export const ATSHeaderBlock: React.FC<{ personalDetails: ResumeData['personalDetails'] }> = ({ personalDetails }) => (
  <header className="border-b border-[#000000] pb-4 mb-4 flex items-center justify-between gap-4 w-full">
    <div className="flex-1">
      <h1 className="text-2xl font-bold tracking-tight text-[#000000] mb-0.5 break-words">
        {personalDetails.fullName || 'Candidate Name'}
      </h1>
      <p className="text-sm font-semibold text-[#000000] uppercase tracking-wide break-words">
        {personalDetails.professionalTitle || 'Software Engineer'}
      </p>
    </div>
    {personalDetails.avatarUrl && (
      <img
        src={personalDetails.avatarUrl}
        alt={personalDetails.fullName}
        className="w-16 h-16 rounded-full border border-[#000000] object-cover shrink-0"
      />
    )}
  </header>
);

/**
 * Render component for the ATS Left Column sections (Contact, Skills, Languages, Education, Certifications).
 */
export const ATSLeftColumnBlock: React.FC<{ items: LeftColumnItem[]; resume: ResumeData }> = ({ items, resume }) => {
  const { personalDetails } = resume;

  return (
    <aside className="w-[30%] shrink-0 flex flex-col gap-4 text-xs">
      {items.map((item) => {
        if (item.type === 'contact') {
          return (
            <section key={item.id} className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1.5">
                Contact Information
              </h2>
              {personalDetails.email && <div className="break-all whitespace-normal">{personalDetails.email}</div>}
              {personalDetails.phoneNumber && <div className="break-words whitespace-normal">{personalDetails.phoneNumber}</div>}
              {personalDetails.location && <div className="break-words whitespace-normal">{personalDetails.location}</div>}
              {personalDetails.linkedinUrl && <div className="break-all whitespace-normal">{personalDetails.linkedinUrl}</div>}
              {personalDetails.githubUrl && <div className="break-all whitespace-normal">{personalDetails.githubUrl}</div>}
              {personalDetails.websiteUrl && <div className="break-all whitespace-normal">{personalDetails.websiteUrl}</div>}
            </section>
          );
        }
        if (item.type === 'skills') {
          return (
            <section key={item.id} className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                Technical Skills
              </h2>
              {resume.skills.map((cat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <h3 className="text-[11px] font-bold text-[#000000] break-words">{cat.category}</h3>
                  <p className="text-[11px] leading-snug break-words">{cat.skills.join(', ')}</p>
                </div>
              ))}
            </section>
          );
        }
        if (item.type === 'languages') {
          return (
            <section key={item.id} className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                Languages
              </h2>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {resume.languages.map((lang, idx) => (
                  <li key={idx} className="break-words">{lang}</li>
                ))}
              </ul>
            </section>
          );
        }
        if (item.type === 'education') {
          return (
            <section key={item.id} className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                Education
              </h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="space-y-0.5 text-[11px]">
                  <h3 className="text-[11px] font-bold text-[#000000] break-words">{edu.degreeName}</h3>
                  <div className="text-[#000000] break-words">{edu.institutionName}</div>
                  <div className="text-[#000000] italic break-words">{edu.graduationYear}</div>
                </div>
              ))}
            </section>
          );
        }
        if (item.type === 'certifications') {
          return (
            <section key={item.id} className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1">
                Certifications
              </h2>
              {resume.certifications.map((c) => (
                <div key={c.id} className="space-y-0.5 text-[11px]">
                  <h3 className="text-[11px] font-bold text-[#000000] break-words">{c.certificationName}</h3>
                  <div className="text-[#000000] break-words">{c.issuingOrganization} ({c.grantedYear})</div>
                </div>
              ))}
            </section>
          );
        }
        return null;
      })}
    </aside>
  );
};

/**
 * Render component for the ATS Right Column sections (Summary, Experience, Projects).
 */
export const ATSRightColumnBlock: React.FC<{ items: RightColumnItem[] }> = ({ items }) => (
  <main className="w-[70%] flex flex-col gap-4 text-xs">
    {items.map((item) => {
      if (item.type === 'summary') {
        const text = item.data as string;
        return (
          <section key={item.id} className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-[#000000] pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-[#000000] break-words whitespace-normal">{text}</p>
          </section>
        );
      }
      if (item.type === 'experience') {
        const exp = item.data as WorkExperienceItem;
        return (
          <section key={item.id} className="space-y-1">
            <div className="flex items-baseline justify-between font-bold text-xs">
              <h3 className="text-xs font-bold text-[#000000] break-words">{exp.jobTitle} • {exp.companyName}</h3>
              <span className="text-[11px] font-normal text-[#000000] shrink-0 ml-2">
                {exp.startMonth} {exp.startYear} – {exp.isCurrentRole ? 'Present' : `${exp.endMonth || ''} ${exp.endYear || ''}`}
              </span>
            </div>

            {exp.context && <p className="text-[11px] italic text-[#000000] break-words">{exp.context}</p>}

            <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs leading-relaxed">
              {exp.highlights && exp.highlights.map((h: string, idx: number) => (
                <li key={idx} className="break-words whitespace-normal">{h}</li>
              ))}
            </ul>
          </section>
        );
      }
      if (item.type === 'project') {
        const p = item.data as ProjectItem;
        return (
          <section key={item.id} className="space-y-0.5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-bold text-[#000000] break-words">{p.name}</h3>
              <span className="text-[11px] font-mono break-words shrink-0 ml-2">{p.technologies.join(', ')}</span>
            </div>
            <p className="text-xs leading-relaxed break-words whitespace-normal">{p.description}</p>
          </section>
        );
      }
      return null;
    })}
  </main>
);

/**
 * ATS-Friendly Professional Two-Column CV layout optimized for IT/Software Engineers.
 * Enforces monochrome typography (#000000), natural text wrapping (no ellipses/truncation),
 * and clean semantic markup.
 */
export const ResumeATSPreview: React.FC<ResumeATSPreviewProps> = ({
  resume,
  containerId = 'ats-resume-preview-document',
  showMainHeader = true,
  leftItemsOverride,
  rightItemsOverride
}) => {
  const defaultLeftItems: LeftColumnItem[] = [
    { type: 'contact', id: 'contact', data: resume.personalDetails },
    ...(resume.skills.length > 0 ? [{ type: 'skills' as const, id: 'skills', data: resume.skills }] : []),
    ...(resume.languages.length > 0 ? [{ type: 'languages' as const, id: 'languages', data: resume.languages }] : []),
    ...(resume.education.length > 0 ? [{ type: 'education' as const, id: 'education', data: resume.education }] : []),
    ...(resume.certifications.length > 0 ? [{ type: 'certifications' as const, id: 'certifications', data: resume.certifications }] : [])
  ];

  const defaultRightItems: RightColumnItem[] = [
    ...(resume.summary ? [{ type: 'summary' as const, id: 'summary', data: resume.summary }] : []),
    ...resume.experience.map((exp) => ({ type: 'experience' as const, id: `exp-${exp.id}`, data: exp })),
    ...resume.projects.map((p) => ({ type: 'project' as const, id: `proj-${p.id}`, data: p }))
  ];

  const leftItems = leftItemsOverride || defaultLeftItems;
  const rightItems = rightItemsOverride || defaultRightItems;

  return (
    <article
      id={containerId}
      className="ats-monochrome-container bg-white text-[#000000] w-[210mm] min-h-[297mm] p-[12mm] shadow-2xl rounded-sm font-sans box-border select-text text-left"
      style={{
        color: '#000000',
        wordBreak: 'break-word',
        hyphens: 'auto',
        overflowWrap: 'break-word'
      }}
    >
      {showMainHeader && <ATSHeaderBlock personalDetails={resume.personalDetails} />}

      <div className="flex gap-6 w-full items-start">
        <ATSLeftColumnBlock items={leftItems} resume={resume} />
        <ATSRightColumnBlock items={rightItems} />
      </div>
    </article>
  );
};
