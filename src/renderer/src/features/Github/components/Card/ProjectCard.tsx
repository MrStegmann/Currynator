import React from 'react';
import type { ProjectItem } from '../../types';
import { Star } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  onClick: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (score >= 50) return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
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
          <div className={`px-2 py-1 rounded-full border text-xs font-bold ${getScoreColor(project.scores.globalScore)}`}>
            {project.scores.globalScore}/100
          </div>
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
