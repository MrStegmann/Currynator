import React, { useState, useEffect, useRef } from 'react';
import type { UserGitHubProfile, ProjectItem } from './types';
import { ProfileHeader } from './components/ProfileHeader';
import { ProjectCard } from './components/Card/ProjectCard';
import { ProjectDetailScreen } from './components/Card/ProjectDetailScreen';
import { useNotification } from '../../context/NotificationContext';
import { RefreshCw, Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const Github: React.FC = () => {
  const [profile, setProfile] = useState<UserGitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  // Loading Progress & Stage Feedback State
  const [progress, setProgress] = useState(5);
  const [liveStageText, setLiveStageText] = useState<string>('Connecting to GitHub API...');

  // Section Refetching State
  const [isRefreshingProjects, setIsRefreshingProjects] = useState(false);

  // Pagination & Sync State
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const { addNotification } = useNotification();

  const syncIdRef = useRef<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgressSimulation = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(5);
    setLiveStageText('Connecting to GitHub API & fetching metadata...');

    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) {
          return prev + Math.random() * 2 + 0.5;
        }
        return prev;
      });
    }, 400);
  };

  const stopProgressSimulation = (complete = true) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (complete) {
      setProgress(100);
      setLiveStageText('Finalizing evaluation metrics...');
    }
  };

  const startBackgroundSync = async (initialProfile: UserGitHubProfile) => {
    syncIdRef.current += 1;
    const currentSyncId = syncIdRef.current;

    setIsSyncing(true);
    let hasMoreData = true;
    let activeProfile = initialProfile;

    while (hasMoreData && currentSyncId === syncIdRef.current) {
      try {
        const res = await (window as any).electronAPI?.analyzeGithubProjects();
        if (currentSyncId !== syncIdRef.current) break; // cancelled

        if (res?.success && res.data) {
          const newProjects = res.data;
          if (newProjects.length < ITEMS_PER_PAGE) {
            hasMoreData = false;
          }

          if (newProjects.length > 0) {
            activeProfile = {
              ...activeProfile,
              projects: [...activeProfile.projects, ...newProjects]
            };
            setProfile(activeProfile);
            setHasMore(hasMoreData);
            localStorage.setItem('githubProfileData', JSON.stringify({ profile: activeProfile, lastFetch: Date.now() }));
          }
        } else {
          hasMoreData = false;
        }
      } catch (e) {
        console.error('Background sync error', e);
        hasMoreData = false;
      }
    }

    if (currentSyncId === syncIdRef.current) {
      setIsSyncing(false);
      setHasMore(hasMoreData);
    }
  };

  const fetchProfile = async (forceRefetch = false) => {
    try {
      setLoading(true);
      setError(null);
      syncIdRef.current += 1; // Stop any running background sync
      setIsSyncing(false);

      if (forceRefetch) {
        localStorage.removeItem('githubProfileData');
        setCurrentPage(1);
        setHasMore(true);
        startProgressSimulation();
      } else {
        const cached = localStorage.getItem('githubProfileData');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setProfile(parsed.profile);
            setLastFetch(parsed.lastFetch);

            if (parsed.profile.projects.length % ITEMS_PER_PAGE !== 0 || parsed.profile.projects.length === 0) {
              setHasMore(false);
            } else {
              setHasMore(true);
            }

            setLoading(false);
            return;
          } catch (e) {
            // invalid cache, ignore and fetch
          }
        }
        startProgressSimulation();
      }

      const res = await (window as any).electronAPI?.analyzeGithub();
      if (res?.success && res.data) {
        stopProgressSimulation(true);
        setProfile(res.data);
        const now = Date.now();
        setLastFetch(now);
        const initialHasMore = res.data.projects.length === ITEMS_PER_PAGE;
        setHasMore(initialHasMore);
        localStorage.setItem('githubProfileData', JSON.stringify({ profile: res.data, lastFetch: now }));

        setTimeout(() => {
          setLoading(false);
          if (initialHasMore) {
            startBackgroundSync(res.data);
          }
        }, 350);
      } else {
        stopProgressSimulation(false);
        setError(res?.error || 'Failed to analyze GitHub profile. Make sure you connected your GitHub account.');
        setLoading(false);
      }
    } catch (err: any) {
      stopProgressSimulation(false);
      setError(err.message || 'An error occurred while fetching GitHub data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Subscribe to IPC real-time progress updates from backend logic
    const unsubscribe = (window as any).electronAPI?.onGithubAnalysisProgress?.((data: { stageText: string; progressPercent: number }) => {
      if (data.stageText) {
        setLiveStageText(data.stageText);
      }
      if (typeof data.progressPercent === 'number') {
        setProgress(prev => Math.max(prev, data.progressPercent));
      }
    });

    fetchProfile(false);

    return () => {
      syncIdRef.current += 1; // Cleanup on unmount
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleProjectUpdated = (updatedProject: ProjectItem) => {
    if (!profile) return;
    const updatedProjects = profile.projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    const updatedProfile = { ...profile, projects: updatedProjects };
    setProfile(updatedProfile);
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
    localStorage.setItem('githubProfileData', JSON.stringify({ profile: updatedProfile, lastFetch: lastFetch || Date.now() }));
  };

  const handleProfileReadmeUpdated = (updatedReadme: any) => {
    if (!profile) return;
    const updatedProfile = { ...profile, profileReadme: updatedReadme };
    setProfile(updatedProfile);
    localStorage.setItem('githubProfileData', JSON.stringify({ profile: updatedProfile, lastFetch: lastFetch || Date.now() }));
  };

  const handleRefetchGithubProjects = async () => {
    if (!profile) return;
    try {
      setIsRefreshingProjects(true);
      const res = await (window as any).electronAPI?.refetchGithubProjects();
      if (res?.success && res.data) {
        const updatedProfile = { ...profile, projects: res.data };
        setProfile(updatedProfile);
        const now = Date.now();
        setLastFetch(now);
        localStorage.setItem('githubProfileData', JSON.stringify({ profile: updatedProfile, lastFetch: now }));
        addNotification('Repositories re-fetched from GitHub!', 'success');
      } else {
        addNotification(res?.error || 'Failed to re-fetch repositories.', 'error');
      }
    } catch (err: any) {
      addNotification(err.message || 'Error re-fetching repositories.', 'error');
    } finally {
      setIsRefreshingProjects(false);
    }
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;

    if (profile && profile.projects.length > currentPage * ITEMS_PER_PAGE) {
      setCurrentPage(nextPage);
    } else if (isSyncing) {
      addNotification('Projects are still fetching. Please wait a moment.', 'warning');
    } else if (hasMore) {
      addNotification('Fetching remaining projects...', 'info');
      startBackgroundSync(profile!);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] w-full max-w-xl mx-auto text-center px-4 animate-in fade-in duration-300">
        <div className="bg-[#1d2226] border border-[#38434f] rounded-2xl p-8 shadow-2xl w-full flex flex-col items-center relative overflow-hidden">
          {/* Ambient glow decoration */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Animated Spinner Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-xl">
              ⚡
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#e9eaec] mb-1">
            Analyzing GitHub Profile
          </h2>

          {/* Dynamic Real-time Stage Text */}
          <p className="text-xs sm:text-sm text-blue-400 font-medium min-h-[28px] mb-6 transition-all duration-300 flex items-center justify-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block flex-shrink-0"></span>
            <span className="truncate">{liveStageText}</span>
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-[#14181b] border border-[#2d3741] rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner relative mb-3">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
            ></div>
          </div>

          {/* Progress Stats Footer */}
          <div className="w-full flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Groq AI Pipeline</span>
            <span className="font-bold text-[#e9eaec] bg-[#2d3741] px-2.5 py-0.5 rounded border border-[#38434f]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-[#e9eaec]">Error Loading GitHub Data</h2>
        <p className="text-sm text-red-300 mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  if (selectedProject) {
    return (
      <ProjectDetailScreen 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
        onProjectUpdated={handleProjectUpdated}
      />
    );
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = profile.projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const canGoNext = profile.projects.length > currentPage * ITEMS_PER_PAGE || hasMore;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-300 relative">
      {/* Global Refresh Button Container */}
      <div className="flex justify-end w-full">
        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="text-xs text-slate-400">
              Last fetch: {new Date(lastFetch).toLocaleString()}
            </span>
          )}
          <button
            onClick={() => fetchProfile(true)}
            disabled={loading}
            className="px-3 py-1.5 bg-[#2d3741] hover:bg-[#38434f] text-[#e9eaec] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 text-sm border border-[#38434f]"
            title="Refresh All GitHub Profile & Repos Data"
          >
            Refresh All
          </button>
        </div>
      </div>

      <ProfileHeader profile={profile} onProfileReadmeUpdated={handleProfileReadmeUpdated} />

      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h3 className="text-xl font-semibold text-[#e9eaec] flex items-center gap-2">
            <span>Repositories Analysis</span>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">
              {profile.projects.length} imported
            </span>
            {isSyncing && (
              <span className="text-xs text-amber-400 animate-pulse ml-2 flex items-center gap-1">
                <span className="animate-spin inline-block">⟳</span> Syncing...
              </span>
            )}
          </h3>

          {/* Section-Specific Refetch Button for Repositories */}
          <button
            onClick={handleRefetchGithubProjects}
            disabled={isRefreshingProjects || loading}
            className="px-3 py-1.5 bg-[#2d3741] hover:bg-[#38434f] text-[#e9eaec] rounded-md transition-colors text-xs font-medium border border-[#38434f] flex items-center gap-1.5 disabled:opacity-50"
            title="Re-fetch all repositories list from GitHub"
          >
            {isRefreshingProjects ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Re-fetching Repos...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Refresh Repositories</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
          {isRefreshingProjects && (
            <div className="absolute inset-0 bg-[#14181b]/75 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Re-fetching public repositories list...</span>
            </div>
          )}

          {visibleProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={setSelectedProject}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#38434f]">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#2d3741] hover:bg-[#38434f] text-[#e9eaec] rounded-md transition-colors disabled:opacity-50 text-sm font-medium"
          >
            Previous
          </button>

          <span className="text-sm text-slate-400">
            Page {currentPage}
          </span>

          <button
            onClick={handleNextPage}
            disabled={!canGoNext}
            className="px-4 py-2 bg-[#2d3741] hover:bg-[#38434f] text-[#e9eaec] rounded-md transition-colors disabled:opacity-50 text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
