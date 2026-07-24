import React, { useState } from 'react';
import type { ProjectItem } from '../../types';
import { ProjectDescription } from './ProjectDescription';
import { ProjectReadme } from './ProjectReadme';
import { ProjectStructure } from './ProjectStructure';
import { ProjectLanguages } from './ProjectLanguages';
import { ArrowLeft, Star, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useNotification } from '../../../../context/NotificationContext';

interface ProjectDetailScreenProps {
  project: ProjectItem;
  onBack: () => void;
  onProjectUpdated?: (updatedProject: ProjectItem) => void;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  project: initialProject,
  onBack,
  onProjectUpdated
}) => {
  const [project, setProject] = useState<ProjectItem>(initialProject);
  const [isScoring, setIsScoring] = useState(false);
  const [isRefetchingRepo, setIsRefetchingRepo] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const { addNotification } = useNotification();

  const handleScoreProject = async () => {
    try {
      setIsScoring(true);
      setStatusMessage('Sampling code & evaluating with Groq AI...');

      const unsubscribe = (window as any).electronAPI?.onGithubAnalysisProgress?.((data: { stageText: string }) => {
        if (data.stageText) setStatusMessage(data.stageText);
      });

      const res = await (window as any).electronAPI?.evaluateGithubProject(project.id);
      if (unsubscribe) unsubscribe();

      if (res?.success && res.data) {
        setProject(res.data);
        if (onProjectUpdated) {
          onProjectUpdated(res.data);
        }
        addNotification(`Project ${res.data.name} evaluated successfully!`, 'success');
      } else {
        addNotification(res?.error || 'Failed to score project with Groq AI.', 'error');
      }
    } catch (err: any) {
      addNotification(err.message || 'Error scoring project.', 'error');
    } finally {
      setIsScoring(false);
    }
  };

  const handleRefetchProject = async () => {
    try {
      setIsRefetchingRepo(true);
      const res = await (window as any).electronAPI?.refetchSingleProject(project.id);
      if (res?.success && res.data) {
        setProject(res.data);
        if (onProjectUpdated) {
          onProjectUpdated(res.data);
        }
        addNotification(`Repository ${res.data.name} re-fetched from GitHub!`, 'success');
      } else {
        addNotification(res?.error || 'Failed to re-fetch repository data.', 'error');
      }
    } catch (err: any) {
      addNotification(err.message || 'Error re-fetching repository data.', 'error');
    } finally {
      setIsRefetchingRepo(false);
    }
  };

  const status = isScoring ? 'wip' : (project.statusScore || (project.scores?.globalScore > 0 ? 'score' : 'unscored'));

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300 relative">
      <div className="flex items-center gap-4 flex-wrap">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#1d2226] rounded-full transition-colors text-[#8c909f]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-[240px]">
          <h2 className="text-2xl font-bold text-[#e9eaec] flex items-center gap-3">
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {project.name}
            </a>
            <span className="text-sm font-normal px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 flex items-center gap-1">
              <Star className="w-4 h-4" /> {project.stars}
            </span>

            {/* Section-Specific Refetch Repo Button */}
            <button
              onClick={handleRefetchProject}
              disabled={isRefetchingRepo || isScoring}
              className="px-3 py-1 bg-[#2d3741] hover:bg-[#38434f] text-[#e9eaec] rounded-md transition-colors text-xs font-medium border border-[#38434f] flex items-center gap-1.5 disabled:opacity-50"
              title="Re-fetch this repository data from GitHub"
            >
              {isRefetchingRepo ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Refetch Repo</span>
                </>
              )}
            </button>
          </h2>
          <p className="text-[#8c909f] mt-1">{project.description}</p>
        </div>

        {/* Global Score & Score Button Area */}
        <div className="flex items-center gap-3 bg-[#1d2226] border border-[#38434f] px-5 py-3 rounded-lg shadow-sm">
          <div className="flex flex-col items-end">
            <div className="text-xs text-[#8c909f] font-semibold uppercase tracking-wider mb-1">Global Score</div>
            
            {status === 'score' ? (
              <div className="text-3xl font-bold text-blue-400">{project.scores.globalScore}</div>
            ) : status === 'wip' ? (
              <div className="flex items-center gap-2 text-sm text-amber-400 font-medium py-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scoring with Groq AI...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 font-medium">Not scored yet</span>
                <button
                  onClick={handleScoreProject}
                  disabled={isScoring || isRefetchingRepo}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-md shadow transition-all duration-200 flex items-center gap-1.5 border border-blue-400/30"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Score Project
                </button>
              </div>
            )}
          </div>

          {status === 'score' && (
            <button
              onClick={handleScoreProject}
              disabled={isScoring || isRefetchingRepo}
              className="p-2 bg-[#2d3741] hover:bg-[#38434f] text-slate-300 rounded-md transition-colors text-xs flex items-center gap-1 border border-[#38434f]"
              title="Re-evaluate with Groq AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Re-score
            </button>
          )}
        </div>
      </div>

      {(isScoring || isRefetchingRepo) && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-xs text-amber-300 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>{isRefetchingRepo ? 'Syncing latest repository data from GitHub...' : statusMessage}</span>
        </div>
      )}

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
