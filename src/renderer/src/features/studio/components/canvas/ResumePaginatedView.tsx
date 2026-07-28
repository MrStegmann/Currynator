import React, { useMemo } from 'react';
import type { ResumeData } from '../../types/resume.types';
import { ResumeATSPreview } from './ResumeATSPreview';
import { partitionResumeIntoA4Pages } from '../../utils/paginationUtils';

interface ResumePaginatedViewProps {
  resume: ResumeData;
  containerId?: string;
}

/**
 * Google Docs-style multi-page A4 canvas renderer for ATS resumes.
 * Automatically partitions large resume data into distinct A4 paper pages (210mm x 297mm)
 * with visual gaps, shadows, and page count indicators.
 */
export const ResumePaginatedView: React.FC<ResumePaginatedViewProps> = ({
  resume,
  containerId = 'ats-resume-preview-document'
}) => {
  const pages = useMemo(() => partitionResumeIntoA4Pages(resume), [resume]);

  if (pages.length <= 1) {
    return (
      <div className="w-full flex flex-col items-center p-6 overflow-x-auto">
        <ResumeATSPreview resume={resume} containerId={containerId} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-10 py-8 overflow-x-auto" id={containerId}>
      {pages.map((page) => (
        <div key={page.pageNumber} className="flex flex-col items-center space-y-2">
          {/* Page Badge Header */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1e293b] border border-[#334155] rounded-full text-[11px] font-semibold text-[#94a3b8] shadow-md select-none">
            <span>Page {page.pageNumber} of {pages.length}</span>
          </div>

          {/* A4 Paper Sheet */}
          <ResumeATSPreview
            resume={resume}
            containerId={`${containerId}-page-${page.pageNumber}`}
            showMainHeader={page.showMainHeader}
            leftItemsOverride={page.leftItems}
            rightItemsOverride={page.rightItems}
            pageNumber={page.pageNumber}
            totalPages={pages.length}
          />
        </div>
      ))}
    </div>
  );
};
