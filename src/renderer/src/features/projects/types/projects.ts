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

export type ProjectScoreCategory =
  | 'readme_structure'
  | 'real_demo'
  | 'commit_history'
  | 'codebase_structure'
  | 'language_best_practices'
  | 'no_debug_artifacts'
  | 'test_coverage';

export interface ScoreLogItem {
  category: ProjectScoreCategory | string;
  title: string;
  score: number;
  log: string;
  improvements: string[];
}

export interface AIScoreResult {
  repoId: number;
  repoName: string;
  totalScore: number;
  evaluatedAt: string;
  logs: ScoreLogItem[];
}

export interface ProjectScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryName: string;
  scoreResult?: AIScoreResult;
  triggerRef?: React.RefObject<HTMLElement>;
}

