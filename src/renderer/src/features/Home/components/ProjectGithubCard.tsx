import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, AlertTriangle, CheckCircle, Info, Star } from 'lucide-react';
import clsx from 'clsx';

export interface ProjectGithubCardProps {
  project: {
    repositoryName: string;
    description: string;
    readmeShort: string;
    languages: string[];
    score: number;
    strengths: string[];
    areasForImprovement: string[];
    justification: string;
  };
}

export const ProjectGithubCard: React.FC<ProjectGithubCardProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Score visual feedback
  const isExcellent = project.score >= 80;
  const isGood = project.score >= 50 && project.score < 80;
  const scoreColorClass = isExcellent 
    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
    : isGood 
      ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' 
      : 'text-red-400 bg-red-500/10 border-red-500/20';

  const scoreIcon = isExcellent 
    ? <CheckCircle className="w-5 h-5" /> 
    : isGood 
      ? <Info className="w-5 h-5" /> 
      : <AlertTriangle className="w-5 h-5" />;

  return (
    <div className="w-full border-2 border-border-subtle rounded-xl bg-surface-deep overflow-hidden transition-all duration-300">
      {/* Accordion Header (Always visible) */}
      <div 
        className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-surface-hover transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Code2 className="text-primary w-6 h-6" />
          <h4 className="font-bold text-lg text-on-surface">{project.repositoryName}</h4>
        </div>
        
        <div className="flex items-center gap-4 mt-3 sm:mt-0">
          <div className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-sm", scoreColorClass)}>
            {scoreIcon}
            <span>Score: {project.score}/100</span>
          </div>
          <div className="text-on-surface-variant p-1 rounded-full hover:bg-surface-light">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-5 border-t border-border-subtle bg-surface animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Column 1: Project Info */}
            <div className="flex flex-col gap-4">
              <div>
                <h5 className="text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">About</h5>
                <p className="text-sm text-on-surface">
                  {project.description || project.readmeShort || "No description or README available."}
                </p>
              </div>
              
              <div className="mt-auto pt-4">
                <h5 className="text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Languages</h5>
                <div className="flex flex-wrap gap-2">
                  {project.languages && project.languages.length > 0 ? (
                    project.languages.map((lang, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-surface-deep text-on-surface border border-border-subtle rounded-md text-xs font-semibold">
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant">Unknown</span>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: AI Evaluation */}
            <div className="flex flex-col gap-4">
              <div>
                <h5 className="text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-primary" />
                  AI Evaluation
                </h5>
                <div className="bg-surface-deep rounded-lg p-4 border border-border-subtle">
                  
                  {project.strengths && project.strengths.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-xs font-bold text-green-400 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Strengths
                      </h6>
                      <ul className="list-disc pl-5 text-sm text-on-surface space-y-1">
                        {project.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.areasForImprovement && project.areasForImprovement.length > 0 && (
                    <div>
                      <h6 className="text-xs font-bold text-yellow-400 mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Areas for Improvement
                      </h6>
                      <ul className="list-disc pl-5 text-sm text-on-surface space-y-1">
                        {project.areasForImprovement.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* Justification Footer */}
          <div className="mt-6 pt-4 border-t border-border-subtle">
            <h5 className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">AI Justification</h5>
            <p className="text-sm text-on-surface italic bg-surface-deep p-3 rounded-lg border-l-4 border-primary">
              "{project.justification}"
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
