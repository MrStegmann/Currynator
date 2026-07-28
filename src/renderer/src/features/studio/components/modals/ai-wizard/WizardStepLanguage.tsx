import React from 'react';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type LanguageOption } from '../../../constants/languages';

export interface WizardStepLanguageProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

/**
 * Step 1 component for selecting target AI resume output language preference.
 *
 * @param props - Component props containing active selected language and change handler.
 * @returns React component.
 */
export const WizardStepLanguage: React.FC<WizardStepLanguageProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div className="space-y-4 py-2">
      <div className="flex items-start gap-3 p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl">
        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-100">Select Resume Output Language</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Choose your preferred language for the AI optimization. All subsequent section proposals, titles, and summaries will be generated in your chosen language.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="language-select-input" className="block text-xs font-semibold text-slate-300">
          Output Language Preference
        </label>
        <select
          id="language-select-input"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((option: LanguageOption) => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.value.toUpperCase()})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
