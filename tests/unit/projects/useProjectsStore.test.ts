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
    expect(state.itemsPerPage).toBe(9);
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

  it('updates filter states and resets filters', () => {
    const store = useProjectsStore.getState();

    expect(store.searchQuery).toBe('');
    expect(store.minStars).toBe(0);
    expect(store.selectedLanguage).toBe('all');

    useProjectsStore.getState().setSearchQuery('react');
    useProjectsStore.getState().setMinStars(5);
    useProjectsStore.getState().setSelectedLanguage('TypeScript');

    let updatedState = useProjectsStore.getState();
    expect(updatedState.searchQuery).toBe('react');
    expect(updatedState.minStars).toBe(5);
    expect(updatedState.selectedLanguage).toBe('TypeScript');

    useProjectsStore.getState().resetFilters();
    updatedState = useProjectsStore.getState();
    expect(updatedState.searchQuery).toBe('');
    expect(updatedState.minStars).toBe(0);
    expect(updatedState.selectedLanguage).toBe('all');
  });

  it('resets currentPage to 1 when any filter state changes', () => {
    useProjectsStore.getState().setCurrentPage(3);
    expect(useProjectsStore.getState().currentPage).toBe(3);

    useProjectsStore.getState().setSearchQuery('query');
    expect(useProjectsStore.getState().currentPage).toBe(1);

    useProjectsStore.getState().setCurrentPage(4);
    useProjectsStore.getState().setMinStars(10);
    expect(useProjectsStore.getState().currentPage).toBe(1);

    useProjectsStore.getState().setCurrentPage(2);
    useProjectsStore.getState().setSelectedLanguage('Python');
    expect(useProjectsStore.getState().currentPage).toBe(1);

    useProjectsStore.getState().setCurrentPage(5);
    useProjectsStore.getState().resetFilters();
    expect(useProjectsStore.getState().currentPage).toBe(1);
  });
});
