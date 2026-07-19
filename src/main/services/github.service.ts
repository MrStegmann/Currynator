import { readSecureToken } from './secure.service.js';

interface GithubMetricsPayload {
  profileReadme: {
    score: number;
    exists: boolean;
    improvementTips: string[];
  };
  languages: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  topProjects: Array<{
    projectName: string;
    repoScore: number;
    structuralFeedback: string[];
    missingReadme: boolean;
    descriptionTip: string | null;
  }>;
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Standard fetch helper for GitHub API to include auth headers.
 * @param endpoint The API endpoint (e.g., '/user')
 * @param token The GitHub Personal Access Token
 * @returns The JSON response or throws an error.
 */
async function fetchGithubApi(endpoint: string, token: string, isText = false): Promise<any> {
  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': isText ? 'application/vnd.github.v3.raw' : 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }
  return isText ? response.text() : response.json();
}

/**
 * Fetches the authenticated user's username.
 * @param token The GitHub Personal Access Token.
 * @returns The username string.
 */
async function getGithubUsername(token: string): Promise<string> {
  const data = await fetchGithubApi('/user', token);
  return data.login;
}

/**
 * Evaluates the user's special profile README repository.
 * @param username The GitHub username.
 * @param token The GitHub Personal Access Token.
 * @returns The profile README metrics object.
 */
async function evaluateProfileReadme(username: string, token: string) {
  let text = '';
  try {
    text = await fetchGithubApi(`/repos/${username}/${username}/readme`, token, true);
  } catch (err) {
    // 404 or other error
  }
  
  // if text is an object (error JSON), it means 404 since it didn't parse as text correctly
  if (!text || typeof text === 'object' || text.includes('"message":"Not Found"')) {
    return {
      score: 0,
      exists: false,
      improvementTips: ['Create a repository with your exact username to establish a profile README.']
    };
  }

  let score = 20; // Base score for existing
  const tips: string[] = [];

  if (text.length > 500) score += 30; else tips.push('Expand your README to be more comprehensive (>500 chars).');
  if (text.includes('![') || text.includes('<img')) score += 25; else tips.push('Add badges or images to make the profile visually engaging.');
  if (text.includes('http')) score += 25; else tips.push('Include links to your portfolio, LinkedIn, or personal website.');

  return {
    score,
    exists: true,
    improvementTips: tips
  };
}

/**
 * Map of popular languages to their standard hex colors.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Go: '#00ADD8'
};

/**
 * Calculates language distribution percentage across all repositories.
 * @param repos The list of public repositories.
 * @param token The GitHub Personal Access Token.
 * @returns The languages array with percentages and colors.
 */
async function calculateLanguageDistribution(repos: any[], token: string) {
  const languageTotals: Record<string, number> = {};
  let totalBytes = 0;

  // Process only top 10 repos to avoid rate limits / slow execution
  const topRepos = repos.slice(0, 10);
  
  for (const repo of topRepos) {
    try {
      const langs = await fetchGithubApi(repo.languages_url, token);
      if (typeof langs === 'object' && !langs.message) {
        for (const [lang, bytes] of Object.entries(langs as Record<string, number>)) {
          languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
          totalBytes += bytes;
        }
      }
    } catch (e) {
      // Ignore failure for a single repo
    }
  }

  const results = Object.entries(languageTotals).map(([name, bytes]) => ({
    name,
    percentage: Math.round((bytes / totalBytes) * 100),
    color: LANGUAGE_COLORS[name] || '#8b949e'
  }));

  return results.sort((a, b) => b.percentage - a.percentage).slice(0, 5); // Return top 5 languages
}

/**
 * Evaluates a single project and fetches its README to determine quality.
 * @param repo The repository object from GitHub API.
 * @param token The GitHub Personal Access Token.
 * @returns The evaluation object for the project.
 */
async function evaluateSingleProject(repo: any, token: string) {
  let missingReadme = true;
  try {
    const text = await fetchGithubApi(`/repos/${repo.owner.login}/${repo.name}/readme`, token, true);
    if (typeof text === 'string' && !text.includes('"message":"Not Found"')) {
      missingReadme = false;
    }
  } catch (err) { /* ignore */ }

  let repoScore = 50; // base score
  const structuralFeedback: string[] = [];
  
  if (!missingReadme) repoScore += 20; else structuralFeedback.push('Add a README.md to describe setup and usage.');
  if (repo.description) repoScore += 15; else structuralFeedback.push('Add a short repository description.');
  if (repo.has_issues) repoScore += 5;
  if (repo.size > 100) repoScore += 10; else structuralFeedback.push('Repository seems quite small; consider expanding functionality.');

  return {
    projectName: repo.name,
    repoScore,
    structuralFeedback,
    missingReadme,
    descriptionTip: repo.description ? null : 'A project description greatly improves discoverability.'
  };
}

/**
 * Analyzes the top 5 projects and generates heuristic valuation scores.
 * @param repos The user's public repositories sorted by relevance.
 * @param token The GitHub Personal Access Token.
 * @returns An array of top project evaluations.
 */
async function evaluateTopProjects(repos: any[], token: string) {
  const topRepos = repos.slice(0, 5);
  const evaluations = [];
  
  for (const repo of topRepos) {
    const evaluation = await evaluateSingleProject(repo, token);
    evaluations.push(evaluation);
  }
  
  return evaluations;
}

/**
 * Main entry point: aggregates all GitHub metrics into the expected schema.
 * @returns A promise resolving to the full metrics payload.
 */
export async function analyzeGithubProfile(): Promise<GithubMetricsPayload> {
  const token = await readSecureToken('github');
  if (!token) {
    throw new Error('No GitHub token found in secure storage.');
  }

  const username = await getGithubUsername(token);
  const profileReadme = await evaluateProfileReadme(username, token);
  
  // Fetch repos (public only, sorted by recently pushed)
  let repos = await fetchGithubApi('/user/repos?visibility=public&sort=pushed&per_page=30', token);
  if (repos.message) repos = []; // Handle errors cleanly
  
  const languages = await calculateLanguageDistribution(repos, token);
  const topProjects = await evaluateTopProjects(repos, token);

  return {
    profileReadme,
    languages,
    topProjects
  };
}
