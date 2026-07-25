import React from 'react';
import type { ResumeData } from '../../types/resume.types';
import { ResumeFormEditor } from './ResumeFormEditor';
import { ResumeATSPreview } from './ResumeATSPreview';
import { OptimizationDiffView } from './OptimizationDiffView';

interface ResumeContentContainerProps {
  resume: ResumeData;
  viewMode: 'edit' | 'preview' | 'optimization-diff';
  diffData: {
    original: ResumeData | null;
    proposed: ResumeData | null;
  } | null;
  onChange: (updatedResume: ResumeData) => void;
  onAcceptDiff: (updatedResume: ResumeData) => void;
  onRejectDiff: () => void;
}

/**
 * Switcher component rendering active resume view state (Form Editor, ATS Preview, or Diff View).
 */
export const ResumeContentContainer: React.FC<ResumeContentContainerProps> = ({
  resume,
  viewMode,
  diffData,
  onChange,
  onAcceptDiff,
  onRejectDiff
}) => {
  if (viewMode === 'optimization-diff' && diffData?.original && diffData?.proposed) {
    return (
      <OptimizationDiffView
        original={diffData.original}
        proposed={diffData.proposed}
        onAccept={onAcceptDiff}
        onReject={onRejectDiff}
      />
    );
  }

  if (viewMode === 'preview') {
    return <ResumeATSPreview resume={resume} />;
  }

  return <ResumeFormEditor resume={resume} onChange={onChange} />;
};
