import { GitHubRepository } from '../types/projects';
import { KeywordMatchOptions, ProjectMatchResult } from '../../../shared/types/sorting';

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  py: 'Python',
  python: 'Python',
  golang: 'Go',
  go: 'Go',
  'c#': 'C#',
  csharp: 'C#',
  'c++': 'C++',
  cpp: 'C++',
  rust: 'Rust',
  java: 'Java',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  dart: 'Dart',
  flutter: 'Flutter',
  html: 'HTML',
  css: 'CSS',
  react: 'React',
  reactjs: 'React',
  'react.js': 'React',
  vue: 'Vue',
  vuejs: 'Vue',
  'vue.js': 'Vue',
  angular: 'Angular',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  mongo: 'MongoDB',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
  aws: 'AWS'
};

/**
 * Normalizes language or framework names to their canonical representation.
 */
export function normalizeLanguageName(name: string): string {
  if (!name) return '';
  const lower = name.trim().toLowerCase();
  if (LANGUAGE_ALIASES[lower]) {
    return LANGUAGE_ALIASES[lower];
  }
  // Return original capitalized appropriately
  return name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
}

/**
 * Extracts recognized technology and programming language keywords from text.
 */
export function extractLanguageKeywords(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  const foundKeywords = new Set<string>();

  // Tokenize words, preserving special chars like C#, C++, Node.js
  const tokens = text.match(/[A-Za-z0-9+#.-]+/g) || [];

  for (const rawToken of tokens) {
    const clean = rawToken.replace(/^[.,:;!?'"()\[\]{}]+|[.,:;!?'"()\[\]{}]+$/g, '');
    const lower = clean.toLowerCase();
    if (LANGUAGE_ALIASES[lower]) {
      foundKeywords.add(LANGUAGE_ALIASES[lower]);
    }
  }

  return Array.from(foundKeywords);
}

/**
 * Evaluates GitHub repositories against a list of target keywords and returns match results.
 */
export function matchProjectsByKeywords(options: KeywordMatchOptions): ProjectMatchResult[] {
  const { repositories, keywords, caseSensitive = false } = options;
  if (!repositories || !Array.isArray(repositories)) return [];

  const normalizedKeywords = keywords
    .map(k => (caseSensitive ? k.trim() : k.trim().toLowerCase()))
    .filter(k => k.length > 0);

  if (normalizedKeywords.length === 0) {
    return repositories.map(repo => ({
      repository: repo,
      isMatched: false,
      matchedKeywords: []
    }));
  }

  return repositories.map(repo => {
    const matched = new Set<string>();

    const repoLang = repo.language ? normalizeLanguageName(repo.language) : '';
    const repoName = repo.name || '';
    const repoDesc = repo.description || '';

    for (const kw of keywords) {
      const canonicalKw = normalizeLanguageName(kw);
      const searchTarget = caseSensitive ? kw : kw.toLowerCase();

      // 1. Check primary repository language
      if (repoLang && (caseSensitive ? repoLang === canonicalKw : repoLang.toLowerCase() === canonicalKw.toLowerCase())) {
        matched.add(canonicalKw);
      }

      // 2. Check repository name
      const nameToCheck = caseSensitive ? repoName : repoName.toLowerCase();
      if (nameToCheck.includes(searchTarget)) {
        matched.add(canonicalKw);
      }

      // 3. Check repository description
      const descToCheck = caseSensitive ? repoDesc : repoDesc.toLowerCase();
      if (descToCheck.includes(searchTarget)) {
        matched.add(canonicalKw);
      }
    }

    const matchedList = Array.from(matched);
    return {
      repository: repo,
      isMatched: matchedList.length > 0,
      matchedKeywords: matchedList,
      score: matchedList.length
    };
  });
}

/**
 * Returns list of repository IDs that match any of the given keywords.
 */
export function getPreselectedProjectIds(
  repositories: GitHubRepository[],
  keywords: string[]
): number[] {
  const results = matchProjectsByKeywords({ repositories, keywords });
  return results.filter(r => r.isMatched).map(r => r.repository.id);
}
