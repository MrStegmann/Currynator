import React from 'react';
import type { ProjectItem } from '../../types';
import { Star, Loader2 } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  onClick: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getScoreBadge = () => {
    const status = project.statusScore || (project.scores?.globalScore > 0 ? 'score' : 'unscored');

    if (status === 'wip') {
      return (
        <div className="px-2.5 py-1 rounded-full border text-xs font-semibold bg-amber-500/20 text-amber-400 border-amber-500/50 flex items-center gap-1.5 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" /> Scoring...
        </div>
      );
    }

    if (status === 'score') {
      const score = project.scores.globalScore;
      let colorClass = 'bg-red-500/20 text-red-400 border-red-500/50';
      if (score >= 80) colorClass = 'bg-green-500/20 text-green-400 border-green-500/50';
      else if (score >= 50) colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/50';

      return (
        <div className={`px-2.5 py-1 rounded-full border text-xs font-bold ${colorClass}`}>
          {score}/100
        </div>
      );
    }

    return (
      <div className="px-2.5 py-1 rounded-full border text-xs font-medium bg-[#2a323d] text-slate-300 border-[#38434f]">
        Not scored yet
      </div>
    );
  };

  return (
    <div 
      onClick={() => onClick(project)}
      className="bg-[#1d2226] border border-[#38434f] p-4 rounded-lg cursor-pointer hover:bg-[#252b30] transition-colors flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[#e9eaec] font-semibold text-lg truncate flex-1 pr-2">
            {project.name}
          </h3>
          {getScoreBadge()}
        </div>
        
        <p className="text-[#8c909f] text-sm line-clamp-2 mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#8c909f]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
          {project.primaryLanguage}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" /> {project.stars}
        </span>
      </div>
    </div>
  );
};
