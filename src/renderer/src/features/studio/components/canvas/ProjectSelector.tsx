import React, { useState, useEffect } from 'react';
import type { ProjectItem } from '../../types/resume.types';

interface ProjectSelectorProps {
  currentProjects: ProjectItem[];
  onChangeProjects: (projects: ProjectItem[]) => void;
}

interface GitHubRepoItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  score?: number;
  stars?: number;
}

/**
 * Interactive project selection component.
 * Allows users to view all available GitHub repositories and toggle inclusion in the active resume.
 */
export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  currentProjects,
  onChangeProjects
}) => {
  const [allRepos, setAllRepos] = useState<GitHubRepoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Custom project input state
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customTech, setCustomTech] = useState('');

  useEffect(() => {
    loadGitHubRepositories();
  }, []);

  /**
   * Retrieves and parses stored GitHub profile repositories from local storage.
   */
  const loadGitHubRepositories = () => {
    try {
      const cached = localStorage.getItem('githubProfileData');
      if (cached) {
        const parsed = JSON.parse(cached);
        const rawProjects: any[] = parsed?.profile?.projects || parsed?.projects || [];

        const formatted: GitHubRepoItem[] = rawProjects.map((p) => ({
          id: String(p.id || p.name),
          name: p.name || 'Unnamed Repository',
          description: p.description || p.repoUrl || 'GitHub repository project.',
          technologies: Array.isArray(p.languages)
            ? p.languages
            : p.primaryLanguage
            ? [p.primaryLanguage]
            : ['TypeScript', 'React'],
          githubUrl: p.repoUrl || p.html_url || p.url || '',
          score: p.scores?.globalScore || p.score,
          stars: p.stars
        }));

        setAllRepos(formatted);
      }
    } catch (error) {
      console.error('Failed to load GitHub repositories for ProjectSelector:', error);
    }
  };

  /**
   * Checks whether a repository is currently included in the active resume.
   */
  const isIncluded = (repo: GitHubRepoItem): boolean => {
    return currentProjects.some(
      (p) => p.id === repo.id || p.name.toLowerCase() === repo.name.toLowerCase()
    );
  };

  /**
   * Toggles a GitHub repository's inclusion in the active resume projects list.
   */
  const handleToggleRepo = (repo: GitHubRepoItem) => {
    if (isIncluded(repo)) {
      // Remove
      const updated = currentProjects.filter(
        (p) => p.id !== repo.id && p.name.toLowerCase() !== repo.name.toLowerCase()
      );
      onChangeProjects(updated);
    } else {
      // Add
      const newItem: ProjectItem = {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        technologies: repo.technologies,
        githubUrl: repo.githubUrl,
        score: repo.score
      };
      onChangeProjects([...currentProjects, newItem]);
    }
  };

  /**
   * Removes a project directly from the active resume.
   */
  const handleRemoveProject = (id: string) => {
    const updated = currentProjects.filter((p) => p.id !== id);
    onChangeProjects(updated);
  };

  /**
   * Handles manual creation of a custom project entry.
   */
  const handleAddCustomProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const techArray = customTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newCustom: ProjectItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      description: customDesc.trim() || 'Custom technical project.',
      technologies: techArray.length > 0 ? techArray : ['TypeScript']
    };

    onChangeProjects([...currentProjects, newCustom]);
    setCustomName('');
    setCustomDesc('');
    setCustomTech('');
    setShowAddCustom(false);
  };

  const filteredRepos = allRepos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Section 1: Active Included Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Selected Resume Projects ({currentProjects.length})
          </h4>
          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAddCustom ? 'Cancel Custom Project' : '+ Add Custom Project'}
          </button>
        </div>

        {/* Custom Project Form Modal / Drawer */}
        {showAddCustom && (
          <form onSubmit={handleAddCustomProject} className="p-4 bg-slate-950 rounded-xl border border-blue-900/50 space-y-3">
            <h5 className="text-xs font-bold text-slate-200">Add Custom Project</h5>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Project Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Microservice Engine"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Description</label>
              <textarea
                rows={2}
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Project overview..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Technologies (comma separated)</label>
              <input
                type="text"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                placeholder="React, TypeScript, GraphQL"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Add to Resume
              </button>
            </div>
          </form>
        )}

        {/* Selected Projects List */}
        {currentProjects.length === 0 ? (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No projects currently included in resume. Select repositories from below.
          </div>
        ) : (
          <div className="space-y-2">
            {currentProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-100 truncate">{proj.name}</span>
                    {proj.score && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono">
                        Score: {proj.score}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveProject(proj.id)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all text-xs"
                  title="Remove from resume"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: All GitHub Repositories Selector */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Available GitHub Repositories ({allRepos.length})
            </h4>
            <p className="text-[11px] text-slate-500">
              Select or deselect repositories to include them in your CV.
            </p>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repos..."
            className="w-44 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {allRepos.length === 0 ? (
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
            No GitHub repositories found. Make sure your GitHub account is connected and analyzed in the GitHub page.
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
            No repositories match "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {filteredRepos.map((repo) => {
              const included = isIncluded(repo);
              return (
                <div
                  key={repo.id}
                  onClick={() => handleToggleRepo(repo)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    included
                      ? 'bg-blue-950/40 border-blue-500/60 shadow-sm shadow-blue-950'
                      : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-100 truncate">{repo.name}</span>
                      <input
                        type="checkbox"
                        checked={included}
                        onChange={() => {}} // Controlled via parent card click
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className="font-mono text-slate-400 truncate">
                      {repo.technologies.slice(0, 3).join(', ')}
                    </span>
                    {repo.score && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-mono">
                        Score: {repo.score}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
