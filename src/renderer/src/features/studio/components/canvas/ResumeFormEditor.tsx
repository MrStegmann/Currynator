import React from 'react';
import type {
  ResumeData,
  PersonalDetails,
  WorkExperienceItem,
  EducationItem,
  CertificationItem,
  SkillCategory,
  ProjectItem
} from '../../types';
import { ProjectSelector } from './ProjectSelector';
import {
  PersonalDetailsForm,
  WorkExperienceForm,
  EducationForm,
  CertificationForm,
  SkillsForm,
  LanguagesForm
} from './form-sections';

export interface ResumeFormEditorProps {
  resume: ResumeData;
  onChange: (updatedResume: ResumeData) => void;
}

/**
 * Master form editor component for updating active resume fields.
 * Composes modular section forms for personal details, work experience, education,
 * certifications, skills, languages, summary, and projects.
 *
 * @param props - Component props containing active resume data and change handler.
 * @returns React component element.
 */
export const ResumeFormEditor: React.FC<ResumeFormEditorProps> = ({ resume, onChange }) => {
  const handleTitleChange = (value: string) => {
    onChange({ ...resume, title: value });
  };

  const handlePersonalChange = (field: keyof PersonalDetails, value: string) => {
    onChange({
      ...resume,
      personalDetails: {
        ...resume.personalDetails,
        [field]: value
      }
    });
  };

  const handleSummaryChange = (value: string) => {
    onChange({ ...resume, summary: value });
  };

  const handleExperienceChange = (updatedExperience: WorkExperienceItem[]) => {
    onChange({ ...resume, experience: updatedExperience });
  };

  const handleEducationChange = (updatedEducation: EducationItem[]) => {
    onChange({ ...resume, education: updatedEducation });
  };

  const handleCertificationChange = (updatedCertifications: CertificationItem[]) => {
    onChange({ ...resume, certifications: updatedCertifications });
  };

  const handleSkillsChange = (updatedSkills: SkillCategory[]) => {
    onChange({ ...resume, skills: updatedSkills });
  };

  const handleLanguagesChange = (updatedLanguages: string[]) => {
    onChange({ ...resume, languages: updatedLanguages });
  };

  const handleProjectsChange = (updatedProjects: ProjectItem[]) => {
    onChange({ ...resume, projects: updatedProjects });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-200">
      {/* Title & Metadata Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">Document Settings</h3>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Resume Title</label>
          <input
            type="text"
            value={resume.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Personal Details & Social Links */}
      <PersonalDetailsForm
        details={resume.personalDetails}
        onChange={handlePersonalChange}
      />

      {/* Professional Summary */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">Professional Summary</h3>
        <textarea
          rows={4}
          value={resume.summary}
          onChange={(e) => handleSummaryChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-y"
        />
      </div>

      {/* Work Experience */}
      <WorkExperienceForm
        experience={resume.experience || []}
        onChange={handleExperienceChange}
      />

      {/* Education */}
      <EducationForm
        education={resume.education || []}
        onChange={handleEducationChange}
      />

      {/* Certifications & Licenses */}
      <CertificationForm
        certifications={resume.certifications || []}
        onChange={handleCertificationChange}
      />

      {/* Skills & Competencies */}
      <SkillsForm
        skills={resume.skills || []}
        onChange={handleSkillsChange}
      />

      {/* Languages */}
      <LanguagesForm
        languages={resume.languages || []}
        onChange={handleLanguagesChange}
      />

      {/* Technical Projects Selection */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">Technical Projects Selection</h3>
        <ProjectSelector
          currentProjects={resume.projects || []}
          onChangeProjects={handleProjectsChange}
        />
      </div>
    </div>
  );
};
