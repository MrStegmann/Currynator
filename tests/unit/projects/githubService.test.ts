import { fetchGitHubRepositories } from '../../../src/renderer/src/features/projects/utils/githubService';

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
});
