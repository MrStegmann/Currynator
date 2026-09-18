import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useProjectsStore } from '../store/useProjectsStore';

describe('useProjectsStore - AI Scoring & Selection', () => {
  beforeEach(() => {
    // Reset store state
    useProjectsStore.setState({
      selectedRepoIds: [],
      isScoring: false,
      scoringError: null,
      projectScores: {},
      repositories: [
        {
          id: 101,
          name: 'repo-one',
          full_name: 'user/repo-one',
          description: 'First test repository',
          html_url: 'https://github.com/user/repo-one',
          stargazers_count: 5,
          forks_count: 1,
          language: 'TypeScript',
          updated_at: '2026-01-01',
          private: false,
          size: 100
        },
        {
          id: 102,
          name: 'repo-two',
          full_name: 'user/repo-two',
          description: 'Second test repository',
          html_url: 'https://github.com/user/repo-two',
          stargazers_count: 10,
          forks_count: 2,
          language: 'JavaScript',
          updated_at: '2026-01-02',
          private: false,
          size: 200
        }
      ]
    });

    (window as any).electron = {
      groq: {
        scoreProject: jest.fn<any>().mockResolvedValue({
          success: true,
          data: {
            repoId: 101,
            repoName: 'repo-one',
            totalScore: 92,
            evaluatedAt: new Date().toISOString(),
            logs: [
              {
                category: 'readme_structure',
                title: 'README.md Structure',
                score: 95,
                log: 'Excellent README structure',
                improvements: ['Add license badge']
              }
            ]
          }
        })
      }
    };
  });

  it('should toggle selection of repositories', () => {
    const { toggleSelectRepo, clearSelection } = useProjectsStore.getState();

    toggleSelectRepo(101);
    expect(useProjectsStore.getState().selectedRepoIds).toContain(101);

    toggleSelectRepo(102);
    expect(useProjectsStore.getState().selectedRepoIds).toEqual([101, 102]);

    toggleSelectRepo(101);
    expect(useProjectsStore.getState().selectedRepoIds).toEqual([102]);

    clearSelection();
    expect(useProjectsStore.getState().selectedRepoIds).toEqual([]);
  });

  it('should score selected projects and store results', async () => {
    const { toggleSelectRepo, scoreSelectedProjects } = useProjectsStore.getState();

    toggleSelectRepo(101);
    const success = await scoreSelectedProjects();

    expect(success).toBe(true);
    expect((window as any).electron.groq.scoreProject).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 101,
        name: 'repo-one'
      })
    );

    const scores = useProjectsStore.getState().projectScores;
    expect(scores[101]).toBeDefined();
    expect(scores[101].totalScore).toBe(92);
    expect(scores[101].logs[0].improvements).toEqual(['Add license badge']);
  });

  it('should hydrate projectScores from LocalStorage on loadInitialState', () => {
    const mockScores = {
      101: {
        repoId: 101,
        repoName: 'repo-one',
        totalScore: 88,
        evaluatedAt: '2026-01-01T00:00:00.000Z',
        logs: [
          {
            category: 'test_coverage',
            title: 'Testing Quality',
            score: 90,
            log: 'Good test suite',
            improvements: ['Increase coverage']
          }
        ]
      }
    };

    localStorage.setItem('currynator_project_scores', JSON.stringify(mockScores));

    const { loadInitialState } = useProjectsStore.getState();
    loadInitialState();

    const loadedScores = useProjectsStore.getState().projectScores;
    expect(loadedScores[101]).toBeDefined();
    expect(loadedScores[101].totalScore).toBe(88);
    expect(loadedScores[101].logs[0].improvements).toEqual(['Increase coverage']);
  });
});
