import React, { useState } from 'react';
import type { SkillCategory } from '../../../types';
import { Plus, Trash2, X } from 'lucide-react';

export interface SkillsFormProps {
  skills: SkillCategory[];
  onChange: (updatedSkills: SkillCategory[]) => void;
}

interface SkillTagEditorProps {
  skillsList: string[];
  onChange: (updatedSkills: string[]) => void;
}

/**
 * Interactive tag/chip editor for skills within a category.
 *
 * @param props - Skill strings array and update callback.
 * @returns React element.
 */
export const SkillTagEditor: React.FC<SkillTagEditorProps> = ({ skillsList, onChange }) => {
  const [newSkillText, setNewSkillText] = useState('');

  const handleAddSkill = () => {
    const trimmed = newSkillText.trim();
    if (!trimmed) return;
    if (!skillsList.includes(trimmed)) {
      onChange([...skillsList, trimmed]);
    }
    setNewSkillText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skillsList.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-2 mt-2">
      <label className="block text-xs font-medium text-slate-400">Skills / Technologies</label>
      
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-900 border border-slate-800 rounded-lg">
        {skillsList.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-md text-xs font-medium"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="hover:text-red-400 transition-colors"
              title={`Remove ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {skillsList.length === 0 && (
          <span className="text-xs text-slate-500 italic py-0.5">No skills added in this category yet.</span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkillText}
          placeholder="Type skill and press Enter (e.g. React, Node.js, Docker)"
          onChange={(e) => setNewSkillText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

interface SkillCategoryCardProps {
  categoryItem: SkillCategory;
  onUpdate: (updatedCategory: SkillCategory) => void;
  onRemove: () => void;
}

/**
 * Single skill category item editor card component.
 *
 * @param props - Category data, update callback, and remove callback.
 * @returns React element.
 */
export const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({
  categoryItem,
  onUpdate,
  onRemove
}) => {
  const handleCategoryNameChange = (val: string) => {
    onUpdate({ ...categoryItem, category: val });
  };

  const handleSkillsListChange = (updatedSkillsList: string[]) => {
    onUpdate({ ...categoryItem, skills: updatedSkillsList });
  };

  return (
    <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1">Category Name</label>
          <input
            type="text"
            value={categoryItem.category}
            placeholder="e.g. Frontend Development, Languages, DevOps"
            onChange={(e) => handleCategoryNameChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 mt-5 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded transition-colors"
          title="Remove Category"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <SkillTagEditor
        skillsList={categoryItem.skills}
        onChange={handleSkillsListChange}
      />
    </div>
  );
};

/**
 * Form section component for managing categorized technical and soft skills.
 *
 * @param props - Component props containing skill categories array and change handler.
 * @returns React component.
 */
export const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onChange }) => {
  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      category: '',
      skills: []
    };
    onChange([...skills, newCategory]);
  };

  const handleUpdateCategory = (index: number, updatedCategory: SkillCategory) => {
    const updated = [...skills];
    updated[index] = updatedCategory;
    onChange(updated);
  };

  const handleRemoveCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
          Skills & Competencies
        </h3>
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          No skill categories added yet. Click &quot;Add Category&quot; to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {skills.map((categoryItem, index) => (
            <SkillCategoryCard
              key={index}
              categoryItem={categoryItem}
              onUpdate={(updatedCategory) => handleUpdateCategory(index, updatedCategory)}
              onRemove={() => handleRemoveCategory(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
