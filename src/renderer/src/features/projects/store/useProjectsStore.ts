import { create } from 'zustand';
import { GitHubRepository, AIScoreResult } from '../types/projects';
import { encryptGitHubToken, decryptGitHubToken } from '../utils/tokenEncryption';
import { fetchGitHubRepositories, fetchProjectCodebaseDetails } from '../utils/githubService';

const TOKEN_STORAGE_KEY = 'currynator_github_token';
const REPOS_STORAGE_KEY = 'currynator_github_repos';
const SCORES_STORAGE_KEY = 'currynator_project_scores';

export interface ProjectsState {
  token: string | null;
  isTokenConfigured: boolean;
  repositories: GitHubRepository[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;

  // Selection & Scoring State
  selectedRepoIds: number[];
  isScoring: boolean;
  scoringError: string | null;
  projectScores: Record<number, AIScoreResult>;
  isConfirmModalOpen: boolean;

  // Filter state
  searchQuery: string;
  minStars: number;
  selectedLanguage: string;

  loadInitialState: () => void;
  saveToken: (plainToken: string) => Promise<boolean>;
  clearToken: () => void;
  fetchRepositories: (forceRefresh?: boolean) => Promise<boolean>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setMinStars: (stars: number) => void;
  setSelectedLanguage: (language: string) => void;
  resetFilters: () => void;

  // Selection & Scoring Actions
  toggleSelectRepo: (id: number) => void;
  clearSelection: () => void;
  scoreSelectedProjects: () => Promise<boolean>;
  scoreAllProjects: () => Promise<boolean>;
  setConfirmModalOpen: (open: boolean) => void;
}

const scoreSingleProject = async (token: string | null, repo: GitHubRepository): Promise<{ success: boolean; data?: AIScoreResult; error?: string }> => {
  let codebaseData: { readmeContent?: string; commitLogs?: string[]; fileTree?: string[] } = {};

  if (token) {
    const codebaseRes = await fetchProjectCodebaseDetails(token, repo.full_name || repo.name);
    if (!codebaseRes.success) {
      // Zero-fallback policy: propagate explicit GitHub API error
      return {
        success: false,
        error: codebaseRes.error || `Failed to fetch codebase details for ${repo.name}.`
      };
    }
    if (codebaseRes.data) {
      codebaseData = codebaseRes.data;
    }
  }

  const payload = {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    html_url: repo.html_url,
    readmeContent: codebaseData.readmeContent,
    commitLogs: codebaseData.commitLogs,
    fileTree: codebaseData.fileTree
  };

  if ((window as any).electron?.groq?.scoreProject) {
    return (window as any).electron.groq.scoreProject(payload);
  }
  if ((window as any).electron?.ipcRenderer?.invoke) {
    return (window as any).electron.ipcRenderer.invoke('groq:score-project', payload);
  }
  return {
    success: false,
    error: 'Electron IPC bridge is unavailable in this environment.'
  };
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  token: null,
  isTokenConfigured: false,
  repositories: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 9,

  // Initial Filter State
  searchQuery: '',
  minStars: 0,
  selectedLanguage: 'all',

  // Initial Selection & Scoring State
  selectedRepoIds: [],
  isScoring: false,
  scoringError: null,
  projectScores: {},

  loadInitialState: () => {
    try {
      const encryptedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const plainToken = encryptedToken ? decryptGitHubToken(encryptedToken) : null;
      const isConfigured = Boolean(plainToken && plainToken.trim().length > 0);

      const cachedReposStr = localStorage.getItem(REPOS_STORAGE_KEY);
      const cachedRepos: GitHubRepository[] = cachedReposStr ? JSON.parse(cachedReposStr) : [];

      const cachedScoresStr = localStorage.getItem(SCORES_STORAGE_KEY);
      const cachedScores: Record<number, AIScoreResult> = cachedScoresStr ? JSON.parse(cachedScoresStr) : {};

      set({
        token: plainToken,
        isTokenConfigured: isConfigured,
        repositories: Array.isArray(cachedRepos) ? cachedRepos : [],
        projectScores: cachedScores && typeof cachedScores === 'object' ? cachedScores : {}
      });
    } catch (err) {
      console.error('Error loading initial projects state:', err);
    }
  },

  saveToken: async (plainToken: string) => {
    const trimmed = plainToken.trim();
    if (!trimmed) {
      set({ error: 'Token string cannot be empty.' });
      return false;
    }

    try {
      const encrypted = encryptGitHubToken(trimmed);
      localStorage.setItem(TOKEN_STORAGE_KEY, encrypted);
      set({
        token: trimmed,
        isTokenConfigured: true,
        error: null
      });

      return await get().fetchRepositories(true);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to save token' });
      return false;
    }
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REPOS_STORAGE_KEY);
    localStorage.removeItem(SCORES_STORAGE_KEY);
    set({
      token: null,
      isTokenConfigured: false,
      repositories: [],
      error: null,
      currentPage: 1,
      searchQuery: '',
      minStars: 0,
      selectedLanguage: 'all',
      selectedRepoIds: [],
      projectScores: {},
      isScoring: false,
      scoringError: null
    });
  },

  fetchRepositories: async (forceRefresh = false) => {
    const token = get().token;
    if (!token) {
      set({ isTokenConfigured: false, error: 'No GitHub token configured.' });
      return false;
    }

    if (forceRefresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }

    try {
      const res = await fetchGitHubRepositories(token);
      if (res.success && res.data) {
        localStorage.setItem(REPOS_STORAGE_KEY, JSON.stringify(res.data));
        set({
          repositories: res.data,
          currentPage: 1,
          isLoading: false,
          isRefreshing: false,
          error: null
        });
        return true;
      } else {
        set({
          error: res.error || 'Failed to fetch repositories from GitHub.',
          isLoading: false,
          isRefreshing: false
        });
        return false;
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error fetching repositories',
        isLoading: false,
        isRefreshing: false
      });
      return false;
    }
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),

  setSearchQuery: (query: string) => set({ searchQuery: query, currentPage: 1 }),

  setMinStars: (stars: number) => set({ minStars: stars, currentPage: 1 }),

  setSelectedLanguage: (language: string) => set({ selectedLanguage: language, currentPage: 1 }),

  resetFilters: () => set({ searchQuery: '', minStars: 0, selectedLanguage: 'all', currentPage: 1 }),

  toggleSelectRepo: (id: number) => {
    const current = get().selectedRepoIds || [];
    const exists = current.includes(id);
    const updated = exists ? current.filter(item => item !== id) : [...current, id];
    set({ selectedRepoIds: updated });
  },

  clearSelection: () => set({ selectedRepoIds: [] }),

  scoreSelectedProjects: async () => {
    const { token, selectedRepoIds, repositories, projectScores } = get();
    if (!selectedRepoIds || selectedRepoIds.length === 0) return false;

    set({ isScoring: true, scoringError: null });

    const selectedRepos = repositories.filter(repo => selectedRepoIds.includes(repo.id));
    const updatedScores = { ...projectScores };
    let hasError = false;
    let lastError: string | null = null;

    try {
      for (const repo of selectedRepos) {
        const res = await scoreSingleProject(token, repo);

        if (res.success && res.data) {
          updatedScores[repo.id] = res.data;
        } else {
          hasError = true;
          lastError = res.error || `Failed to score repository ${repo.name}`;
        }
      }

      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updatedScores));
      set({
        projectScores: updatedScores,
        isScoring: false,
        scoringError: hasError ? lastError : null,
        selectedRepoIds: []
      });
      return !hasError;
    } catch (err) {
      set({
        isScoring: false,
        scoringError: err instanceof Error ? err.message : 'Error scoring selected projects'
      });
      return false;
    }
  },

  isConfirmModalOpen: false,

  setConfirmModalOpen: (open: boolean) => set({ isConfirmModalOpen: open }),

  scoreAllProjects: async () => {
    const { token, repositories, projectScores } = get();
    if (!repositories || repositories.length === 0) return false;

    set({ isScoring: true, scoringError: null, isConfirmModalOpen: false });

    const updatedScores = { ...projectScores };
    let hasError = false;
    let lastError: string | null = null;

    try {
      for (const repo of repositories) {
        const res = await scoreSingleProject(token, repo);

        if (res.success && res.data) {
          updatedScores[repo.id] = res.data;
        } else {
          hasError = true;
          lastError = res.error || `Failed to score repository ${repo.name}`;
        }
      }

      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updatedScores));
      set({
        projectScores: updatedScores,
        isScoring: false,
        scoringError: hasError ? lastError : null
      });
      return !hasError;
    } catch (err) {
      set({
        isScoring: false,
        scoringError: err instanceof Error ? err.message : 'Error scoring all projects'
      });
      return false;
    }
  }
}));
