import React, { useEffect } from 'react';
import { useProjectsStore } from '../store/useProjectsStore';
import { TokenSetupView } from './TokenSetupView';
import { ProjectsGrid } from './ProjectsGrid';
import { PaginationControls } from './PaginationControls';
import { FloatingRefreshButton } from './FloatingRefreshButton';
import { Loader2 } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    isTokenConfigured,
    repositories,
    isLoading,
    isRefreshing,
    error,
    currentPage,
    itemsPerPage,
    loadInitialState,
    fetchRepositories,
    setCurrentPage
  } = useProjectsStore();

  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  if (!isTokenConfigured) {
    return <TokenSetupView />;
  }

  const totalItems = repositories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRepositories = repositories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative pb-12">
      {/* Floating Refresh Action Button Fixed Top-Right */}
      <FloatingRefreshButton
        onRefresh={() => fetchRepositories(true)}
        isRefreshing={isRefreshing}
      />

      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-headline-md font-semibold text-on-surface m-0">
            GitHub Projects ({totalItems})
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Synced repositories from your GitHub account.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-on-surface-variant text-body-md">Fetching repositories from GitHub...</p>
        </div>
      ) : (
        <>
          {/* Projects 5-Column Grid */}
          <ProjectsGrid repositories={currentRepositories} />

          {/* Simple Pagination Controls (Max 10 per page) */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};
