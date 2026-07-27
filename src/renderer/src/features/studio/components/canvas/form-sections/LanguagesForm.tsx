import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface LanguagesFormProps {
  languages: string[];
  onChange: (updatedLanguages: string[]) => void;
}

/**
 * Form section component for managing candidate spoken and written languages.
 *
 * @param props - Component props containing languages array and change handler.
 * @returns React component.
 */
export const LanguagesForm: React.FC<LanguagesFormProps> = ({ languages, onChange }) => {
  const [newLanguage, setNewLanguage] = useState('');

  const handleLanguageChange = (index: number, val: string) => {
    const updated = [...languages];
    updated[index] = val;
    onChange(updated);
  };

  const handleAddLanguage = () => {
    const trimmed = newLanguage.trim();
    if (!trimmed) {
      onChange([...languages, '']);
      return;
    }
    onChange([...languages, trimmed]);
    setNewLanguage('');
  };

  const handleRemoveLanguage = (index: number) => {
    onChange(languages.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
          Languages
        </h3>
        <button
          type="button"
          onClick={handleAddLanguage}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Language
        </button>
      </div>

      {languages.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          No languages added yet. Click &quot;Add Language&quot; to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={lang}
                placeholder="e.g. English (Native), Spanish (Full Professional)"
                onChange={(e) => handleLanguageChange(index, e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveLanguage(index)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                title="Remove Language"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1 border-t border-slate-800/60">
        <input
          type="text"
          value={newLanguage}
          placeholder="Quick add language (e.g. German - B2) and press Enter"
          onChange={(e) => setNewLanguage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddLanguage}
          className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};
