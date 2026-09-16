import React, { useState } from 'react';
import {
  ResumeSectionKey,
  ImportResolutionStrategy,
  SectionResolutionMap,
  RESOLUTION_OPTION_DESCRIPTORS
} from '../types/importResolution';
import { Resume } from '../../../../../shared/schema/resumeSchema';

export interface GranularImportConflictModalProps {
  isOpen: boolean;
  existingData: Partial<Resume>;
  importedData: Partial<Resume>;
  onConfirm: (resolutionMap: SectionResolutionMap) => void;
  onCancel: () => void;
}

interface SectionMeta {
  key: ResumeSectionKey;
  label: string;
}

const SECTIONS: SectionMeta[] = [
  { key: 'basics', label: 'Basic Information' },
  { key: 'work', label: 'Work Experience' },
  { key: 'education', label: 'Education' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'skills', label: 'Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'projects', label: 'Projects' },
  { key: 'references', label: 'References' }
];

export const GranularImportConflictModal: React.FC<GranularImportConflictModalProps> = ({
  isOpen,
  existingData,
  importedData,
  onConfirm,
  onCancel
}) => {
  const [resolutionMap, setResolutionMap] = useState<SectionResolutionMap>({
    basics: 'merge',
    work: 'merge',
    education: 'merge',
    certificates: 'merge',
    skills: 'merge',
    languages: 'merge',
    projects: 'merge',
    references: 'merge'
  });

  if (!isOpen) return null;

  const handleOptionChange = (key: ResumeSectionKey, strategy: ImportResolutionStrategy) => {
    setResolutionMap(prev => ({
      ...prev,
      [key]: strategy
    }));
  };

  const hasSectionData = (data: Partial<Resume>, key: ResumeSectionKey): boolean => {
    const val = data[key];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Object.keys(val).length > 0;
    return false;
  };

  // Only show sections where imported data OR existing data exists
  const activeSections = SECTIONS.filter(
    s => hasSectionData(existingData, s.key) || hasSectionData(importedData, s.key)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-2xl w-full p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-4">
          <div>
            <h3 className="text-title-lg font-semibold text-on-surface m-0">
              Import Conflict Resolution
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Choose how to handle data for each resume section.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg hover:bg-surface-container-low transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {activeSections.map(sec => {
            const currentStrategy = resolutionMap[sec.key];
            const options: ImportResolutionStrategy[] = ['replace', 'keep', 'merge'];

            return (
              <div
                key={sec.key}
                className="bg-surface-container-low border border-outline-variant rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-body-lg text-on-surface m-0">
                    {sec.label}
                  </h4>
                  <span className="text-body-xs font-mono px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                    {sec.key}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {options.map(strat => {
                    const desc = RESOLUTION_OPTION_DESCRIPTORS[strat];
                    const isSelected = currentStrategy === strat;

                    return (
                      <button
                        key={strat}
                        type="button"
                        onClick={() => handleOptionChange(sec.key, strat)}
                        className={`flex flex-col text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary-container/20 ring-2 ring-primary/30'
                            : 'border-outline-variant hover:border-outline bg-surface-container-lowest'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-body-md text-on-surface">
                            {desc.title}
                          </span>
                          <input
                            type="radio"
                            name={`resolution-${sec.key}`}
                            checked={isSelected}
                            onChange={() => handleOptionChange(sec.key, strat)}
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                        </div>
                        <span className="text-body-xs text-on-surface-variant leading-relaxed">
                          {desc.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-outline-variant rounded-xl text-body-md font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Cancel Import
          </button>
          <button
            type="button"
            onClick={() => onConfirm(resolutionMap)}
            className="px-5 py-2 bg-primary text-on-primary font-semibold text-body-md rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
          >
            Confirm Import
          </button>
        </div>
      </div>
    </div>
  );
};
