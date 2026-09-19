import { GitHubRepository } from '../types/projects';

export interface GitHubApiFetchResult {
  success: boolean;
  data?: GitHubRepository[];
  error?: string;
}

export interface ProjectCodebaseDetails {
  readmeContent?: string;
  commitLogs?: string[];
  fileTree?: string[];
}

export interface CodebaseFetchResult {
  success: boolean;
  data?: ProjectCodebaseDetails;
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

export async function fetchProjectCodebaseDetails(
  token: string,
  fullName: string,
  defaultBranch: string = 'main'
): Promise<CodebaseFetchResult> {
  if (!token || !fullName) {
    return {
      success: false,
      error: 'GitHub token and repository full_name are required.'
    };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Currynator-App'
  };

  try {
    // Run parallel async HTTP GET requests for optimal latency
    const [readmeRes, commitsRes, treeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${fullName}/readme`, {
        headers: { ...headers, Accept: 'application/vnd.github.raw' }
      }).catch(() => null),
      fetch(`https://api.github.com/repos/${fullName}/commits?per_page=10`, {
        headers
      }).catch(() => null),
      fetch(`https://api.github.com/repos/${fullName}/git/trees/${defaultBranch}?recursive=1`, {
        headers
      }).catch(() => null)
    ]);

    // Check permission error status for strict zero-fallback policy
    if ((readmeRes && readmeRes.status === 403) || (commitsRes && commitsRes.status === 403) || (treeRes && treeRes.status === 403)) {
      return {
        success: false,
        error: `GitHub API 403 Forbidden: Token lacks required 'repo' scope for ${fullName}.`
      };
    }

    if ((readmeRes && readmeRes.status === 401) || (commitsRes && commitsRes.status === 401) || (treeRes && treeRes.status === 401)) {
      return {
        success: false,
        error: `GitHub API 401 Unauthorized: Invalid token or expired access.`
      };
    }

    // Parse README text
    let readmeContent: string | undefined;
    if (readmeRes && readmeRes.ok) {
      readmeContent = await readmeRes.text();
    }

    // Parse Commit Logs
    let commitLogs: string[] | undefined;
    if (commitsRes && commitsRes.ok) {
      const commitsData = await commitsRes.json();
      if (Array.isArray(commitsData)) {
        commitLogs = commitsData
          .map((c: any) => c?.commit?.message?.split('\n')[0]?.trim())
          .filter((msg): msg is string => Boolean(msg));
      }
    }

    // Parse File Tree
    let fileTree: string[] | undefined;
    if (treeRes && treeRes.ok) {
      const treeData = await treeRes.json();
      if (treeData && Array.isArray(treeData.tree)) {
        const rawPaths: string[] = treeData.tree
          .map((item: any) => item?.path)
          .filter((p): p is string => Boolean(p));

        fileTree = filterAndSummarizeFileTree(rawPaths);
      }
    }

    return {
      success: true,
      data: {
        readmeContent,
        commitLogs,
        fileTree
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : `Failed to fetch codebase details for ${fullName}`
    };
  }
}

export function filterAndSummarizeFileTree(paths: string[]): string[] {
  const ignorePatterns = [
    /node_modules\//i,
    /dist\//i,
    /build\//i,
    /\.git\//i,
    /coverage\//i,
    /package-lock\.json$/i,
    /yarn\.lock$/i,
    /pnpm-lock\.yaml$/i
  ];

  const filtered = paths.filter(p => !ignorePatterns.some(pattern => pattern.test(p)));

  const priorityPatterns = [
    /^package\.json$/i,
    /^tsconfig.*\.json$/i,
    /^README/i,
    /^src\//i,
    /test/i,
    /spec/i
  ];

  const prioritized = filtered.sort((a, b) => {
    const aPrio = priorityPatterns.findIndex(p => p.test(a));
    const bPrio = priorityPatterns.findIndex(p => p.test(b));
    if (aPrio !== -1 && bPrio === -1) return -1;
    if (aPrio === -1 && bPrio !== -1) return 1;
    if (aPrio !== -1 && bPrio !== -1) return aPrio - bPrio;
    return a.localeCompare(b);
  });

  return prioritized.slice(0, 50);
}
