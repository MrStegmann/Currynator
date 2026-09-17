import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FloatingRefreshButton } from '../../../src/renderer/src/features/projects/components/FloatingRefreshButton';
import { ProjectsView } from '../../../src/renderer/src/features/projects/components/ProjectsView';
import { useProjectsStore } from '../../../src/renderer/src/features/projects/store/useProjectsStore';

jest.mock('../../../src/renderer/src/features/projects/store/useProjectsStore');

describe('FloatingRefreshButton Component', () => {
  it('renders fixed refresh button and triggers onRefresh when clicked', () => {
    const handleRefresh = jest.fn();
    render(<FloatingRefreshButton onRefresh={handleRefresh} isRefreshing={false} />);

    const btn = screen.getByRole('button', { name: /refresh projects/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });
});

describe('ProjectsView Component', () => {
  const mockFetchRepositories = jest.fn();
  const mockLoadInitialState = jest.fn();
  const mockSetCurrentPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useProjectsStore as unknown as jest.Mock).mockReturnValue({
      token: null,
      isTokenConfigured: false,
      repositories: [],
      isLoading: false,
      isRefreshing: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 9,
      searchQuery: '',
      minStars: 0,
      selectedLanguage: 'all',
      loadInitialState: mockLoadInitialState,
      fetchRepositories: mockFetchRepositories,
      setCurrentPage: mockSetCurrentPage,
      setSearchQuery: jest.fn(),
      setMinStars: jest.fn(),
      setSelectedLanguage: jest.fn(),
      resetFilters: jest.fn()
    });
  });

  it('renders TokenSetupView when token is not configured', () => {
    render(<ProjectsView />);

    expect(screen.getByText(/Connect Your GitHub Account/i)).toBeInTheDocument();
    expect(mockLoadInitialState).toHaveBeenCalledTimes(1);
  });

  it('renders ProjectsGrid and FloatingRefreshButton when token is configured', () => {
    (useProjectsStore as unknown as jest.Mock).mockReturnValue({
      token: 'ghp_validtoken',
      isTokenConfigured: true,
      repositories: [
        { id: 1, name: 'ConfiguredRepo', html_url: 'https://github.com/test/ConfiguredRepo', stargazers_count: 5, forks_count: 1 }
      ],
      isLoading: false,
      isRefreshing: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 9,
      searchQuery: '',
      minStars: 0,
      selectedLanguage: 'all',
      loadInitialState: mockLoadInitialState,
      fetchRepositories: mockFetchRepositories,
      setCurrentPage: mockSetCurrentPage,
      setSearchQuery: jest.fn(),
      setMinStars: jest.fn(),
      setSelectedLanguage: jest.fn(),
      resetFilters: jest.fn()
    });

    render(<ProjectsView />);

    expect(screen.getByText('ConfiguredRepo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh projects/i })).toBeInTheDocument();
  });
});
