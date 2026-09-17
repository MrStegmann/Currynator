import React, { useEffect, useMemo } from 'react';
import { useProjectsStore } from '../store/useProjectsStore';
import { TokenSetupView } from './TokenSetupView';
import { ProjectsGrid } from './ProjectsGrid';
import { ProjectFilterBar } from './ProjectFilterBar';
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
    searchQuery,
    minStars,
    selectedLanguage,
    loadInitialState,
    fetchRepositories,
    setCurrentPage,
    setSearchQuery,
    setMinStars,
    setSelectedLanguage,
    resetFilters
  } = useProjectsStore();

  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  // Compute distinct dynamic languages from available codebase projects
  const availableLanguages = useMemo(() => {
    const repos = repositories || [];
    return Array.from(
      new Set(
        repos
          .map(repo => repo?.language)
          .filter((lang): lang is string => Boolean(lang) && String(lang).trim().length > 0)
      )
    ).sort();
  }, [repositories]);

  // Filter repositories based on searchQuery, minStars, and selectedLanguage
  const filteredRepositories = useMemo(() => {
    const repos = repositories || [];
    const query = searchQuery || '';
    const starsThreshold = minStars || 0;
    const langFilter = selectedLanguage || 'all';
    const trimmedSearch = query.toLowerCase().trim();

    return repos.filter(repo => {
      if (!repo) return false;
      const matchesName = !trimmedSearch || (repo.name && repo.name.toLowerCase().includes(trimmedSearch));
      const matchesStars = (repo.stargazers_count || 0) >= starsThreshold;
      const matchesLanguage = langFilter === 'all' || repo.language === langFilter;
      return matchesName && matchesStars && matchesLanguage;
    });
  }, [repositories, searchQuery, minStars, selectedLanguage]);

  if (!isTokenConfigured) {
    return <TokenSetupView />;
  }

  const totalItems = filteredRepositories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRepositories = filteredRepositories.slice(startIndex, startIndex + itemsPerPage);

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
          {/* Real-time Project Search & Filter Controls */}
          <ProjectFilterBar
            searchQuery={searchQuery}
            minStars={minStars}
            selectedLanguage={selectedLanguage}
            availableLanguages={availableLanguages}
            onSearchChange={setSearchQuery}
            onStarsChange={setMinStars}
            onLanguageChange={setSelectedLanguage}
            onResetFilters={resetFilters}
          />

          {/* Projects 3x3 Grid (9 per page) */}
          <ProjectsGrid
            repositories={currentRepositories}
            hasActiveFilters={Boolean((searchQuery || '').trim().length > 0 || (minStars || 0) > 0 || (selectedLanguage && selectedLanguage !== 'all'))}
            onResetFilters={resetFilters}
          />

          {/* Simple Pagination Controls (Max 9 per page) */}
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
