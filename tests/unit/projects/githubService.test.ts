import { fetchGitHubRepositories, fetchProjectCodebaseDetails, filterAndSummarizeFileTree } from '../../../src/renderer/src/features/projects/utils/githubService';

describe('githubService Utility', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns repositories on successful GitHub API response', async () => {
    const mockRepos = [
      {
        id: 101,
        name: 'RepoOne',
        full_name: 'user/RepoOne',
        description: 'First repo with code',
        html_url: 'https://github.com/user/RepoOne',
        stargazers_count: 5,
        forks_count: 2,
        language: 'TypeScript',
        updated_at: '2026-09-01T10:00:00Z',
        private: false,
        size: 2048
      },
      {
        id: 102,
        name: 'EmptyRepo',
        full_name: 'user/EmptyRepo',
        description: 'Empty repository',
        html_url: 'https://github.com/user/EmptyRepo',
        stargazers_count: 0,
        forks_count: 0,
        language: 'TypeScript',
        updated_at: '2026-09-01T10:00:00Z',
        private: false,
        size: 0
      },
      {
        id: 103,
        name: 'ReadmeOnlyRepo',
        full_name: 'user/ReadmeOnlyRepo',
        description: 'Repo with only README.md',
        html_url: 'https://github.com/user/ReadmeOnlyRepo',
        stargazers_count: 1,
        forks_count: 0,
        language: null,
        updated_at: '2026-09-01T10:00:00Z',
        private: false,
        size: 15
      }
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockRepos)
    });

    const result = await fetchGitHubRepositories('valid-token');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].name).toBe('RepoOne');
    expect(result.data?.[0].size).toBe(2048);
  });

  it('returns failure message when token is unauthorized (401)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ message: 'Bad credentials' })
    });

    const result = await fetchGitHubRepositories('invalid-token');

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid GitHub Personal Access Token/i);
  });

  it('handles network error gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await fetchGitHubRepositories('valid-token');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('filters out node_modules, dist, and package-lock from file tree', () => {
    const rawPaths = [
      'node_modules/express/index.js',
      'dist/bundle.js',
      'package-lock.json',
      'package.json',
      'src/index.ts',
      'src/components/App.tsx',
      'tests/App.test.tsx'
    ];

    const filtered = filterAndSummarizeFileTree(rawPaths);

    expect(filtered).not.toContain('node_modules/express/index.js');
    expect(filtered).not.toContain('dist/bundle.js');
    expect(filtered).not.toContain('package-lock.json');
    expect(filtered).toContain('package.json');
    expect(filtered).toContain('src/index.ts');
    expect(filtered).toContain('tests/App.test.tsx');
  });

  it('fetches README, commits, and file tree successfully in fetchProjectCodebaseDetails', async () => {
    const mockReadmeText = '# Currynator App\nAI project evaluation workspace.';
    const mockCommitsData = [
      { commit: { message: 'feat: add codebase inspection\n\nDetailed breakdown.' } },
      { commit: { message: 'fix: resolve rate limit handling' } }
    ];
    const mockTreeData = {
      tree: [
        { path: 'package.json' },
        { path: 'src/index.ts' },
        { path: 'tests/index.test.ts' }
      ]
    };

    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/readme')) {
        return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(mockReadmeText) });
      }
      if (url.includes('/commits')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(mockCommitsData) });
      }
      if (url.includes('/trees/')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(mockTreeData) });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const result = await fetchProjectCodebaseDetails('valid-token', 'owner/repo', 'main');

    expect(result.success).toBe(true);
    expect(result.data?.readmeContent).toBe(mockReadmeText);
    expect(result.data?.commitLogs).toEqual(['feat: add codebase inspection', 'fix: resolve rate limit handling']);
    expect(result.data?.fileTree).toEqual(['package.json', 'src/index.ts', 'tests/index.test.ts']);
  });

  it('enforces zero-fallback policy on 403 Forbidden permission error', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({ ok: false, status: 403, json: () => Promise.resolve({ message: 'Resource not accessible' }) });
    });

    const result = await fetchProjectCodebaseDetails('limited-token', 'owner/private-repo');

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/lacks required 'repo' scope/i);
  });
});
