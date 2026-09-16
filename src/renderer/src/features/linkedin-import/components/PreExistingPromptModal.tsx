import React from 'react';
import { GranularImportConflictModal } from './GranularImportConflictModal';
import { SectionResolutionMap } from '../types/importResolution';
import { Resume } from '../../../../../shared/schema/resumeSchema';

export interface PreExistingPromptModalProps {
  isOpen: boolean;
  existingData?: Partial<Resume>;
  importedData?: Partial<Resume>;
  onConfirm?: (resolutionMap: SectionResolutionMap) => void;
  onReplace?: () => void;
  onKeep?: () => void;
  onCancel?: () => void;
}

export const PreExistingPromptModal: React.FC<PreExistingPromptModalProps> = ({
  isOpen,
  existingData = {},
  importedData = {},
  onConfirm,
  onReplace,
  onKeep,
  onCancel
}) => {
  const handleConfirm = (map: SectionResolutionMap) => {
    if (onConfirm) {
      onConfirm(map);
    } else if (onReplace) {
      onReplace();
    }
  };

  return (
    <GranularImportConflictModal
      isOpen={isOpen}
      existingData={existingData}
      importedData={importedData}
      onConfirm={handleConfirm}
      onCancel={onCancel || (() => {})}
    />
  );
};
