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
    repositoryName: string;
    description: string;
    readmeShort: string;
    languages: string[];
    score: number;
    strengths: string[];
    areasForImprovement: string[];
    justification: string;
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
      console.error(e)
    }
  }

  const results = Object.entries(languageTotals).map(([name, bytes]) => ({
    name,
    percentage: Math.round((bytes / totalBytes) * 100),
    color: LANGUAGE_COLORS[name] || '#8b949e'
  }));

  return results.sort((a, b) => b.percentage - a.percentage).slice(0, 5); // Return top 5 languages
}

import { GoogleGenAI, Type } from '@google/genai';

/**
 * Analyzes the top projects and generates valuation scores using Gemini.
 * @param repos The user's public repositories.
 * @param token The GitHub Personal Access Token.
 * @returns An array of top project evaluations.
 */
async function evaluateTopProjects(repos: any[], token: string) {
  const topRepos = repos.slice(0, 30); // Allow more repos in case many are filtered out
  const processedRepos = [];

  for (const repo of topRepos) {
    // 1. Skip projects that are forks or archived
    if (repo.fork || repo.archived) continue;
    
    // 2. Skip projects that are empty
    if (repo.size === 0) continue;
    
    // 3. Skip GitHub Account project used for UI theme (username repo)
    if (repo.name.toLowerCase() === repo.owner.login.toLowerCase()) continue;

    try {
      let treeData: any = null;
      try {
        treeData = await fetchGithubApi(`/repos/${repo.owner.login}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`, token);
      } catch (e) {
        console.error(e);
      }

      // 4. Skip any projects that haven't a src folder with at least 1 file
      let hasSrcFolder = false;
      if (treeData && treeData.tree) {
        hasSrcFolder = treeData.tree.some((f: any) => f.type === 'blob' && /(^|\/)src\//.test(f.path));
      }
      
      if (!hasSrcFolder) continue;

      let readme = '';
      try {
        const readmeData = await fetchGithubApi(`/repos/${repo.owner.login}/${repo.name}/readme`, token, true);
        if (typeof readmeData === 'string' && !readmeData.includes('"message":"Not Found"')) {
          readme = readmeData;
        }
      } catch (e) {
        console.error(e);
      }

      const codeSamples = [];
      if (treeData && treeData.tree) {
        const coreFiles = treeData.tree
          .filter((f: any) => f.type === 'blob' && /\.(ts|js|jsx|tsx|java|py|go|css|html)$/.test(f.path || ''))
          .filter((f: any) => !f.path?.includes('node_modules') && !f.path?.includes('dist') && !f.path?.includes('build'))
          .slice(0, 3);

        for (const file of coreFiles) {
          if (!file.path) continue;
          try {
            // For file contents, we need the raw media type
            const fileUrl = `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/contents/${file.path}`;
            const fileResponse = await fetch(fileUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3.raw',
                'X-GitHub-Api-Version': '2022-11-28'
              }
            });
            if (fileResponse.ok) {
              const fileContent = await fileResponse.text();
              codeSamples.push({
                file_path: file.path,
                content: fileContent.substring(0, 2000)
              });
            }
          } catch (e) { console.error(e) }
        }
      }

      let languages: string[] = [];
      try {
        const langs = await fetchGithubApi(repo.languages_url, token);
        if (langs && typeof langs === 'object' && !langs.message) {
          languages = Object.keys(langs);
        }
      } catch (e) {
        console.error(e)
      }

      processedRepos.push({
        name: repo.name,
        description: repo.description || '',
        languages,
        readme_content: readme.substring(0, 1500),
        code_samples: codeSamples,
      });

      if (processedRepos.length >= 5) break;
    } catch (error) {
      console.error(error)
    }
  }

  if (processedRepos.length === 0) return [];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Analyze these repositories and select the top 5 best ones based on code quality, architecture, and standards:\n\n${JSON.stringify(processedRepos, null, 2)}`,
      config: {
        systemInstruction: 'You are an expert technical architect. Evaluate the projects based on architecture, design patterns, clean code principles, and documentation. Select the top 5 best repositories. If there are fewer than 5 valid engineering projects, return all available. Ignore empty repositories or default templates.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            top_projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  repository_name: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  areas_for_improvement: { type: Type.ARRAY, items: { type: Type.STRING } },
                  justification: { type: Type.STRING },
                },
                required: ['repository_name', 'score', 'justification', 'strengths', 'areas_for_improvement'],
              },
            },
          },
          required: ['top_projects'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    return (parsed.top_projects || [])
      .filter((aiProj: any) => aiProj && aiProj.repository_name)
      .map((aiProj: any) => {
        const originalRepo = processedRepos.find(r => r.name === aiProj.repository_name);
        return {
          repositoryName: aiProj.repository_name,
          score: aiProj.score || 0,
          strengths: aiProj.strengths || [],
          areasForImprovement: aiProj.areas_for_improvement || [],
          justification: aiProj.justification || '',
          description: originalRepo?.description || '',
          readmeShort: originalRepo?.readme_content ? originalRepo.readme_content.substring(0, 120) + '...' : '',
          languages: originalRepo?.languages || []
        };
      });
  } catch (err) {
    console.error(err)
    return processedRepos.map(repo => ({
      repositoryName: repo.name,
      score: 50,
      strengths: [],
      areasForImprovement: [],
      justification: 'Failed to evaluate using AI.',
      description: repo.description,
      readmeShort: repo.readme_content ? repo.readme_content.substring(0, 120) + '...' : '',
      languages: repo.languages
    }));
  }
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
