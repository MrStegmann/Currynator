import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { Skill, Work } from '../shared/schema/resumeSchema.js';

export interface GroqAnalysisResponse {
  success: boolean;
  data?: Skill[];
  error?: string;
}

export interface GroqWorkAnalysisResponse {
  success: boolean;
  data?: Work[];
  error?: string;
}

export interface GroqCvJobDrivenRequest {
  resume: any;
  jobApplication: {
    title: string;
    jobDescription: string;
    jobRequirement: string;
    companyDescription?: string;
    companyWebsiteUrl?: string;
  };
}

export interface GroqCvJobDrivenResponse {
  success: boolean;
  match_score?: number;
  json_resume?: Record<string, any>;
  error?: string;
}

export interface GroqProjectScorePayload {
  id: number;
  name: string;
  description?: string | null;
  language?: string | null;
  html_url: string;
  readmeContent?: string;
  commitLogs?: string[];
  fileTree?: string[];
}

export interface GroqProjectScoreResponse {
  success: boolean;
  data?: {
    repoId: number;
    repoName: string;
    totalScore: number;
    evaluatedAt: string;
    logs: {
      category: string;
      title: string;
      score: number;
      log: string;
      improvements: string[];
    }[];
  };
  error?: string;
}

function ensureEnvLoaded() {
  if (process.env.GROQ_API_KEY) return;
  try {
    if (typeof (process as any).loadEnvFile === 'function') {
      (process as any).loadEnvFile();
      if (process.env.GROQ_API_KEY) return;
    }
  } catch { }

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (key && !process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch { }
}

export const ALLOWED_CATEGORIES = [
  'Programming Languages',
  'Backend, Frameworks & Libraries',
  'Frontend & Web Development',
  'Databases & Storage',
  'Tools & Environments',
  'Cloud, DevOps & Infrastructure',
  'Version Control & Workflows',
  'Testing & Quality Assurance',
  'Architecture & Patterns',
  'Methodologies & Management',
  'Non-Elemental',
  'Non-grouped'
] as const;

export type AllowedCategory = typeof ALLOWED_CATEGORIES[number];

const GROQ_SYSTEM_PROMPT = `You are an expert Software Developer and Technical Recruiter.

**Task:**
Given a \`Skills.csv\` file (where the first row contains table headers and must be ignored), process and categorize every skill according to the following guidelines:
1. **Filter & Evaluate:** Select only skills that are useful and impactful for a professional Curriculum Vitae (CV).
2. **Categorize by Tech Stack:** Group valid skills into their appropriate primary tech stack category.
3. **Flag Inefficiencies:** Group redundant, outdated, or bad-practice skills under the category \`Non-Elemental\`.
4. **Fallback:** If a useful skill does not match any defined tech stack, place it under \`Non-grouped\`.

**Allowed Categories:**
* Programming Languages
* Backend, Frameworks & Libraries
* Frontend & Web Development
* Databases & Storage
* Tools & Environments
* Cloud, DevOps & Infrastructure
* Version Control & Workflows
* Testing & Quality Assurance
* Architecture & Patterns
* Methodologies & Management
* Non-Elemental
* Non-grouped

**Output Requirements:**
You MUST return **ONLY** a valid JSON array matching the structure below. Do not include any conversational preamble, postscript, or explanations.

[
  {
    "name": "Frontend & Web Development",
    "keywords": [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  }
]`;

const GROQ_WORK_SYSTEM_PROMPT = `You are an expert Technical Recruiter and Resume Editor.

**Task:**
You will receive a JSON array containing professional work experience data for a curriculum vitae. Your task is to refine and polish the text within each work experience entry (specifically 'summary' and 'highlights') to make them professional, clear, and impactful.

**Strict Constraints:**
1. Zero Hallucination: Do NOT modify, add, invent, or extrapolate any factual data, metrics, technologies, or responsibilities. 
2. Preserve Identifiers & Dates: You MUST keep 'name', 'position', 'url', 'startDate', and 'endDate' EXACTLY as given in the input. Do NOT clear them, change dates/company names, or return empty strings.
3. Scope of Edits: You MUST ONLY correct spelling, fix grammatical errors, improve professional phrasing, and ensure proper vocabulary.
4. Output Format: You MUST return ONLY a valid JSON array matching the exact structure and array length as the input, with the populated work experience objects. Do not return empty placeholders or conversational text.`;

const GROQ_CV_JOB_SYSTEM_PROMPT = `You are an expert Technical Recruiter and Resume Alignment Engine.

**Task:**
Analyze the provided user Master JSON Resume against the target Job Application (title, description, requirements).
Output a tailored JSON Resume that selects and highlights the most relevant work experience, skills, projects, and education matching the job requirements.

**Strict Rules:**
1. ZERO HALLUCINATION: You MUST ONLY use data existing in the provided Master JSON Resume. You MUST NEVER invent, extrapolate, or add non-existing skills, projects, company names, dates, or credentials.
2. MATCH SCORE: Calculate a numeric match score (integer from 0 to 100) reflecting how closely the user's master resume matches the job requirements.
3. Output Format: You MUST return ONLY a valid JSON object with the following structure:
{
  "match_score": 85,
  "json_resume": { ... }
}
Do not include any markdown preamble, postscript, or explanation text outside the JSON object.`;

function cleanEmptyProperties(obj: any): any {
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj === 'string') {
    return obj.trim() === '' ? undefined : obj;
  }
  if (Array.isArray(obj)) {
    const cleanedArray = obj.map(cleanEmptyProperties).filter(item => item !== undefined);
    return cleanedArray.length === 0 ? undefined : cleanedArray;
  }
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    let hasKeys = false;
    for (const key of Object.keys(obj)) {
      const cleanedVal = cleanEmptyProperties(obj[key]);
      if (cleanedVal !== undefined) {
        result[key] = cleanedVal;
        hasKeys = true;
      }
    }
    return hasKeys ? result : undefined;
  }
  return obj;
}

export class GroqController {
  private groqClient: any;

  constructor(groqClient?: any) {
    this.groqClient = groqClient;
  }

  /**
   * Filter out standard CSV header labels
   */
  public stripHeaders(skills: string[]): string[] {
    const headers = new Set(['name', 'skill', 'skills', 'header', 'title', 'category']);
    return skills.filter(skill => !headers.has(skill.trim().toLowerCase()));
  }

  /**
   * Send skills to Groq API and parse response into categorized skills
   */
  public async analyzeSkills(skills: string[]): Promise<GroqAnalysisResponse> {
    try {
      if (process.env.NODE_ENV !== 'test') {
        ensureEnvLoaded();
      }
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey && !this.groqClient) {
        return {
          success: false,
          error: 'GROQ_API_KEY environment variable is missing.'
        };
      }

      const filteredSkills = this.stripHeaders(skills);
      if (filteredSkills.length === 0) {
        return {
          success: true,
          data: []
        };
      }

      const client = this.groqClient || new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const userContent = `Skills to analyze and categorize:\n${filteredSkills.join('\n')}`;

      const response = await client.chat.completions.create({
        messages: [
          { role: 'system', content: GROQ_SYSTEM_PROMPT },
          { role: 'user', content: userContent }
        ],
        model: 'qwen/qwen3.8-27b',
        temperature: 0.1
      });

      const responseText = response.choices?.[0]?.message?.content || '';
      const parsedData = this.parseAndValidateResponse(responseText);

      return {
        success: true,
        data: parsedData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during Groq skill analysis'
      };
    }
  }

  /**
   * Send work section entries to Groq API to refine professional phrasing
   */
  public async analyzeWorkSection(workData: Work[]): Promise<GroqWorkAnalysisResponse> {
    try {
      if (process.env.NODE_ENV !== 'test') {
        ensureEnvLoaded();
      }
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey && !this.groqClient) {
        return {
          success: false,
          error: 'GROQ_API_KEY environment variable is missing.'
        };
      }

      if (!workData || workData.length === 0) {
        return {
          success: true,
          data: []
        };
      }

      const client = this.groqClient || new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const userContent = `Work experience data to refine:\n${JSON.stringify(workData, null, 2)}`;

      const response = await client.chat.completions.create({
        messages: [
          { role: 'system', content: GROQ_WORK_SYSTEM_PROMPT },
          { role: 'user', content: userContent }
        ],
        model: 'qwen/qwen3.8-27b',
        temperature: 0.1
      });

      const responseText = response.choices?.[0]?.message?.content || '';
      const parsedData = this.parseAndValidateWorkResponse(responseText, workData);

      return {
        success: true,
        data: parsedData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during Groq work analysis'
      };
    }
  }

  /**
   * Analyze Master JSON Resume against Job Application details to generate a tailored CV & match score
   */
  public async analyzeCvJobDriven(payload: GroqCvJobDrivenRequest): Promise<GroqCvJobDrivenResponse> {
    try {
      if (process.env.NODE_ENV !== 'test') {
        ensureEnvLoaded();
      }
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey && !this.groqClient) {
        return {
          success: false,
          error: 'GROQ_API_KEY environment variable is missing.'
        };
      }

      const client = this.groqClient || new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const userContent = `Master JSON Resume:\n${JSON.stringify(payload.resume, null, 2)}\n\nJob Application Requirements:\nTitle: ${payload.jobApplication.title}\nDescription: ${payload.jobApplication.jobDescription}\nRequirements: ${payload.jobApplication.jobRequirement}\nCompany Description: ${payload.jobApplication.companyDescription || ''}`;

      const response = await client.chat.completions.create({
        messages: [
          { role: 'system', content: GROQ_CV_JOB_SYSTEM_PROMPT },
          { role: 'user', content: userContent }
        ],
        model: 'qwen/qwen3.8-27b',
        temperature: 0.1
      });

      const responseText = response.choices?.[0]?.message?.content || '';
      const parsed = this.extractJsonObject(responseText);

      const matchScore = typeof parsed.match_score === 'number'
        ? Math.max(0, Math.min(100, Math.round(parsed.match_score)))
        : 70;

      const rawJsonResume = parsed.json_resume || payload.resume || {};
      const cleanedJsonResume = cleanEmptyProperties(rawJsonResume) || {};

      return {
        success: true,
        match_score: matchScore,
        json_resume: cleanedJsonResume
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during Groq CV job analysis'
      };
    }
  }

  /**
   * Robustly extracts and parses a JSON object from raw model response text
   */
  private extractJsonObject(responseText: string): any {
    let cleanText = responseText.trim();

    try {
      const parsed = JSON.parse(cleanText);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) return parsed;
    } catch {}

    const fenceMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch) {
      try {
        const parsed = JSON.parse(fenceMatch[1].trim());
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) return parsed;
      } catch {}
      cleanText = fenceMatch[1].trim();
    }

    const firstBrace = cleanText.indexOf('{');
    if (firstBrace !== -1) {
      let lastBrace = cleanText.lastIndexOf('}');
      while (lastBrace > firstBrace) {
        const candidate = cleanText.substring(firstBrace, lastBrace + 1);
        try {
          const parsed = JSON.parse(candidate);
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) return parsed;
        } catch {}
        lastBrace = cleanText.lastIndexOf('}', lastBrace - 1);
      }
    }

    throw new Error('Groq response did not return a valid JSON object');
  }

  /**
   * Robustly extracts and parses a JSON array from raw model response text
   */
  private extractJsonArray(responseText: string): any[] {
    let cleanText = responseText.trim();

    // 1. Try direct JSON parse
    try {
      const parsed = JSON.parse(cleanText);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    // 2. Try extracting from markdown code block ```json ... ``` or ``` ... ```
    const fenceMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch) {
      try {
        const parsed = JSON.parse(fenceMatch[1].trim());
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      cleanText = fenceMatch[1].trim();
    }

    // 3. Find first '[' and search backwards from last ']' for valid JSON array
    const firstBracket = cleanText.indexOf('[');
    if (firstBracket !== -1) {
      let lastBracket = cleanText.lastIndexOf(']');
      while (lastBracket > firstBracket) {
        const candidate = cleanText.substring(firstBracket, lastBracket + 1);
        try {
          const parsed = JSON.parse(candidate);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
        lastBracket = cleanText.lastIndexOf(']', lastBracket - 1);
      }
    }

    throw new Error('Groq response did not return a valid JSON array');
  }

  /**
   * Sanitizes markdown fences and validates JSON array format for Work entries,
   * merging with originalWorkData to prevent data loss if any field is empty or missing.
   */
  private parseAndValidateWorkResponse(responseText: string, originalWorkData: Work[] = []): Work[] {
    const rawArray = this.extractJsonArray(responseText);

    return rawArray.map((item: any, index: number) => {
      const orig = originalWorkData[index] || {};
      return {
        name: typeof item.name === 'string' && item.name.trim() !== '' ? item.name : (orig.name || ''),
        position: typeof item.position === 'string' && item.position.trim() !== '' ? item.position : (orig.position || ''),
        url: typeof item.url === 'string' && item.url.trim() !== '' ? item.url : orig.url,
        startDate: typeof item.startDate === 'string' && item.startDate.trim() !== '' ? item.startDate : (orig.startDate || ''),
        endDate: typeof item.endDate === 'string' && item.endDate.trim() !== '' ? item.endDate : (orig.endDate || ''),
        summary: typeof item.summary === 'string' && item.summary.trim() !== '' ? item.summary : orig.summary,
        highlights: Array.isArray(item.highlights) && item.highlights.length > 0
          ? item.highlights.map(String)
          : (orig.highlights || [])
      };
    });
  }

  /**
   * Sanitizes markdown fences and validates JSON array format
   */
  private parseAndValidateResponse(responseText: string): Skill[] {
    const rawArray = this.extractJsonArray(responseText);

    return rawArray.map((item: any) => ({
      name: typeof item.name === 'string' ? item.name : 'Non-grouped',
      keywords: Array.isArray(item.keywords) ? item.keywords.map(String) : []
    }));
  }

  /**
   * Evaluates a project repository using Groq AI across 7 criteria and returns structured JSON logs and total score.
   */
  public async scoreProject(payload: GroqProjectScorePayload): Promise<GroqProjectScoreResponse> {
    ensureEnvLoaded();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: 'GROQ_API_KEY is not configured in environment or .env file.'
      };
    }

    try {
      const client = new Groq({ apiKey });

      const promptUserContent = `Evaluate project repository:
Repository Name: ${payload.name}
Description: ${payload.description || 'None'}
Primary Language: ${payload.language || 'Unknown'}
URL: ${payload.html_url}
README Excerpt: ${payload.readmeContent ? payload.readmeContent.substring(0, 1500) : 'None'}
Commit Logs: ${payload.commitLogs && payload.commitLogs.length > 0 ? payload.commitLogs.slice(0, 10).join('; ') : 'None'}
File Tree: ${payload.fileTree && payload.fileTree.length > 0 ? payload.fileTree.slice(0, 30).join(', ') : 'None'}
`;

      const response = await client.chat.completions.create({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'system',
            content: `You are an expert Principal Code Auditor and Technical Evaluator.
Evaluate the provided repository payload against 7 core criteria:
1. readme_structure: README.md file structure
2. real_demo: Presence of a real demo (URLs, live links, preview badges)
3. commit_history: Clean commit log history
4. codebase_structure: Codebase structure and pattern consistency
5. language_best_practices: Programming language best practices and naming conventions
6. no_debug_artifacts: Absence of console.log() or debug artifacts
7. test_coverage: Presence of unit or integration tests

Respond strictly with a JSON object in this exact schema:
{
  "totalScore": <number 1 to 100>,
  "logs": [
    {
      "category": "readme_structure",
      "title": "README.md Structure",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements": ["<bullet point improvement suggestion>", ...]
    },
    {
      "category": "real_demo",
      "title": "Real Demo",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements": ["<bullet point improvement suggestion>", ...]
    },
    {
      "category": "commit_history",
      "title": "Clean Commit Log",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements": ["<bullet point improvement suggestion>", ...]
    },
    {
      "category": "codebase_structure",
      "title": "Codebase Structure",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements": ["<bullet point improvement suggestion>", ...]
    },
    {
      "category": "language_best_practices",
      "title": "Best Practices & Naming",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements": ["<bullet point improvement suggestion>", ...]
    },
    {
      "category": "no_debug_artifacts",
      "title": "Absence of Debug Artifacts",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements": ["<bullet point improvement suggestion>", ...]
    },
    {
      "category": "test_coverage",
      "title": "Testing Quality",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements": ["<bullet point improvement suggestion>", ...]
    }
  ]
}`
          },
          {
            role: 'user',
            content: promptUserContent
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'Empty response from Groq API' };
      }

      const parsed = JSON.parse(content);
      const totalScore = Math.max(1, Math.min(100, Math.round(Number(parsed.totalScore) || 50)));

      const rawLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
      const logs = rawLogs.map((item: any) => ({
        category: String(item.category || 'general'),
        title: String(item.title || item.category || 'Evaluation'),
        score: Math.max(1, Math.min(100, Math.round(Number(item.score) || 50))),
        log: String(item.log || ''),
        improvements: Array.isArray(item.improvements) ? item.improvements.map(String) : []
      }));

      return {
        success: true,
        data: {
          repoId: payload.id,
          repoName: payload.name,
          totalScore,
          evaluatedAt: new Date().toISOString(),
          logs
        }
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error evaluating project score with Groq API'
      };
    }
  }
}
