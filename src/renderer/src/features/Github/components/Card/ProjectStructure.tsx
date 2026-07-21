import React from 'react';
import type { SectionAnalysis } from '../../types';
import { FeedbackRenderer } from './FeedbackRenderer';
import { Folder, FileText } from 'lucide-react';

export const ProjectStructure: React.FC<{ section: SectionAnalysis }> = ({ section }) => {
  return (
    <div className="bg-[#1d2226] border border-[#38434f] rounded-lg p-5">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#38434f]">
        <h3 className="text-lg font-semibold text-[#e9eaec]">{section.title}</h3>
        <span className="text-sm font-bold bg-[#000000] border border-[#38434f] px-3 py-1 rounded-full text-blue-400">
          SCORE: {section.score}/100
        </span>
      </div>
      
      <div className="mb-4 bg-[#000000] p-4 rounded border border-[#38434f] max-h-64 overflow-y-auto">
        {section.hasContent ? (
          <ul className="text-sm text-[#e9eaec] space-y-1 font-mono">
            {section.contentData.tree.map((node: any, i: number) => (
              <li key={i} className="flex items-center gap-2">
                {node.type === 'tree' ? <Folder className="w-4 h-4 text-blue-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                {node.path}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 italic">No structure data available.</p>
        )}
      </div>

      <FeedbackRenderer worseParts={section.worseParts} warnings={section.warnings} tips={section.tips} />
    </div>
  );
};
