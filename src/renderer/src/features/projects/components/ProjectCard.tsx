import React from 'react';
import { GitHubRepository } from '../types/projects';
import { Star, GitFork, ExternalLink, Lock } from 'lucide-react';

interface ProjectCardProps {
  repository: GitHubRepository;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ repository }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm group">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors truncate m-0" title={repository.name}>
            {repository.name}
          </h4>
          {repository.private && (
            <span className="p-1 bg-surface-container-high rounded text-on-surface-variant flex-shrink-0" title="Private Repository">
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Card Description */}
        <p className="text-body-sm text-on-surface-variant line-clamp-2 min-h-[2.5rem] leading-relaxed m-0 mb-4">
          {repository.description || 'No description provided.'}
        </p>
      </div>

      {/* Card Footer Metadata */}
      <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between text-body-xs text-on-surface-variant">
        <div className="flex items-center gap-3">
          {repository.language && (
            <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-medium">
              {repository.language}
            </span>
          )}

          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{repository.stargazers_count}</span>
          </div>

          {repository.forks_count > 0 && (
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{repository.forks_count}</span>
            </div>
          )}
        </div>

        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label={`Open ${repository.name} on GitHub`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
