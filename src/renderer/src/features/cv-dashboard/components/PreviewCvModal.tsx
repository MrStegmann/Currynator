import React from 'react';
import { X, Sparkles, Briefcase, Award, GraduationCap, FolderGit2 } from 'lucide-react';
import { JobApplication } from '../../../../../main/shared/schema/jobApplicationSchema';

interface PreviewCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobApplication: JobApplication | null;
}

export const PreviewCvModal: React.FC<PreviewCvModalProps> = ({
  isOpen,
  onClose,
  jobApplication,
}) => {
  if (!isOpen || !jobApplication) return null;

  const tailored = jobApplication.tailored_json_resume || {};
  const basics = tailored.basics || {};
  const work = Array.isArray(tailored.work) ? tailored.work : [];
  const skills = Array.isArray(tailored.skills) ? tailored.skills : [];
  const education = Array.isArray(tailored.education) ? tailored.education : [];
  const projects = Array.isArray(tailored.projects) ? tailored.projects : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-title-large text-on-surface font-semibold m-0">
                Tailored CV Preview
              </h2>
              <p className="text-body-sm text-on-surface-variant m-0">
                {jobApplication.title} {jobApplication.match_score !== undefined && `• ${jobApplication.match_score}% Match`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basics */}
          {basics.name && (
            <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/60">
              <h3 className="text-title-medium text-on-surface font-bold m-0">{basics.name}</h3>
              {basics.label && <p className="text-body-medium text-primary font-medium m-0 mt-0.5">{basics.label}</p>}
              {basics.email && <p className="text-body-sm text-on-surface-variant m-0 mt-1">{basics.email}</p>}
              {basics.summary && <p className="text-body-medium text-on-surface-variant m-0 mt-3 leading-relaxed">{basics.summary}</p>}
            </div>
          )}

          {/* Work Experience */}
          {work.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-title-medium text-on-surface font-semibold m-0">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>Work Experience</span>
              </h4>
              <div className="space-y-3">
                {work.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-body-large text-on-surface font-semibold m-0">{item.position || item.name}</h5>
                        {item.name && <p className="text-body-sm text-primary m-0 font-medium">{item.name}</p>}
                      </div>
                      {(item.startDate || item.endDate) && (
                        <span className="text-body-xs text-on-surface-variant">
                          {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                        </span>
                      )}
                    </div>
                    {item.summary && <p className="text-body-sm text-on-surface-variant mt-2 m-0">{item.summary}</p>}
                    {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-body-sm text-on-surface-variant space-y-1">
                        {item.highlights.map((h: string, hIdx: number) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-title-medium text-on-surface font-semibold m-0">
                <Award className="w-4 h-4 text-primary" />
                <span>Skills</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((skillGroup: any, idx: number) => (
                  <div key={idx} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl">
                    <h5 className="text-body-sm text-on-surface font-semibold m-0 mb-2">{skillGroup.name}</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(skillGroup.keywords) && skillGroup.keywords.map((kw: string, kwIdx: number) => (
                        <span key={kwIdx} className="px-2 py-0.5 text-body-xs font-medium bg-secondary-container text-on-secondary-container rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-title-medium text-on-surface font-semibold m-0">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>Education</span>
              </h4>
              <div className="space-y-2">
                {education.map((edu: any, idx: number) => (
                  <div key={idx} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl flex justify-between items-center">
                    <div>
                      <h5 className="text-body-sm text-on-surface font-semibold m-0">{edu.institution}</h5>
                      <p className="text-body-xs text-on-surface-variant m-0">{edu.studyType} {edu.area ? `in ${edu.area}` : ''}</p>
                    </div>
                    {edu.endDate && <span className="text-body-xs text-on-surface-variant">{edu.endDate}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-title-medium text-on-surface font-semibold m-0">
                <FolderGit2 className="w-4 h-4 text-primary" />
                <span>Projects</span>
              </h4>
              <div className="space-y-2">
                {projects.map((proj: any, idx: number) => (
                  <div key={idx} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl">
                    <h5 className="text-body-sm text-on-surface font-semibold m-0">{proj.name}</h5>
                    {proj.description && <p className="text-body-xs text-on-surface-variant m-0 mt-1">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-outline-variant bg-surface-container-low/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-body-medium font-medium text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
