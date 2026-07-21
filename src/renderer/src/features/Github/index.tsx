import React, { useState, useEffect, useRef } from 'react';
import type { UserGitHubProfile, ProjectItem } from './types';
import { ProfileHeader } from './components/ProfileHeader';
import { ProjectCard } from './components/Card/ProjectCard';
import { ProjectDetailScreen } from './components/Card/ProjectDetailScreen';
import { useNotification } from '../../context/NotificationContext';

const ITEMS_PER_PAGE = 6;

export const Github: React.FC = () => {
  const [profile, setProfile] = useState<UserGitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  // Pagination & Sync State
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const { addNotification } = useNotification();

  const syncIdRef = useRef<number>(0);

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
      }

      const res = await (window as any).electronAPI?.analyzeGithub();
      if (res?.success && res.data) {
        setProfile(res.data);
        const now = Date.now();
        setLastFetch(now);
        const initialHasMore = res.data.projects.length === ITEMS_PER_PAGE;
        setHasMore(initialHasMore);
        localStorage.setItem('githubProfileData', JSON.stringify({ profile: res.data, lastFetch: now }));
        setLoading(false); // remove full loading screen as first page is ready

        if (initialHasMore) {
          startBackgroundSync(res.data);
        }
      } else {
        setError(res?.error || 'Failed to analyze GitHub profile. Make sure you connected your GitHub account.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching GitHub data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(false);

    return () => {
      syncIdRef.current += 1; // Cleanup on unmount
    };
  }, []);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;

    // As long as we have some projects for the next page, let them go to the next page
    if (profile && profile.projects.length > currentPage * ITEMS_PER_PAGE) {
      setCurrentPage(nextPage);
    } else if (isSyncing) {
      addNotification('Projects are still fetching. Please wait a moment.', 'warning');
    } else if (hasMore) {
      // Edge case if sync stopped but hasMore is true
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
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-[#e9eaec]">Analyzing your GitHub profile...</h2>
        <p className="text-sm text-slate-400 mt-2">This may take a moment while we fetch and analyze your repositories.</p>
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
    return <ProjectDetailScreen project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = profile.projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const canGoNext = profile.projects.length > currentPage * ITEMS_PER_PAGE || hasMore;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-300 relative">
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
            title="Refresh GitHub Data"
          >
            Refresh
          </button>
        </div>
      </div>

      <ProfileHeader profile={profile} />

      <div>
        <h3 className="text-xl font-semibold text-[#e9eaec] mb-6 flex items-center gap-2">
          <span>Repositories Analysis</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">
            {profile.projects.length} evaluated
          </span>
          {isSyncing && (
            <span className="text-xs text-amber-400 animate-pulse ml-2 flex items-center gap-1">
              <span className="animate-spin inline-block">⟳</span> Syncing...
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
