import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { GroqController } from '../../../src/main/controllers/GroqController.js';

describe('GroqController', () => {
  let controller: GroqController;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, GROQ_API_KEY: 'gsk_mock_test_key' };
    controller = new GroqController();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return error if GROQ_API_KEY is not set', async () => {
    delete process.env.GROQ_API_KEY;
    const noKeyController = new GroqController();
    const result = await noKeyController.analyzeSkills(['React', 'TypeScript']);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/GROQ_API_KEY/i);
  });

  it('should handle empty skills input gracefully', async () => {
    const result = await controller.analyzeSkills([]);
    expect(result).toEqual({ success: true, data: [] });
  });

  it('should sanitize markdown code blocks and parse valid skill categories', async () => {
    const mockResponseText = `\`\`\`json
[
  {
    "name": "Frontend & Web Development",
    "keywords": ["React", "HTML5"]
  },
  {
    "name": "Non-Elemental",
    "keywords": ["Front-End"]
  }
]
\`\`\``;

    const mockGroqClient = {
      chat: {
        completions: {
          create: jest.fn<any>().mockResolvedValue({
            choices: [
              {
                message: {
                  content: mockResponseText
                }
              }
            ]
          })
        }
      }
    };

    const customController = new GroqController(mockGroqClient as any);
    const result = await customController.analyzeSkills(['React', 'HTML5', 'Front-End']);

    expect(result.success).toBe(true);
    expect(result.data).toEqual([
      {
        name: 'Frontend & Web Development',
        keywords: ['React', 'HTML5']
      },
      {
        name: 'Non-Elemental',
        keywords: ['Front-End']
      }
    ]);
  });

  it('should catch API exceptions and return formatted error', async () => {
    const mockGroqClient = {
      chat: {
        completions: {
          create: jest.fn<any>().mockRejectedValue(new Error('Rate limit exceeded (HTTP 429)'))
        }
      }
    };

    const customController = new GroqController(mockGroqClient as any);
    const result = await customController.analyzeSkills(['Python', 'Java']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Rate limit exceeded');
  });

  it('should strip table headers if present in raw skill inputs', () => {
    const rawInput = ['Name', 'Skill', 'JavaScript', 'SQL'];
    const filtered = controller.stripHeaders(rawInput);
    expect(filtered).toEqual(['JavaScript', 'SQL']);
  });

  it('should handle API request timeout errors gracefully', async () => {
    const mockGroqClient = {
      chat: {
        completions: {
          create: jest.fn<any>().mockRejectedValue(new Error('Request timed out after 10000ms'))
        }
      }
    };

    const customController = new GroqController(mockGroqClient as any);
    const result = await customController.analyzeSkills(['C++', 'Rust']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Request timed out');
  });

  it('should return error when response content is not valid JSON', async () => {
    const mockGroqClient = {
      chat: {
        completions: {
          create: jest.fn<any>().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Sorry, I cannot process these skills.'
                }
              }
            ]
          })
        }
      }
    };

    const customController = new GroqController(mockGroqClient as any);
    const result = await customController.analyzeSkills(['Ruby']);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  describe('analyzeWorkSection', () => {
    it('should return error if GROQ_API_KEY is not set', async () => {
      delete process.env.GROQ_API_KEY;
      const noKeyController = new GroqController();
      const result = await noKeyController.analyzeWorkSection([{
        name: 'Acme',
        position: 'Dev',
        startDate: '2020-01',
        endDate: '2021-01'
      }]);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/GROQ_API_KEY/i);
    });

    it('should handle empty work input gracefully', async () => {
      const result = await controller.analyzeWorkSection([]);
      expect(result).toEqual({ success: true, data: [] });
    });

    it('should sanitize markdown code blocks and parse valid work entries', async () => {
      const mockWork = [
        {
          name: 'Tech Corp',
          position: 'Senior Software Engineer',
          url: 'https://techcorp.com',
          startDate: '2020-01-01',
          endDate: '2023-05-01',
          summary: 'Led backend dev.',
          highlights: ['Built APIs']
        }
      ];

      const mockResponseText = `\`\`\`json
[
  {
    "name": "Tech Corp",
    "position": "Senior Software Engineer",
    "url": "https://techcorp.com",
    "startDate": "2020-01-01",
    "endDate": "2023-05-01",
    "summary": "Directed backend system development and architectural decisions.",
    "highlights": ["Engineered high-performance RESTful APIs."]
  }
]
\`\`\``;

      const mockGroqClient = {
        chat: {
          completions: {
            create: jest.fn<any>().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: mockResponseText
                  }
                }
              ]
            })
          }
        }
      };

      const customController = new GroqController(mockGroqClient as any);
      const result = await customController.analyzeWorkSection(mockWork);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        {
          name: 'Tech Corp',
          position: 'Senior Software Engineer',
          url: 'https://techcorp.com',
          startDate: '2020-01-01',
          endDate: '2023-05-01',
          summary: 'Directed backend system development and architectural decisions.',
          highlights: ['Engineered high-performance RESTful APIs.']
        }
      ]);
      expect(mockGroqClient.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'qwen/qwen3.8-27b',
          temperature: 0.1
        })
      );
    });

    it('should handle markdown code fences with trailing commentary or extra brackets', async () => {
      const mockWork = [{ name: 'Acme', position: 'Dev', startDate: '2020', endDate: '2021' }];
      const mockResponseText = `\`\`\`json
[
  {
    "name": "Acme",
    "position": "Developer",
    "startDate": "2020",
    "endDate": "2021"
  }
]
\`\`\`
[Note: I updated the position from Dev to Developer]`;

      const mockGroqClient = {
        chat: {
          completions: {
            create: jest.fn<any>().mockResolvedValue({
              choices: [{ message: { content: mockResponseText } }]
            })
          }
        }
      };

      const customController = new GroqController(mockGroqClient as any);
      const result = await customController.analyzeWorkSection(mockWork);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        {
          name: 'Acme',
          position: 'Developer',
          url: undefined,
          startDate: '2020',
          endDate: '2021',
          summary: undefined,
          highlights: []
        }
      ]);
    });

    it('should fallback to original work data if LLM returns empty strings or missing fields', async () => {
      const mockWork = [
        {
          name: 'Original Company',
          position: 'Original Position',
          startDate: '2020-01',
          endDate: '2022-01',
          summary: 'Original summary',
          highlights: ['Original highlight']
        }
      ];

      const mockResponseText = JSON.stringify([
        {
          name: '',
          position: '',
          startDate: '',
          endDate: '',
          summary: 'Polished summary',
          highlights: ['Polished highlight']
        }
      ]);

      const mockGroqClient = {
        chat: {
          completions: {
            create: jest.fn<any>().mockResolvedValue({
              choices: [{ message: { content: mockResponseText } }]
            })
          }
        }
      };

      const customController = new GroqController(mockGroqClient as any);
      const result = await customController.analyzeWorkSection(mockWork);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        {
          name: 'Original Company',
          position: 'Original Position',
          url: undefined,
          startDate: '2020-01',
          endDate: '2022-01',
          summary: 'Polished summary',
          highlights: ['Polished highlight']
        }
      ]);
    });

    it('should handle Groq API error gracefully', async () => {
      const mockGroqClient = {
        chat: {
          completions: {
            create: jest.fn<any>().mockRejectedValue(new Error('API quota exceeded'))
          }
        }
      };

      const customController = new GroqController(mockGroqClient as any);
      const result = await customController.analyzeWorkSection([{
        name: 'Acme',
        position: 'Dev',
        startDate: '2020-01',
        endDate: '2021-01'
      }]);

      expect(result.success).toBe(false);
      expect(result.error).toContain('API quota exceeded');
    });
  });
});
