import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GroqController } from '../controllers/GroqController.js';

// Mock groq-sdk
const mockCreate: any = jest.fn();
jest.mock('groq-sdk', () => {
  return {
    Groq: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate
        }
      }
    }))
  };
});

describe('GroqController - Project Scoring', () => {
  let groqController: GroqController;

  beforeEach(() => {
    jest.clearAllMocks();
    groqController = new GroqController();
  });

  it('should score project repository successfully and return total score, logs, and improvements', async () => {
    process.env.GROQ_API_KEY = 'test-key';

    const mockAiResponse = {
      totalScore: 85,
      logs: [
        {
          category: 'readme_structure',
          title: 'README.md Structure',
          score: 90,
          log: 'Good README structure',
          improvements: ['Add build status badge']
        },
        {
          category: 'real_demo',
          title: 'Real Demo',
          score: 80,
          log: 'Live demo link present',
          improvements: ['Add GIF preview']
        },
        {
          category: 'commit_history',
          title: 'Clean Commit Log',
          score: 85,
          log: 'Clean commit history',
          improvements: ['Use conventional commits']
        },
        {
          category: 'codebase_structure',
          title: 'Codebase Structure',
          score: 90,
          log: 'Modular structure',
          improvements: ['Extract helpers']
        },
        {
          category: 'language_best_practices',
          title: 'Best Practices & Naming',
          score: 85,
          log: 'Clean naming conventions',
          improvements: ['Add strict return types']
        },
        {
          category: 'no_debug_artifacts',
          title: 'Absence of Debug Artifacts',
          score: 75,
          log: 'Minor console.log found',
          improvements: ['Remove console.log']
        },
        {
          category: 'test_coverage',
          title: 'Testing Quality',
          score: 85,
          log: 'Unit tests present',
          improvements: ['Add integration tests']
        }
      ]
    };

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockAiResponse)
          }
        }
      ]
    });

    const projectPayload = {
      id: 123,
      name: 'test-repo',
      description: 'A test repository',
      language: 'TypeScript',
      html_url: 'https://github.com/user/test-repo',
      readmeContent: '# Test Repo\nA test repository README.',
      commitLogs: ['feat: initial commit', 'fix: bug fix'],
      fileTree: ['src/index.ts', 'tests/index.test.ts', 'README.md']
    };

    const res = await groqController.scoreProject(projectPayload);

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.repoId).toBe(123);
    expect(res.data?.repoName).toBe('test-repo');
    expect(res.data?.totalScore).toBe(85);
    expect(res.data?.logs).toHaveLength(7);
    expect(res.data?.logs[0].improvements).toEqual(['Add build status badge']);
  });

  it('should return error if GROQ_API_KEY is not configured', async () => {
    delete process.env.GROQ_API_KEY;

    const projectPayload = {
      id: 123,
      name: 'test-repo',
      description: 'Test',
      language: 'TypeScript',
      html_url: 'https://github.com/user/test-repo'
    };

    const res = await groqController.scoreProject(projectPayload);

    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });
});
