import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { SectionAnalysis } from '../../types';
import { FeedbackRenderer } from './FeedbackRenderer';

export const ProjectReadme: React.FC<{ section: SectionAnalysis }> = ({ section }) => {
  return (
    <div className="bg-[#1d2226] border border-[#38434f] rounded-lg p-5">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#38434f]">
        <h3 className="text-lg font-semibold text-[#e9eaec]">{section.title}</h3>
        <span className="text-sm font-bold bg-[#000000] border border-[#38434f] px-3 py-1 rounded-full text-blue-400">
          SCORE: {section.score}/100
        </span>
      </div>
      
      <div className="mb-4 bg-[#000000] p-4 rounded border border-[#38434f] max-h-64 overflow-y-auto prose prose-invert prose-sm text-[#e9eaec]">
        {section.hasContent ? (
          <ReactMarkdown>{section.contentData.raw || ''}</ReactMarkdown>
        ) : (
          <p className="text-slate-400 italic">No README found in the repository root.</p>
        )}
      </div>

      <FeedbackRenderer worseParts={section.worseParts} warnings={section.warnings} tips={section.tips} />
    </div>
  );
};
