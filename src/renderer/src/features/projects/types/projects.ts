export interface GitHubTokenConfig {
  token: string;
  isConfigured: boolean;
  lastSavedAt: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
  size: number;
}

export interface ProjectFilterState {
  searchQuery: string;
  minStars: number;
  selectedLanguage: string;
}

export interface ProjectsPaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

