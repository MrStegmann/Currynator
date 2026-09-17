import { create } from 'zustand';
import { GitHubRepository } from '../types/projects';
import { encryptGitHubToken, decryptGitHubToken } from '../utils/tokenEncryption';
import { fetchGitHubRepositories } from '../utils/githubService';

const TOKEN_STORAGE_KEY = 'currynator_github_token';
const REPOS_STORAGE_KEY = 'currynator_github_repos';

export interface ProjectsState {
  token: string | null;
  isTokenConfigured: boolean;
  repositories: GitHubRepository[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;

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
}

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

  loadInitialState: () => {
    try {
      const encryptedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const plainToken = encryptedToken ? decryptGitHubToken(encryptedToken) : null;
      const isConfigured = Boolean(plainToken && plainToken.trim().length > 0);

      const cachedReposStr = localStorage.getItem(REPOS_STORAGE_KEY);
      const cachedRepos: GitHubRepository[] = cachedReposStr ? JSON.parse(cachedReposStr) : [];

      set({
        token: plainToken,
        isTokenConfigured: isConfigured,
        repositories: Array.isArray(cachedRepos) ? cachedRepos : []
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
    set({
      token: null,
      isTokenConfigured: false,
      repositories: [],
      error: null,
      currentPage: 1,
      searchQuery: '',
      minStars: 0,
      selectedLanguage: 'all'
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

  resetFilters: () => set({ searchQuery: '', minStars: 0, selectedLanguage: 'all', currentPage: 1 })
}));
