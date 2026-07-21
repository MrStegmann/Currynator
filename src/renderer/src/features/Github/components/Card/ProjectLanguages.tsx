import React from 'react';
import type { SectionAnalysis } from '../../types';
import { FeedbackRenderer } from './FeedbackRenderer';

export const ProjectLanguages: React.FC<{ section: SectionAnalysis }> = ({ section }) => {
  return (
    <div className="bg-[#1d2226] border border-[#38434f] rounded-lg p-5">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#38434f]">
        <h3 className="text-lg font-semibold text-[#e9eaec]">{section.title}</h3>
        <span className="text-sm font-bold bg-[#000000] border border-[#38434f] px-3 py-1 rounded-full text-blue-400">
          SCORE: {section.score}/100
        </span>
      </div>
      
      <div className="mb-4">
        {section.hasContent ? (
          <div className="flex flex-wrap gap-2">
            {section.contentData.languages.map((lang: string) => (
              <span key={lang} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                {lang}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic">No language data available.</p>
        )}
      </div>

      <FeedbackRenderer worseParts={section.worseParts} warnings={section.warnings} tips={section.tips} />
    </div>
  );
};
