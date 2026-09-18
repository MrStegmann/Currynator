import React, { useState } from 'react';
import { GitHubRepository, AIScoreResult } from '../types/projects';
import { Star, GitFork, ExternalLink, Lock, CheckSquare, Square, ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';

interface ProjectCardProps {
  repository: GitHubRepository;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  scoreResult?: AIScoreResult;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  repository,
  isSelected = false,
  onToggleSelect,
  scoreResult
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
    if (score >= 50) return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
  };

  return (
    <div className={`bg-surface-container-lowest border rounded-2xl p-5 transition-all flex flex-col justify-between shadow-sm group ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-outline-variant hover:border-primary/50'}`}>
      <div>
        {/* Card Header with Selection Checkbox */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {onToggleSelect && (
              <button
                type="button"
                onClick={onToggleSelect}
                className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex-shrink-0"
                aria-label={`Select ${repository.name}`}
              >
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-primary" />
                ) : (
                  <Square className="w-5 h-5 text-on-surface-variant/60 group-hover:text-on-surface-variant" />
                )}
              </button>
            )}

            <h4 className="text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors truncate m-0" title={repository.name}>
              {repository.name}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {scoreResult && (
              <span className={`px-2.5 py-0.5 rounded-full text-label-md font-bold border flex items-center gap-1 ${getScoreBadgeColor(scoreResult.totalScore)}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {scoreResult.totalScore}/100
              </span>
            )}

            {repository.private && (
              <span className="p-1 bg-surface-container-high rounded text-on-surface-variant" title="Private Repository">
                <Lock className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Card Description */}
        <p className="text-body-sm text-on-surface-variant line-clamp-2 min-h-[2.5rem] leading-relaxed m-0 mb-3">
          {repository.description || 'No description provided.'}
        </p>

        {/* AI Score Breakdown & Improvement Section */}
        {scoreResult && (
          <div className="mb-4 bg-surface-container/60 border border-outline-variant/60 rounded-xl p-3">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-body-xs font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                AI Score Audit Breakdown ({scoreResult.logs.length} Sections)
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-3 pt-2 border-t border-outline-variant/40 text-body-xs">
                {scoreResult.logs.map((logItem, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between font-medium text-on-surface">
                      <span>{logItem.title}</span>
                      <span className="font-bold text-primary">{logItem.score}/100</span>
                    </div>
                    {logItem.log && (
                      <p className="text-on-surface-variant text-[11px] leading-snug m-0">
                        {logItem.log}
                      </p>
                    )}
                    {logItem.improvements && logItem.improvements.length > 0 && (
                      <ul className="list-disc list-inside text-[11px] text-on-surface-variant/90 space-y-0.5 pl-1 m-0 pt-0.5">
                        {logItem.improvements.map((imp, impIdx) => (
                          <li key={impIdx}>{imp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
