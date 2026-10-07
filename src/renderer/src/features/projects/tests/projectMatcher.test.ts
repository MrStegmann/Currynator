import {
  extractLanguageKeywords,
  matchProjectsByKeywords,
  getPreselectedProjectIds,
  normalizeLanguageName
} from '../utils/projectMatcher';
import { GitHubRepository } from '../types/projects';

describe('projectMatcher utilities', () => {
  const mockRepos: GitHubRepository[] = [
    {
      id: 101,
      name: 'react-portfolio-app',
      full_name: 'user/react-portfolio-app',
      description: 'Modern portfolio created with React and TypeScript',
      html_url: 'https://github.com/user/react-portfolio-app',
      stargazers_count: 10,
      forks_count: 2,
      language: 'TypeScript',
      updated_at: '2024-03-01T00:00:00Z',
      private: false,
      size: 1200
    },
    {
      id: 102,
      name: 'django-microservice',
      full_name: 'user/django-microservice',
      description: 'Python backend API with Django and PostgreSQL',
      html_url: 'https://github.com/user/django-microservice',
      stargazers_count: 25,
      forks_count: 5,
      language: 'Python',
      updated_at: '2024-02-15T00:00:00Z',
      private: false,
      size: 3400
    },
    {
      id: 103,
      name: 'go-cli-utility',
      full_name: 'user/go-cli-utility',
      description: 'High performance CLI tool written in Go',
      html_url: 'https://github.com/user/go-cli-utility',
      stargazers_count: 4,
      forks_count: 0,
      language: 'Go',
      updated_at: '2023-11-20T00:00:00Z',
      private: false,
      size: 800
    },
    {
      id: 104,
      name: 'legacy-php-script',
      full_name: 'user/legacy-php-script',
      description: 'Internal automation scripts',
      html_url: 'https://github.com/user/legacy-php-script',
      stargazers_count: 0,
      forks_count: 0,
      language: 'PHP',
      updated_at: '2022-05-10T00:00:00Z',
      private: false,
      size: 450
    }
  ];

  describe('normalizeLanguageName', () => {
    it('normalizes common language aliases', () => {
      expect(normalizeLanguageName('TS')).toBe('TypeScript');
      expect(normalizeLanguageName('typescript')).toBe('TypeScript');
      expect(normalizeLanguageName('JS')).toBe('JavaScript');
      expect(normalizeLanguageName('javascript')).toBe('JavaScript');
      expect(normalizeLanguageName('py')).toBe('Python');
      expect(normalizeLanguageName('python')).toBe('Python');
      expect(normalizeLanguageName('golang')).toBe('Go');
      expect(normalizeLanguageName('C#')).toBe('C#');
      expect(normalizeLanguageName('c++')).toBe('C++');
    });

    it('preserves casing and unrecognized technology names nicely', () => {
      expect(normalizeLanguageName('Rust')).toBe('Rust');
      expect(normalizeLanguageName('Elixir')).toBe('Elixir');
    });
  });

  describe('extractLanguageKeywords', () => {
    it('extracts technical language and framework keywords from job requirements text', () => {
      const text = 'We are looking for a Senior Developer with 5+ years of TypeScript, React, Node.js, and Python experience.';
      const keywords = extractLanguageKeywords(text);

      expect(keywords).toContain('TypeScript');
      expect(keywords).toContain('React');
      expect(keywords).toContain('Python');
      expect(keywords).toContain('Node.js');
    });

    it('handles comma-separated and bulleted technology tags', () => {
      const text = 'Required: Golang, PostgreSQL, Docker, TS';
      const keywords = extractLanguageKeywords(text);

      expect(keywords).toContain('Go');
      expect(keywords).toContain('TypeScript');
      expect(keywords).toContain('PostgreSQL');
      expect(keywords).toContain('Docker');
    });

    it('returns empty array for empty or text without tech keywords', () => {
      expect(extractLanguageKeywords('')).toEqual([]);
      expect(extractLanguageKeywords('Great team player with good communication skills.')).toEqual([]);
    });
  });

  describe('matchProjectsByKeywords', () => {
    it('matches repositories by primary programming language and description keywords', () => {
      const results = matchProjectsByKeywords({
        repositories: mockRepos,
        keywords: ['TypeScript', 'React']
      });

      const matched = results.filter(r => r.isMatched);
      expect(matched).toHaveLength(1);
      expect(matched[0].repository.id).toBe(101);
      expect(matched[0].matchedKeywords).toContain('TypeScript');
      expect(matched[0].matchedKeywords).toContain('React');
    });

    it('matches multiple repositories if keywords span multiple stacks', () => {
      const results = matchProjectsByKeywords({
        repositories: mockRepos,
        keywords: ['Python', 'Go']
      });

      const matchedIds = results.filter(r => r.isMatched).map(r => r.repository.id);
      expect(matchedIds).toContain(102);
      expect(matchedIds).toContain(103);
      expect(matchedIds).not.toContain(104);
    });

    it('returns isMatched=false for all repositories when no keywords match', () => {
      const results = matchProjectsByKeywords({
        repositories: mockRepos,
        keywords: ['Ruby', 'Kotlin']
      });

      expect(results.every(r => !r.isMatched)).toBe(true);
    });

    it('handles empty repositories or empty keywords safely', () => {
      expect(matchProjectsByKeywords({ repositories: [], keywords: ['TypeScript'] })).toEqual([]);
      expect(matchProjectsByKeywords({ repositories: mockRepos, keywords: [] }).every(r => !r.isMatched)).toBe(true);
    });
  });

  describe('getPreselectedProjectIds', () => {
    it('returns an array of matched repository IDs directly', () => {
      const ids = getPreselectedProjectIds(mockRepos, ['TypeScript', 'Python']);
      expect(ids).toEqual([101, 102]);
    });

    it('returns empty array if nothing matches', () => {
      const ids = getPreselectedProjectIds(mockRepos, ['Swift']);
      expect(ids).toEqual([]);
    });
  });
});
