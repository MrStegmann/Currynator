import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Home } from '../../../src/features/home/Home';
import { useResumeStore } from '../../../src/store/useResumeStore';
import { useCvDashboardStore } from '../../../src/features/cv-dashboard/store/useCvDashboardStore';
import { useProjectsStore } from '../../../src/features/projects/store/useProjectsStore';

jest.mock('../../../src/store/useResumeStore');
jest.mock('../../../src/features/cv-dashboard/store/useCvDashboardStore');
jest.mock('../../../src/features/projects/store/useProjectsStore');

describe('Dynamic Toolbar Integration', () => {
  const mockLoadResume = jest.fn();
  const mockSetActiveView = jest.fn();
  const mockSetFormModalOpen = jest.fn();
  const mockFetchRepositories = jest.fn();
  const mockScoreSelectedProjects = jest.fn();
  const mockSetConfirmModalOpen = jest.fn();

  const mockResumeData = {
    basics: { name: 'John Doe', email: 'john@example.com' },
    work: [],
    education: [],
    certificates: [],
    skills: [],
    languages: [],
    references: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const resumeState = {
      loadResume: mockLoadResume,
      isLoading: false,
      error: null,
      data: mockResumeData,
      addArrayItem: jest.fn(),
      updateArrayItem: jest.fn(),
      deleteArrayItem: jest.fn(),
    };

    (useResumeStore as unknown as jest.Mock).mockImplementation((selector: any) => {
      return typeof selector === 'function' ? selector(resumeState) : resumeState;
    });

    (useCvDashboardStore as unknown as jest.Mock).mockReturnValue({
      activeView: 'Home',
      setActiveView: mockSetActiveView,
      setFormModalOpen: mockSetFormModalOpen,
      cvItems: [],
      jobApplications: [],
      loadJobApplications: jest.fn(),
    });

    (useProjectsStore as unknown as jest.Mock).mockReturnValue({
      isTokenConfigured: true,
      repositories: [],
      isLoading: false,
      isRefreshing: false,
      isScoring: false,
      scoringError: null,
      error: null,
      currentPage: 1,
      itemsPerPage: 9,
      searchQuery: '',
      minStars: 0,
      selectedLanguage: 'all',
      selectedRepoIds: [],
      projectScores: {},
      isConfirmModalOpen: false,
      loadInitialState: jest.fn(),
      fetchRepositories: mockFetchRepositories,
      scoreSelectedProjects: mockScoreSelectedProjects,
      scoreAllProjects: jest.fn(),
      setConfirmModalOpen: mockSetConfirmModalOpen,
      setCurrentPage: jest.fn(),
      setSearchQuery: jest.fn(),
      setMinStars: jest.fn(),
      setSelectedLanguage: jest.fn(),
      resetFilters: jest.fn(),
      toggleSelectRepo: jest.fn(),
    });
  });

  it('renders "Import LinkedIn CSV" in Home view toolbar and triggers action', () => {
    render(<Home />);

    const importBtn = screen.getByRole('button', { name: /import linkedin csv/i });
    expect(importBtn).toBeInTheDocument();

    fireEvent.click(importBtn);
    expect(screen.getAllByRole('heading', { level: 1, name: /import linkedin data/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('renders "New Apply" button when activeView is CV Dashboard and triggers modal', () => {
    (useCvDashboardStore as unknown as jest.Mock).mockReturnValue({
      activeView: 'CV Dashboard',
      setActiveView: mockSetActiveView,
      setFormModalOpen: mockSetFormModalOpen,
      cvItems: [],
      jobApplications: [],
      loadJobApplications: jest.fn(),
    });

    render(<Home />);

    const newApplyBtn = screen.getByRole('button', { name: /new apply/i });
    expect(newApplyBtn).toBeInTheDocument();

    fireEvent.click(newApplyBtn);
    expect(mockSetFormModalOpen).toHaveBeenCalledWith(true, null);
  });

  it('renders "Sync Projects" and "Score Projects" in Projects view toolbar', () => {
    (useCvDashboardStore as unknown as jest.Mock).mockReturnValue({
      activeView: 'Projects',
      setActiveView: mockSetActiveView,
      setFormModalOpen: mockSetFormModalOpen,
      cvItems: [],
      jobApplications: [],
      loadJobApplications: jest.fn(),
    });

    render(<Home />);

    const syncBtn = screen.getByRole('button', { name: /sync projects/i });
    const scoreBtn = screen.getByRole('button', { name: /score projects/i });

    expect(syncBtn).toBeInTheDocument();
    expect(scoreBtn).toBeInTheDocument();

    fireEvent.click(syncBtn);
    expect(mockFetchRepositories).toHaveBeenCalledWith(true);

    fireEvent.click(scoreBtn);
    expect(mockSetConfirmModalOpen).toHaveBeenCalledWith(true);
  });

  it('renders burger and toolbar toggle buttons on small screen width', () => {
    // Simulate mobile/small screen width
    window.innerWidth = 800;

    render(<Home />);

    const burgerBtn = screen.getByRole('button', { name: /toggle sidebar/i });
    const toolbarToggleBtn = screen.getByRole('button', { name: /toggle toolbar/i });

    expect(burgerBtn).toBeInTheDocument();
    expect(toolbarToggleBtn).toBeInTheDocument();

    // Toggle sidebar
    fireEvent.click(burgerBtn);
    // Toggle toolbar
    fireEvent.click(toolbarToggleBtn);
  });
});
