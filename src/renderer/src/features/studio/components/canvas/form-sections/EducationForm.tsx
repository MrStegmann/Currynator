import React from 'react';
import type { EducationItem } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

export interface EducationFormProps {
  education: EducationItem[];
  onChange: (updatedEducation: EducationItem[]) => void;
}

interface EducationItemCardProps {
  item: EducationItem;
  onUpdate: (updatedItem: EducationItem) => void;
  onRemove: () => void;
}

/**
 * Individual education entry editor card component.
 *
 * @param props - Education item data, update callback, and remove callback.
 * @returns React element.
 */
export const EducationItemCard: React.FC<EducationItemCardProps> = ({
  item,
  onUpdate,
  onRemove
}) => {
  const handleFieldChange = (field: keyof EducationItem, value: unknown) => {
    onUpdate({ ...item, [field]: value });
  };

  return (
    <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300">
          {item.degreeName || 'New Degree / Qualification'} {item.institutionName ? `at ${item.institutionName}` : ''}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded transition-colors"
          title="Remove Education"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Degree / Field of Study</label>
          <input
            type="text"
            value={item.degreeName}
            placeholder="e.g. B.S. in Computer Science"
            onChange={(e) => handleFieldChange('degreeName', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Institution Name</label>
          <input
            type="text"
            value={item.institutionName}
            placeholder="e.g. Stanford University"
            onChange={(e) => handleFieldChange('institutionName', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Graduation Year</label>
          <input
            type="text"
            disabled={item.currentStudy}
            value={item.currentStudy ? '' : item.graduationYear}
            placeholder={item.currentStudy ? 'In Progress' : 'e.g. 2022'}
            onChange={(e) => handleFieldChange('graduationYear', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id={`currentStudy-${item.id}`}
          checked={item.currentStudy || false}
          onChange={(e) => handleFieldChange('currentStudy', e.target.checked)}
          className="rounded border-slate-800 bg-slate-900 text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor={`currentStudy-${item.id}`} className="text-xs text-slate-300 cursor-pointer">
          Currently studying here
        </label>
      </div>
    </div>
  );
};

/**
 * Form section component for managing candidate education history.
 *
 * @param props - Component props containing education items array and change handler.
 * @returns React component.
 */
export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      degreeName: '',
      institutionName: '',
      graduationYear: '',
      currentStudy: false
    };
    onChange([...education, newItem]);
  };

  const handleUpdateEducation = (index: number, updatedItem: EducationItem) => {
    const updated = [...education];
    updated[index] = updatedItem;
    onChange(updated);
  };

  const handleRemoveEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
          Education
        </h3>
        <button
          type="button"
          onClick={handleAddEducation}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          No education entries added yet. Click &quot;Add Education&quot; to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {education.map((item, index) => (
            <EducationItemCard
              key={item.id || index}
              item={item}
              onUpdate={(updatedItem) => handleUpdateEducation(index, updatedItem)}
              onRemove={() => handleRemoveEducation(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
