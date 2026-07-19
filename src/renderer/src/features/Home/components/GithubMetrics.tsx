import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ProjectGithubCard } from './ProjectGithubCard';

interface GithubMetricsProps {
  metrics: {
    profileReadme: {
      score: number;
      exists: boolean;
      improvementTips: string[];
    };
    languages: Array<{
      name: string;
      percentage: number;
      color: string;
    }>;
    topProjects: Array<{
      repositoryName: string;
      description: string;
      readmeShort: string;
      languages: string[];
      score: number;
      strengths: string[];
      areasForImprovement: string[];
      justification: string;
    }>;
  };
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const GithubMetrics: React.FC<GithubMetricsProps> = ({ metrics, onRefresh, isRefreshing }) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Profile README Evaluator */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-on-surface border-b border-border-subtle mb-2.5 pb-2">Profile README.md Evaluator</h3>
        
        {metrics.profileReadme.exists ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-primary">{metrics.profileReadme.score}/100</div>
              <div className="text-sm text-on-surface-variant flex-1">
                Your profile README is currently active. A higher score means better visibility and engagement.
              </div>
            </div>
            
            {metrics.profileReadme.improvementTips.length > 0 && (
              <div className="bg-surface-deep p-4 rounded-lg border border-yellow-500/30">
                <h4 className="text-sm font-bold text-yellow-500 mb-2">Tips to Improve:</h4>
                <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1">
                  {metrics.profileReadme.improvementTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface-deep p-4 rounded-lg border border-red-500/30 text-center">
            <h4 className="text-sm font-bold text-red-400 mb-2">Missing Profile README</h4>
            <p className="text-sm text-on-surface-variant mb-3">Create a repository with your exact username to establish a profile README.</p>
            <div className="text-3xl font-black text-red-500/50">0/100</div>
          </div>
        )}
      </div>

      {/* Polyglot Language Distribution */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-on-surface border-b border-border-subtle mb-2.5 pb-2">Language Distribution</h3>
        
        {metrics.languages.length > 0 ? (
          <>
            <div className="h-4 w-full flex rounded-full overflow-hidden mb-4">
              {metrics.languages.map(lang => (
                <div 
                  key={lang.name} 
                  style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} 
                  className="h-full"
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {metrics.languages.map(lang => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="font-semibold text-on-surface">{lang.name}</span>
                  <span className="text-on-surface-variant">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-on-surface-variant">Not enough data to calculate language distribution.</p>
        )}
      </div>

      {/* Top Projects Quality Valuation */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-border-subtle mb-2.5 pb-2">
          <h3 className="text-lg font-bold text-on-surface">Top Projects Quality</h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md bg-surface-deep text-on-surface border border-border-subtle hover:bg-surface-hover transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh GitHub Metrics"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
        
        {metrics.topProjects && metrics.topProjects.length > 0 ? (
          <div className="flex flex-col">
            {metrics.topProjects.map((proj, idx) => (
              <ProjectGithubCard key={idx} project={proj} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-deep p-5 rounded-xl border border-border-subtle">
            <h4 className="font-bold text-on-surface mb-2">No projects founded</h4>
            <p className="text-sm text-on-surface-variant mb-3">
              We couldn't find enough valid projects to analyze. The following types of repositories are skipped:
            </p>
            <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1">
              <li>Forks of other projects</li>
              <li>Archived repositories</li>
              <li>Empty repositories (0 bytes)</li>
              <li>Profile README repository (same as username)</li>
              <li>Repositories without recognizable source code</li>
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};

