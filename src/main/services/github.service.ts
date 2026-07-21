import { readSecureToken } from './secure.service.js';
import type { UserGitHubProfile, ProjectItem, SectionAnalysis, FeedbackItem, ProjectScoreOverview } from '../../renderer/src/features/Github/types';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Standard fetch helper for GitHub API to include auth headers.
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

async function calculateLanguageDistribution(repos: any[], token: string) {
  const languageTotals: Record<string, number> = {};
  let totalBytes = 0;

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
      console.error(e)
    }
  }

  const results = Object.entries(languageTotals).map(([name, bytes]) => ({
    name,
    percentage: Math.round((bytes / totalBytes) * 100),
    color: LANGUAGE_COLORS[name] || '#8b949e'
  }));

  return results.sort((a, b) => b.percentage - a.percentage).slice(0, 5);
}

/**
 * Fetches the authenticated user profile.
 */
async function getGithubUser(token: string): Promise<any> {
  return await fetchGithubApi('/user', token);
}

/**
 * Evaluates the user's special profile README repository.
 */
async function evaluateProfileReadme(username: string, token: string) {
  let text = '';
  try {
    text = await fetchGithubApi(`/repos/${username}/${username}/readme`, token, true);
  } catch (err) {
    // 404 or other error
  }

  if (!text || typeof text === 'object' || text.includes('"message":"Not Found"')) {
    return {
      exists: false
    };
  }

  return {
    exists: true,
    contentRaw: text
  };
}

/**
 * Mock evaluate a single project
 */
function mockEvaluateProject(repo: any, readme: string, treeData: any, languages: string[]): ProjectItem {
  const hasDesc = !!repo.description && repo.description.length > 10;
  const descScore = hasDesc ? 85 : 0;
  
  const hasReadme = !!readme && readme.length > 50;
  const readmeScore = hasReadme ? 75 : 0;

  const structScore = 80;
  const langScore = 90;

  // S_global = (0.15 * S_desc) + (0.35 * S_readme) + (0.30 * S_struct) + (0.20 * S_lang)
  const globalScore = Math.round(
    (0.15 * descScore) + 
    (0.35 * readmeScore) + 
    (0.30 * structScore) + 
    (0.20 * langScore)
  );

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description || null,
    stars: repo.stargazers_count || 0,
    primaryLanguage: repo.language || 'Unknown',
    repoUrl: repo.html_url,
    scores: {
      globalScore,
      descriptionScore: descScore,
      readmeScore: readmeScore,
      structureScore: structScore,
      languagesScore: langScore
    },
    sections: {
      description: {
        sectionId: 'description',
        title: 'Project Description',
        score: descScore,
        hasContent: hasDesc,
        contentData: { text: repo.description },
        worseParts: hasDesc ? [] : [{ id: 'd1', type: 'worse_part', title: 'Missing Description', message: 'No description provided.', actionableSuggestion: 'Add a concise summary explaining what problem this project solves.' }],
        warnings: [],
        tips: []
      },
      readme: {
        sectionId: 'readme',
        title: 'README Quality',
        score: readmeScore,
        hasContent: hasReadme,
        contentData: { raw: readme },
        worseParts: hasReadme ? [] : [{ id: 'r1', type: 'worse_part', title: 'Missing README', message: 'No README found.', actionableSuggestion: 'Create a README.md file.' }],
        warnings: hasReadme ? [{ id: 'r2', type: 'warning', title: 'Basic README', message: 'The README is quite short.', actionableSuggestion: 'Add usage examples.' }] : [],
        tips: []
      },
      structure: {
        sectionId: 'structure',
        title: 'Project Structure',
        score: structScore,
        hasContent: !!treeData,
        contentData: { tree: treeData?.tree?.slice(0, 15) || [] },
        worseParts: [],
        warnings: [],
        tips: [{ id: 's1', type: 'tip', title: 'Group by feature', message: 'Consider grouping files by feature module.', actionableSuggestion: 'Move loose files into domain folders.' }]
      },
      languages: {
        sectionId: 'languages',
        title: 'Languages & Best Practices',
        score: langScore,
        hasContent: languages.length > 0,
        contentData: { languages },
        worseParts: [],
        warnings: [],
        tips: []
      }
    }
  };
}

let cachedRepos: any[] = [];
let lastProcessedIndex = 0;
let currentToken = '';

/**
 * Initializes the repos cache and resets pagination index.
 */
function initReposCache(repos: any[], token: string) {
  cachedRepos = repos;
  lastProcessedIndex = 0;
  currentToken = token;
}

/**
 * Fetches the next batch of valid projects based on internal state.
 */
export async function fetchNextProjectsBatch(batchSize = 6): Promise<ProjectItem[]> {
  const processedRepos: ProjectItem[] = [];

  if (!currentToken || lastProcessedIndex >= cachedRepos.length) {
    return processedRepos;
  }

  for (let i = lastProcessedIndex; i < cachedRepos.length; i++) {
    const repo = cachedRepos[i];
    lastProcessedIndex = i + 1; // Mark as evaluated/skipped

    if (repo.fork || repo.archived || repo.size === 0) continue;
    if (repo.name.toLowerCase() === repo.owner.login.toLowerCase()) continue;

    try {
      let treeData: any = null;
      try {
        treeData = await fetchGithubApi(`/repos/${repo.owner.login}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`, currentToken);
      } catch (e) {
        console.error(e);
      }

      let hasSrcFolder = false;
      if (treeData && treeData.tree) {
        hasSrcFolder = treeData.tree.some((f: any) => f.type === 'blob' && /(^|\/)src\//.test(f.path));
      }
      
      if (!hasSrcFolder) continue;

      let readme = '';
      try {
        const readmeData = await fetchGithubApi(`/repos/${repo.owner.login}/${repo.name}/readme`, currentToken, true);
        if (typeof readmeData === 'string' && !readmeData.includes('"message":"Not Found"')) {
          readme = readmeData;
        }
      } catch (e) {
        console.error(e);
      }

      let languages: string[] = [];
      try {
        const langs = await fetchGithubApi(repo.languages_url, currentToken);
        if (langs && typeof langs === 'object' && !langs.message) {
          languages = Object.keys(langs);
        }
      } catch (e) {
        console.error(e)
      }

      const projectItem = mockEvaluateProject(repo, readme, treeData, languages);
      processedRepos.push(projectItem);

      if (processedRepos.length >= batchSize) break;
    } catch (error) {
      console.error(error)
    }
  }

  return processedRepos;
}

/**
 * Main entry point: aggregates all GitHub metrics.
 */
export async function analyzeGithubProfile(): Promise<UserGitHubProfile> {
  const token = await readSecureToken('github');
  if (!token) {
    throw new Error('No GitHub token found in secure storage.');
  }

  const user = await getGithubUser(token);
  const profileReadme = await evaluateProfileReadme(user.login, token);

  let repos = await fetchGithubApi('/user/repos?visibility=public&sort=pushed&per_page=100', token);
  if (repos.message) repos = [];

  const globalLanguages = await calculateLanguageDistribution(repos, token);
  
  // Initialize caching and fetch first batch
  initReposCache(repos, token);
  const projects = await fetchNextProjectsBatch(6);

  return {
    username: user.login,
    displayName: user.name || user.login,
    avatarUrl: user.avatar_url,
    profileReadme,
    globalLanguages,
    projects
  };
}
