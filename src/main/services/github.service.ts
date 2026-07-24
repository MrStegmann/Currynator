import { readSecureToken } from './secure.service.js';
import { evaluateProfileReadmeWithGroq, evaluateProjectWithGroq } from './groq.service.js';
import type { UserGitHubProfile, ProjectItem } from '../../renderer/src/features/Github/types';

const GITHUB_API_BASE = 'https://api.github.com';

export type ProgressCallback = (stageText: string, percent: number) => void;

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
      console.error(e);
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
 * Evaluates the user's special profile README repository using Groq AI.
 */
async function evaluateProfileReadme(
  username: string,
  token: string,
  onAiStatus?: (statusMsg: string) => void
) {
  let text = '';
  try {
    text = await fetchGithubApi(`/repos/${username}/${username}/readme`, token, true);
  } catch (err) {
    // 404 or other network error
  }

  if (!text || typeof text === 'object' || (typeof text === 'string' && text.includes('"message":"Not Found"'))) {
    return {
      exists: false,
      score: 0,
      worseParts: [
        {
          id: 'p_m1',
          type: 'worse_part' as const,
          title: 'Missing Profile README',
          message: 'No profile README repository found on GitHub.',
          actionableSuggestion: 'Create a repository matching your GitHub username with a README.md file.'
        }
      ],
      warnings: [],
      tips: []
    };
  }

  const groqResult = await evaluateProfileReadmeWithGroq(username, text, onAiStatus);

  return {
    exists: true,
    contentRaw: text,
    score: groqResult.score,
    worseParts: groqResult.worseParts,
    warnings: groqResult.warnings,
    tips: groqResult.tips
  };
}

/**
 * Samples up to 3 core source files from repository.
 */
async function fetchCoreSourceFiles(
  owner: string,
  repoName: string,
  treeData: any,
  token: string
): Promise<Array<{ file_path: string; content: string }>> {
  if (!treeData || !Array.isArray(treeData.tree)) {
    return [];
  }

  const validFiles = treeData.tree.filter((f: any) => {
    if (f.type !== 'blob' || !f.path) return false;
    const pathLower = f.path.toLowerCase();
    if (pathLower.includes('node_modules') || pathLower.includes('dist') || pathLower.includes('build') || pathLower.includes('package-lock')) {
      return false;
    }
    return /\.(ts|tsx|js|jsx|py|java|go|c|cpp|cs|php|rb|swift|rs|kt)$/i.test(f.path);
  });

  const srcFiles = validFiles.filter((f: any) => /(^|\/)src\//.test(f.path));
  const candidateFiles = (srcFiles.length > 0 ? srcFiles : validFiles).slice(0, 3);

  const samples: Array<{ file_path: string; content: string }> = [];
  for (const file of candidateFiles) {
    try {
      const fileContent = await fetchGithubApi(`/repos/${owner}/${repoName}/contents/${file.path}`, token, true);
      if (typeof fileContent === 'string' && !fileContent.includes('"message":"Not Found"')) {
        samples.push({
          file_path: file.path,
          content: fileContent.substring(0, 4000)
        });
      }
    } catch (e) {
      console.error(`Error fetching source file ${file.path}:`, e);
    }
  }

  return samples;
}

/**
 * Constructs an unscored initial project structure.
 */
function createUnscoredProjectItem(
  repo: any,
  readme: string,
  treeData: any,
  languages: string[]
): ProjectItem {
  const hasDesc = !!repo.description && repo.description.length > 0;
  const hasReadme = !!readme && readme.length > 0;

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description || null,
    stars: repo.stargazers_count || 0,
    primaryLanguage: repo.language || (languages.length > 0 ? languages[0] : 'Unknown'),
    repoUrl: repo.html_url,
    statusScore: 'unscored',
    scores: {
      globalScore: 0,
      descriptionScore: 0,
      readmeScore: 0,
      structureScore: 0,
      languagesScore: 0
    },
    sections: {
      description: {
        sectionId: 'description',
        title: 'Project Description',
        score: 0,
        hasContent: hasDesc,
        contentData: { text: repo.description || '' },
        worseParts: [],
        warnings: [],
        tips: []
      },
      readme: {
        sectionId: 'readme',
        title: 'README Quality',
        score: 0,
        hasContent: hasReadme,
        contentData: { raw: readme },
        worseParts: [],
        warnings: [],
        tips: []
      },
      structure: {
        sectionId: 'structure',
        title: 'Project Structure',
        score: 0,
        hasContent: !!treeData && Array.isArray(treeData.tree) && treeData.tree.length > 0,
        contentData: { tree: treeData?.tree?.slice(0, 15) || [] },
        worseParts: [],
        warnings: [],
        tips: []
      },
      languages: {
        sectionId: 'languages',
        title: 'Languages & Best Practices',
        score: 0,
        hasContent: languages.length > 0,
        contentData: { languages },
        worseParts: [],
        warnings: [],
        tips: []
      }
    }
  };
}

/**
 * Evaluates a single project using Groq AI service on demand.
 */
async function evaluateProjectWithAI(
  repo: any,
  readme: string,
  treeData: any,
  languages: string[],
  coreFiles: Array<{ file_path: string; content: string }>,
  onAiStatus?: (statusMsg: string) => void
): Promise<ProjectItem> {
  const fileTree = Array.isArray(treeData?.tree)
    ? treeData.tree.slice(0, 30).map((f: any) => f.path || '')
    : [];

  const groqEval = await evaluateProjectWithGroq(
    {
      name: repo.name,
      description: repo.description || null,
      languages,
      readme_content: readme.substring(0, 3000),
      code_samples: coreFiles,
      file_tree: fileTree
    },
    onAiStatus
  );

  const descriptionScore = repo.description ? groqEval.descriptionScore : 0;
  const readmeScore = readme ? groqEval.readmeScore : 0;
  const structureScore = groqEval.structureScore;
  const languagesScore = groqEval.languagesScore;

  // S_global = (0.15 * S_desc) + (0.35 * S_readme) + (0.30 * S_struct) + (0.20 * S_lang)
  const globalScore = Math.round(
    (0.15 * descriptionScore) +
    (0.35 * readmeScore) +
    (0.30 * structureScore) +
    (0.20 * languagesScore)
  );

  const hasDesc = !!repo.description && repo.description.length > 5;
  const hasReadme = !!readme && readme.length > 20;

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description || null,
    stars: repo.stargazers_count || 0,
    primaryLanguage: repo.language || (languages.length > 0 ? languages[0] : 'Unknown'),
    repoUrl: repo.html_url,
    statusScore: 'score',
    scores: {
      globalScore,
      descriptionScore,
      readmeScore,
      structureScore,
      languagesScore
    },
    sections: {
      description: {
        sectionId: 'description',
        title: 'Project Description',
        score: descriptionScore,
        hasContent: hasDesc,
        contentData: { text: repo.description || '' },
        worseParts: groqEval.sections.description.worseParts,
        warnings: groqEval.sections.description.warnings,
        tips: groqEval.sections.description.tips
      },
      readme: {
        sectionId: 'readme',
        title: 'README Quality',
        score: readmeScore,
        hasContent: hasReadme,
        contentData: { raw: readme },
        worseParts: groqEval.sections.readme.worseParts,
        warnings: groqEval.sections.readme.warnings,
        tips: groqEval.sections.readme.tips
      },
      structure: {
        sectionId: 'structure',
        title: 'Project Structure',
        score: structureScore,
        hasContent: !!treeData && Array.isArray(treeData.tree) && treeData.tree.length > 0,
        contentData: { tree: treeData?.tree?.slice(0, 15) || [] },
        worseParts: groqEval.sections.structure.worseParts,
        warnings: groqEval.sections.structure.warnings,
        tips: groqEval.sections.structure.tips
      },
      languages: {
        sectionId: 'languages',
        title: 'Languages & Best Practices',
        score: languagesScore,
        hasContent: languages.length > 0,
        contentData: { languages },
        worseParts: groqEval.sections.languages.worseParts,
        warnings: groqEval.sections.languages.warnings,
        tips: groqEval.sections.languages.tips
      }
    }
  };
}

let cachedRepos: any[] = [];
let evaluatedProjectsCache: Record<string, ProjectItem> = {};
let lastProcessedIndex = 0;
let currentToken = '';

/**
 * Initializes the repos cache and resets pagination index.
 */
function initReposCache(repos: any[], token: string) {
  cachedRepos = repos;
  evaluatedProjectsCache = {};
  lastProcessedIndex = 0;
  currentToken = token;
}

/**
 * Fetches the next batch of valid projects in unscored state.
 */
export async function fetchNextProjectsBatch(
  batchSize = 6,
  onProgress?: ProgressCallback,
  startPercent = 60,
  endPercent = 95
): Promise<ProjectItem[]> {
  const processedRepos: ProjectItem[] = [];

  if (!currentToken || lastProcessedIndex >= cachedRepos.length) {
    return processedRepos;
  }

  const totalToEvaluate = Math.min(batchSize, cachedRepos.length - lastProcessedIndex);

  for (let i = lastProcessedIndex; i < cachedRepos.length; i++) {
    const repo = cachedRepos[i];
    lastProcessedIndex = i + 1;

    if (repo.fork || repo.archived || repo.size === 0) continue;
    if (repo.name.toLowerCase() === repo.owner.login.toLowerCase()) continue;

    const currentItemNum = processedRepos.length + 1;
    const calcPercent = Math.round(startPercent + ((currentItemNum / totalToEvaluate) * (endPercent - startPercent)));

    try {
      onProgress?.(`[${currentItemNum}/${totalToEvaluate}] Importing ${repo.name}...`, calcPercent);

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
        console.error(e);
      }

      const repoIdStr = String(repo.id);
      const projectItem = evaluatedProjectsCache[repoIdStr] || createUnscoredProjectItem(repo, readme, treeData, languages);

      processedRepos.push(projectItem);

      if (processedRepos.length >= batchSize) break;
    } catch (error) {
      console.error(error);
    }
  }

  return processedRepos;
}

/**
 * On-Demand evaluation: Evaluates a single project by ID using Groq AI.
 */
export async function evaluateSingleProjectById(
  projectId: string,
  onProgress?: (statusMsg: string) => void
): Promise<ProjectItem> {
  const token = currentToken || await readSecureToken('github');
  if (!token) {
    throw new Error('No GitHub token found in secure storage.');
  }

  const targetRepo = cachedRepos.find(r => String(r.id) === projectId);
  if (!targetRepo) {
    throw new Error(`Repository with ID ${projectId} not found in cache.`);
  }

  onProgress?.(`Fetching structure & source files for ${targetRepo.name}...`);

  let treeData: any = null;
  try {
    treeData = await fetchGithubApi(`/repos/${targetRepo.owner.login}/${targetRepo.name}/git/trees/${targetRepo.default_branch}?recursive=1`, token);
  } catch (e) {
    console.error(e);
  }

  let readme = '';
  try {
    const readmeData = await fetchGithubApi(`/repos/${targetRepo.owner.login}/${targetRepo.name}/readme`, token, true);
    if (typeof readmeData === 'string' && !readmeData.includes('"message":"Not Found"')) {
      readme = readmeData;
    }
  } catch (e) {
    console.error(e);
  }

  let languages: string[] = [];
  try {
    const langs = await fetchGithubApi(targetRepo.languages_url, token);
    if (langs && typeof langs === 'object' && !langs.message) {
      languages = Object.keys(langs);
    }
  } catch (e) {
    console.error(e);
  }

  onProgress?.(`Sampling core files & running Groq AI analysis on ${targetRepo.name}...`);
  const coreFiles = await fetchCoreSourceFiles(targetRepo.owner.login, targetRepo.name, treeData, token);

  const scoredProject = await evaluateProjectWithAI(targetRepo, readme, treeData, languages, coreFiles, onProgress);
  scoredProject.statusScore = 'score';

  evaluatedProjectsCache[projectId] = scoredProject;

  return scoredProject;
}

/**
 * Refetches exclusive account profile README and re-scores it with Groq AI.
 */
export async function refetchProfileReadmeOnly(onProgress?: (msg: string) => void) {
  const token = currentToken || await readSecureToken('github');
  if (!token) {
    throw new Error('No GitHub token found in secure storage.');
  }

  const user = await getGithubUser(token);
  onProgress?.(`Re-fetching profile README for @${user.login}...`);

  const updatedProfileReadme = await evaluateProfileReadme(user.login, token, onProgress);
  return updatedProfileReadme;
}

/**
 * Refetches all public GitHub projects without scoring them upfront.
 */
export async function refetchAllProjectsUnscored(onProgress?: ProgressCallback) {
  const token = currentToken || await readSecureToken('github');
  if (!token) {
    throw new Error('No GitHub token found in secure storage.');
  }

  onProgress?.('Re-fetching public repositories list from GitHub...', 20);
  let repos = await fetchGithubApi('/user/repos?visibility=public&sort=pushed&per_page=100', token);
  if (repos.message) repos = [];

  initReposCache(repos, token);
  onProgress?.('Re-importing repositories list...', 60);

  const projects = await fetchNextProjectsBatch(6, onProgress, 60, 100);
  return projects;
}

/**
 * Refetches data for a single project from GitHub API and updates its score if previously evaluated.
 */
export async function refetchSingleProjectData(
  projectId: string,
  onProgress?: (msg: string) => void
): Promise<ProjectItem> {
  const token = currentToken || await readSecureToken('github');
  if (!token) {
    throw new Error('No GitHub token found in secure storage.');
  }

  let targetRepo = cachedRepos.find(r => String(r.id) === projectId);
  if (!targetRepo) {
    onProgress?.(`Fetching repository ${projectId} from GitHub...`);
    targetRepo = await fetchGithubApi(`/repositories/${projectId}`, token);
  } else {
    onProgress?.(`Re-fetching details for ${targetRepo.name}...`);
    targetRepo = await fetchGithubApi(`/repos/${targetRepo.owner.login}/${targetRepo.name}`, token);
  }

  let treeData: any = null;
  try {
    treeData = await fetchGithubApi(`/repos/${targetRepo.owner.login}/${targetRepo.name}/git/trees/${targetRepo.default_branch}?recursive=1`, token);
  } catch (e) {
    console.error(e);
  }

  let readme = '';
  try {
    const readmeData = await fetchGithubApi(`/repos/${targetRepo.owner.login}/${targetRepo.name}/readme`, token, true);
    if (typeof readmeData === 'string' && !readmeData.includes('"message":"Not Found"')) {
      readme = readmeData;
    }
  } catch (e) {
    console.error(e);
  }

  let languages: string[] = [];
  try {
    const langs = await fetchGithubApi(targetRepo.languages_url, token);
    if (langs && typeof langs === 'object' && !langs.message) {
      languages = Object.keys(langs);
    }
  } catch (e) {
    console.error(e);
  }

  const existingItem = evaluatedProjectsCache[projectId];
  const wasScored = existingItem?.statusScore === 'score';

  if (wasScored) {
    onProgress?.(`Re-evaluating ${targetRepo.name} with Groq AI...`);
    const coreFiles = await fetchCoreSourceFiles(targetRepo.owner.login, targetRepo.name, treeData, token);
    const scoredProject = await evaluateProjectWithAI(targetRepo, readme, treeData, languages, coreFiles, onProgress);
    evaluatedProjectsCache[projectId] = scoredProject;
    return scoredProject;
  } else {
    const unscoredProject = createUnscoredProjectItem(targetRepo, readme, treeData, languages);
    return unscoredProject;
  }
}

/**
 * Main entry point: aggregates all GitHub metrics and profile README score.
 */
export async function analyzeGithubProfile(onProgress?: ProgressCallback): Promise<UserGitHubProfile> {
  onProgress?.('Fetching GitHub user profile metadata...', 10);
  const token = await readSecureToken('github');
  if (!token) {
    throw new Error('No GitHub token found in secure storage.');
  }

  const user = await getGithubUser(token);
  onProgress?.(`Authenticated as @${user.login}. Fetching profile README...`, 20);

  const profileReadme = await evaluateProfileReadme(user.login, token, (msg) => {
    onProgress?.(`Account Profile: ${msg}`, 30);
  });
  onProgress?.('Profile README evaluated. Fetching public repository list...', 40);

  let repos = await fetchGithubApi('/user/repos?visibility=public&sort=pushed&per_page=100', token);
  if (repos.message) repos = [];

  onProgress?.(`Found ${repos.length} public repos. Computing language distribution...`, 50);
  const globalLanguages = await calculateLanguageDistribution(repos, token);

  // Initialize caching and fetch first batch
  initReposCache(repos, token);
  onProgress?.('Importing repositories list...', 60);
  const projects = await fetchNextProjectsBatch(6, onProgress, 60, 95);

  onProgress?.('Finalizing GitHub evaluation metrics...', 100);

  return {
    username: user.login,
    displayName: user.name || user.login,
    avatarUrl: user.avatar_url,
    profileReadme,
    globalLanguages,
    projects
  };
}
