import React from 'react';
import type { WorkExperienceItem } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

export interface WorkExperienceFormProps {
  experience: WorkExperienceItem[];
  onChange: (updatedExperience: WorkExperienceItem[]) => void;
}

interface WorkExperienceHighlightsProps {
  highlights: string[];
  onChange: (updatedHighlights: string[]) => void;
}

/**
 * Bullet points manager for work experience highlights.
 *
 * @param props - Highlights list and change callback.
 * @returns React element.
 */
export const WorkExperienceHighlights: React.FC<WorkExperienceHighlightsProps> = ({
  highlights,
  onChange
}) => {
  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...highlights];
    updated[index] = val;
    onChange(updated);
  };

  const handleAddHighlight = () => {
    onChange([...highlights, '']);
  };

  const handleRemoveHighlight = (index: number) => {
    onChange(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2 mt-3">
      <label className="block text-xs font-medium text-slate-400">Key Achievements / Highlights</label>
      {highlights.map((highlight, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={highlight}
            placeholder="e.g. Led migration to micro-frontend architecture resulting in 40% speed boost"
            onChange={(e) => handleHighlightChange(index, e.target.value)}
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => handleRemoveHighlight(index)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors"
            title="Remove Bullet Point"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddHighlight}
        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors pt-1"
      >
        <Plus className="w-3.5 h-3.5" /> Add Highlight Bullet
      </button>
    </div>
  );
};

interface WorkExperienceItemCardProps {
  item: WorkExperienceItem;
  onUpdate: (updatedItem: WorkExperienceItem) => void;
  onRemove: () => void;
}

/**
 * Individual work experience entry editor card.
 *
 * @param props - Work experience item data, update callback, and remove callback.
 * @returns React element.
 */
export const WorkExperienceItemCard: React.FC<WorkExperienceItemCardProps> = ({
  item,
  onUpdate,
  onRemove
}) => {
  const handleFieldChange = (field: keyof WorkExperienceItem, value: unknown) => {
    onUpdate({ ...item, [field]: value });
  };

  return (
    <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300">
          {item.jobTitle || 'New Position'} {item.companyName ? `at ${item.companyName}` : ''}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded transition-colors"
          title="Remove Experience"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Job Title</label>
          <input
            type="text"
            value={item.jobTitle}
            placeholder="e.g. Senior Frontend Engineer"
            onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
          <input
            type="text"
            value={item.companyName}
            placeholder="e.g. Acme Corporation"
            onChange={(e) => handleFieldChange('companyName', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Start Month</label>
            <input
              type="text"
              value={item.startMonth}
              placeholder="e.g. Jan"
              onChange={(e) => handleFieldChange('startMonth', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Start Year</label>
            <input
              type="text"
              value={item.startYear}
              placeholder="e.g. 2022"
              onChange={(e) => handleFieldChange('startYear', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">End Month</label>
            <input
              type="text"
              disabled={item.isCurrentRole}
              value={item.isCurrentRole ? '' : item.endMonth || ''}
              placeholder={item.isCurrentRole ? 'Present' : 'e.g. Dec'}
              onChange={(e) => handleFieldChange('endMonth', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">End Year</label>
            <input
              type="text"
              disabled={item.isCurrentRole}
              value={item.isCurrentRole ? '' : item.endYear || ''}
              placeholder={item.isCurrentRole ? 'Present' : 'e.g. 2024'}
              onChange={(e) => handleFieldChange('endYear', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id={`currentRole-${item.id}`}
          checked={item.isCurrentRole}
          onChange={(e) => handleFieldChange('isCurrentRole', e.target.checked)}
          className="rounded border-slate-800 bg-slate-900 text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor={`currentRole-${item.id}`} className="text-xs text-slate-300 cursor-pointer">
          I currently work here
        </label>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Role Context / Overview</label>
        <textarea
          rows={2}
          value={item.context}
          placeholder="Brief description of responsibilities and scope"
          onChange={(e) => handleFieldChange('context', e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-y"
        />
      </div>

      <WorkExperienceHighlights
        highlights={item.highlights}
        onChange={(updatedHighlights) => handleFieldChange('highlights', updatedHighlights)}
      />
    </div>
  );
};

/**
 * Form section component for managing candidate work experience list.
 *
 * @param props - Component props containing experience items array and change handler.
 * @returns React component.
 */
export const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  experience,
  onChange
}) => {
  const handleAddExperience = () => {
    const newItem: WorkExperienceItem = {
      id: crypto.randomUUID(),
      jobTitle: '',
      companyName: '',
      startMonth: '',
      startYear: '',
      isCurrentRole: false,
      context: '',
      highlights: []
    };
    onChange([...experience, newItem]);
  };

  const handleUpdateExperience = (index: number, updatedItem: WorkExperienceItem) => {
    const updated = [...experience];
    updated[index] = updatedItem;
    onChange(updated);
  };

  const handleRemoveExperience = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
          Work Experience
        </h3>
        <button
          type="button"
          onClick={handleAddExperience}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          No work experiences added yet. Click &quot;Add Experience&quot; to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {experience.map((item, index) => (
            <WorkExperienceItemCard
              key={item.id || index}
              item={item}
              onUpdate={(updatedItem) => handleUpdateExperience(index, updatedItem)}
              onRemove={() => handleRemoveExperience(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
