import React from 'react';
import type { ResumeData, ProjectItem } from '../../types/resume.types';
import { ProjectSelector } from './ProjectSelector';

interface ResumeFormEditorProps {
  resume: ResumeData;
  onChange: (updatedResume: ResumeData) => void;
}

/**
 * Form editor component for updating active resume fields.
 */
export const ResumeFormEditor: React.FC<ResumeFormEditorProps> = ({ resume, onChange }) => {
  const handlePersonalChange = (field: string, value: string) => {
    onChange({
      ...resume,
      personalDetails: {
        ...resume.personalDetails,
        [field]: value
      }
    });
  };

  const handleTitleChange = (value: string) => {
    onChange({
      ...resume,
      title: value
    });
  };

  const handleSummaryChange = (value: string) => {
    onChange({
      ...resume,
      summary: value
    });
  };

  const handleProjectsChange = (updatedProjects: ProjectItem[]) => {
    onChange({
      ...resume,
      projects: updatedProjects
    });
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

      {/* Personal Details */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={resume.personalDetails.fullName}
              onChange={(e) => handlePersonalChange('fullName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Professional Title</label>
            <input
              type="text"
              value={resume.personalDetails.professionalTitle}
              onChange={(e) => handlePersonalChange('professionalTitle', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={resume.personalDetails.email}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
            <input
              type="text"
              value={resume.personalDetails.phoneNumber || ''}
              onChange={(e) => handlePersonalChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
            <input
              type="text"
              value={resume.personalDetails.location || ''}
              onChange={(e) => handlePersonalChange('location', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={resume.personalDetails.linkedinUrl || ''}
              onChange={(e) => handlePersonalChange('linkedinUrl', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

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

      {/* Technical Projects Selector */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">Technical Projects Selection</h3>
        <ProjectSelector
          currentProjects={resume.projects}
          onChangeProjects={handleProjectsChange}
        />
      </div>
    </div>
  );
};
