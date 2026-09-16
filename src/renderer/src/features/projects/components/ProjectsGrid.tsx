import React from 'react';
import { GitHubRepository } from '../types/projects';
import { ProjectCard } from './ProjectCard';
import { FolderGit2 } from 'lucide-react';

interface ProjectsGridProps {
  repositories: GitHubRepository[];
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ repositories }) => {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
        <FolderGit2 className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
        <h3 className="text-title-md font-semibold text-on-surface m-0">
          No Repositories Found
        </h3>
        <p className="text-body-sm text-on-surface-variant m-0">
          There are no public or accessible GitHub repositories linked to this account.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {repositories.map(repo => (
        <ProjectCard key={repo.id} repository={repo} />
      ))}
    </div>
  );
};
