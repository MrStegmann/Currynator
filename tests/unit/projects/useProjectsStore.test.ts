import { useProjectsStore } from '../../../src/renderer/src/features/projects/store/useProjectsStore';
import * as githubService from '../../../src/renderer/src/features/projects/utils/githubService';

jest.mock('../../../src/renderer/src/features/projects/utils/githubService');

describe('useProjectsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useProjectsStore.getState().clearToken();
    jest.clearAllMocks();
  });

  it('initializes with empty token and unconfigured state', () => {
    const state = useProjectsStore.getState();
    expect(state.token).toBeNull();
    expect(state.isTokenConfigured).toBe(false);
    expect(state.repositories).toEqual([]);
  });

  it('saves token encrypted and fetches repositories', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'TestRepo',
        full_name: 'user/TestRepo',
        description: 'A test repo',
        html_url: 'https://github.com/user/TestRepo',
        stargazers_count: 10,
        forks_count: 3,
        language: 'TypeScript',
        updated_at: '2026-09-01T10:00:00Z',
        private: false
      }
    ];

    (githubService.fetchGitHubRepositories as jest.Mock).mockResolvedValue({
      success: true,
      data: mockRepos
    });

    const success = await useProjectsStore.getState().saveToken('ghp_testtoken123');

    expect(success).toBe(true);
    const state = useProjectsStore.getState();
    expect(state.token).toBe('ghp_testtoken123');
    expect(state.isTokenConfigured).toBe(true);
    expect(state.repositories).toEqual(mockRepos);
    expect(localStorage.getItem('currynator_github_token')).not.toBeNull();
  });

  it('loads initial state from localStorage on loadInitialState', () => {
    useProjectsStore.getState().clearToken();
    localStorage.setItem('currynator_github_token', btoa('ghp_storedtoken'));
    localStorage.setItem('currynator_github_repos', JSON.stringify([{ id: 2, name: 'StoredRepo' }]));

    useProjectsStore.getState().loadInitialState();

    const state = useProjectsStore.getState();
    expect(state.isTokenConfigured).toBe(true);
    expect(state.repositories).toHaveLength(1);
    expect(state.repositories[0].name).toBe('StoredRepo');
  });
});
