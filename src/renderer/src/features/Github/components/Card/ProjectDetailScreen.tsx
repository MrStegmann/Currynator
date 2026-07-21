import React from 'react';
import type { ProjectItem } from '../../types';
import { ProjectDescription } from './ProjectDescription';
import { ProjectReadme } from './ProjectReadme';
import { ProjectStructure } from './ProjectStructure';
import { ProjectLanguages } from './ProjectLanguages';
import { ArrowLeft, Star } from 'lucide-react';

interface ProjectDetailScreenProps {
  project: ProjectItem;
  onBack: () => void;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({ project, onBack }) => {
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#1d2226] rounded-full transition-colors text-[#8c909f]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#e9eaec] flex items-center gap-3">
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {project.name}
            </a>
            <span className="text-sm font-normal px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 flex items-center gap-1">
              <Star className="w-4 h-4" /> {project.stars}
            </span>
          </h2>
          <p className="text-[#8c909f] mt-1">{project.description}</p>
        </div>
        <div className="text-center bg-[#1d2226] border border-[#38434f] px-6 py-3 rounded-lg shadow-sm">
          <div className="text-xs text-[#8c909f] font-semibold uppercase tracking-wider mb-1">Global Score</div>
          <div className="text-3xl font-bold text-blue-400">{project.scores.globalScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <ProjectDescription section={project.sections.description} />
          <ProjectStructure section={project.sections.structure} />
        </div>
        <div className="flex flex-col gap-6">
          <ProjectReadme section={project.sections.readme} />
          <ProjectLanguages section={project.sections.languages} />
        </div>
      </div>
    </div>
  );
};
