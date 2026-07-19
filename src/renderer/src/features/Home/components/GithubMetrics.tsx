import React from 'react';

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
      projectName: string;
      repoScore: number;
      structuralFeedback: string[];
      missingReadme: boolean;
      descriptionTip: string | null;
    }>;
  };
}

export const GithubMetrics: React.FC<GithubMetricsProps> = ({ metrics }) => {
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
        <h3 className="text-lg font-bold text-on-surface border-b border-border-subtle mb-2.5 pb-2">Top Projects Quality</h3>
        
        {metrics.topProjects.length > 0 ? (
          <div className="flex flex-col gap-4">
            {metrics.topProjects.map(proj => (
              <div key={proj.projectName} className="p-4 border border-border-subtle rounded-lg bg-surface-deep">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-on-surface">{proj.projectName}</h4>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                    proj.repoScore >= 80 ? 'bg-green-500/20 text-green-400' :
                    proj.repoScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {proj.repoScore}/100
                  </span>
                </div>
                
                {proj.structuralFeedback.length > 0 || proj.descriptionTip ? (
                  <ul className="list-disc pl-5 text-sm text-on-surface-variant mt-2 space-y-1">
                    {proj.descriptionTip && <li>{proj.descriptionTip}</li>}
                    {proj.structuralFeedback.map((fb, idx) => <li key={idx}>{fb}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-green-400 mt-2">✓ Repository is well-structured.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">No public projects found to analyze.</p>
        )}
      </div>

    </div>
  );
};
