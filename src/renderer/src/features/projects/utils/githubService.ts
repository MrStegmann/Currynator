import { GitHubRepository } from '../types/projects';

export interface GitHubApiFetchResult {
  success: boolean;
  data?: GitHubRepository[];
  error?: string;
}

export async function fetchGitHubRepositories(token: string): Promise<GitHubApiFetchResult> {
  if (!token) {
    return {
      success: false,
      error: 'GitHub Personal Access Token is required.'
    };
  }

  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100&type=owner', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Currynator-App'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: 'Invalid GitHub Personal Access Token. Please verify token permissions and re-enter.'
        };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: 'GitHub API rate limit exceeded or access forbidden.'
        };
      }
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorBody.message || `GitHub API request failed with status ${response.status}.`
      };
    }

    const reposData = await response.json();
    if (!Array.isArray(reposData)) {
      return {
        success: false,
        error: 'Unexpected response format received from GitHub API.'
      };
    }

    const codebaseRepos = reposData.filter(
      (repo: any) =>
        typeof repo.size === 'number' &&
        repo.size > 0 &&
        repo.language !== null &&
        repo.language !== undefined &&
        String(repo.language).trim() !== ''
    );

    const repositories: GitHubRepository[] = codebaseRepos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name || repo.name,
      description: repo.description || null,
      html_url: repo.html_url || `https://github.com/${repo.full_name}`,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      language: repo.language || null,
      updated_at: repo.updated_at || new Date().toISOString(),
      private: Boolean(repo.private),
      size: repo.size || 0
    }));

    return {
      success: true,
      data: repositories
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error while fetching GitHub repositories.'
    };
  }
}
