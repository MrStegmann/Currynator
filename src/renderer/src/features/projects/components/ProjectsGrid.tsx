import React from 'react';
import { GitHubRepository, AIScoreResult } from '../types/projects';
import { ProjectCard } from './ProjectCard';
import { FolderGit2, SearchX, RotateCcw } from 'lucide-react';

interface ProjectsGridProps {
  repositories: GitHubRepository[];
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  selectedRepoIds?: number[];
  onToggleSelectRepo?: (id: number) => void;
  projectScores?: Record<number, AIScoreResult>;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  repositories,
  hasActiveFilters = false,
  onResetFilters,
  selectedRepoIds = [],
  onToggleSelectRepo,
  projectScores = {}
}) => {
  if (!repositories || repositories.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <SearchX className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
          <h3 className="text-title-md font-semibold text-on-surface m-0">
            No Matching Projects
          </h3>
          <p className="text-body-sm text-on-surface-variant m-0">
            No projects match your current filter criteria. Try adjusting your search text or filters.
          </p>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 mt-2 bg-primary text-on-primary rounded-xl text-body-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      );
    }

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map(repo => (
        <ProjectCard
          key={repo.id}
          repository={repo}
          isSelected={selectedRepoIds.includes(repo.id)}
          onToggleSelect={onToggleSelectRepo ? () => onToggleSelectRepo(repo.id) : undefined}
          scoreResult={projectScores[repo.id]}
        />
      ))}
    </div>
  );
};
