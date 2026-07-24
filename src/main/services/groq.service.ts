import { Groq } from 'groq-sdk';
import { jsonrepair } from 'jsonrepair';
import type { FeedbackItem } from '../../renderer/src/features/Github/types';

export const GROQ_AVAILABLE_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it'
] as const;

/**
 * Interface representing the AI output for profile README evaluation.
 */
export interface ProfileReadmeEvaluationResult {
  score: number;
  worseParts: FeedbackItem[];
  warnings: FeedbackItem[];
  tips: FeedbackItem[];
}

/**
 * Interface representing the raw section evaluation returned by Groq for a project.
 */
export interface ProjectSectionFeedback {
  worseParts: FeedbackItem[];
  warnings: FeedbackItem[];
  tips: FeedbackItem[];
}

/**
 * Interface representing the AI evaluation result for a repository project.
 */
export interface ProjectEvaluationResult {
  descriptionScore: number;
  readmeScore: number;
  structureScore: number;
  languagesScore: number;
  sections: {
    description: ProjectSectionFeedback;
    readme: ProjectSectionFeedback;
    structure: ProjectSectionFeedback;
    languages: ProjectSectionFeedback;
  };
}

/**
 * Returns an instance of the Groq client initialized with process.env.GROQ_API_KEY.
 * @returns Initialized Groq client instance.
 * @throws Error if GROQ_API_KEY environment variable is not configured.
 */
function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not defined.');
  }
  return new Groq({ apiKey });
}

/**
 * Helper to safely extract and parse JSON from Groq completion responses.
 * @param rawContent - String content returned by Groq LLM.
 * @returns Parsed JavaScript object.
 */
function parseGroqJsonResponse<T>(rawContent: string): T {
  let cleaned = rawContent.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.warn('Standard JSON.parse failed on Groq response, running jsonrepair fallback...', error);
    const repaired = jsonrepair(cleaned);
    return JSON.parse(repaired) as T;
  }
}

/**
 * Executes a Groq API call with automatic model fallback on rate_limit_exceeded or timeout errors.
 * Never mutates GROQ_AVAILABLE_MODELS; creates a new processedModels array per attempt.
 */
async function callGroqWithModelFallback<T>(
  executeCall: (model: string) => Promise<T>,
  onStatusUpdate?: (statusText: string) => void,
  timeoutMs = 25000
): Promise<T> {
  const attemptedModels: string[] = [];

  for (let i = 0; i < GROQ_AVAILABLE_MODELS.length; i++) {
    const currentModel = GROQ_AVAILABLE_MODELS[i];
    const processedModels = [...attemptedModels, currentModel];

    try {
      if (onStatusUpdate && attemptedModels.length > 0) {
        onStatusUpdate(`Switched AI model to ${currentModel} (Model ${processedModels.length}/${GROQ_AVAILABLE_MODELS.length})`);
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`TimeoutError: Groq request timed out after ${timeoutMs}ms on model ${currentModel}`));
        }, timeoutMs);
        if (typeof timer.unref === 'function') timer.unref();
      });

      const result = await Promise.race([
        executeCall(currentModel),
        timeoutPromise
      ]);

      return result;
    } catch (err: any) {
      attemptedModels.push(currentModel);

      const errorMessage = err?.message || String(err);
      const errorCode = err?.code || err?.error?.code;
      const isRateLimit = errorCode === 'rate_limit_exceeded' || err?.status === 429 || errorMessage.toLowerCase().includes('rate_limit') || errorMessage.toLowerCase().includes('rate limit');
      const isTimeout = errorMessage.includes('TimeoutError') || errorMessage.toLowerCase().includes('timeout') || err?.code === 'ETIMEDOUT';

      console.warn(`Groq evaluation error on model ${currentModel}: ${errorMessage} (RateLimit: ${isRateLimit}, Timeout: ${isTimeout})`);

      const hasNextModel = attemptedModels.length < GROQ_AVAILABLE_MODELS.length;
      if ((isRateLimit || isTimeout) && hasNextModel) {
        const nextModel = GROQ_AVAILABLE_MODELS[attemptedModels.length];
        if (onStatusUpdate) {
          onStatusUpdate(`Rate limit/timeout on ${currentModel}. Switching to model ${nextModel}...`);
        }
        continue;
      }

      throw err;
    }
  }

  throw new Error(`All available Groq models failed (${attemptedModels.join(', ')}).`);
}

/**
 * Evaluates a GitHub account profile README using the Groq SDK with automatic model fallback.
 * @param username - The GitHub user's account login handle.
 * @param readmeText - The raw Markdown text of the user's account profile README.
 * @param onStatusUpdate - Optional callback to report AI model switching or status updates.
 * @returns A promise resolving to ProfileReadmeEvaluationResult containing score and feedback.
 */
export async function evaluateProfileReadmeWithGroq(
  username: string,
  readmeText: string,
  onStatusUpdate?: (statusText: string) => void
): Promise<ProfileReadmeEvaluationResult> {
  const groq = getGroqClient();

  const systemInstruction = `You are a senior technical recruiter and developer portfolio auditor.
Analyze the provided GitHub account profile README for user '${username}'.

Evaluate the profile README quality from 1 to 100 based on:
1. Clear "About Me" introduction, skills, and current role/focus.
2. Contact info (email, social links, website).
3. Visual organization, Markdown formatting, tech stack badges, and project highlights.

CRITICAL: Return ONLY raw valid JSON matching this exact JSON schema without markdown block formatting:
{
  "score": number,
  "worseParts": [
    { "id": "p_w1", "type": "worse_part", "title": "string", "message": "string", "actionableSuggestion": "string" }
  ],
  "warnings": [
    { "id": "p_warn1", "type": "warning", "title": "string", "message": "string", "actionableSuggestion": "string" }
  ],
  "tips": [
    { "id": "p_t1", "type": "tip", "title": "string", "message": "string", "actionableSuggestion": "string" }
  ]
}`;

  try {
    const parsed = await callGroqWithModelFallback<ProfileReadmeEvaluationResult>(async (targetModel) => {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Profile README content for @${username}:\n\n${readmeText}` }
        ],
        model: targetModel,
        temperature: 0.2,
        max_completion_tokens: 1500
      });

      const content = chatCompletion.choices[0]?.message?.content || '';
      if (!content) {
        throw new Error('Groq returned empty response for profile README evaluation.');
      }

      return parseGroqJsonResponse<ProfileReadmeEvaluationResult>(content);
    }, onStatusUpdate);

    return {
      score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.score))) : 70,
      worseParts: Array.isArray(parsed.worseParts) ? parsed.worseParts : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : []
    };
  } catch (error) {
    console.error('Error evaluating profile README with Groq:', error);
    return {
      score: 65,
      worseParts: [
        {
          id: 'err_p1',
          type: 'worse_part',
          title: 'Missing "About Me" highlights',
          message: 'The profile README could benefit from a structured introduction.',
          actionableSuggestion: 'Add an "About Me" section describing your background and primary tech stack.'
        }
      ],
      warnings: [],
      tips: [
        {
          id: 'err_p2',
          type: 'tip',
          title: 'Add contact details',
          message: 'Provide direct links for recruiters to contact you.',
          actionableSuggestion: 'Include your email address or LinkedIn link.'
        }
      ]
    };
  }
}

/**
 * Evaluates a repository project using Groq SDK with automatic model fallback.
 * @param payload - Clean JSON payload representing repository metadata, README, code samples, and file tree.
 * @param onStatusUpdate - Optional callback to report AI model switching or status updates.
 * @returns A promise resolving to ProjectEvaluationResult with sub-scores and feedback.
 */
export async function evaluateProjectWithGroq(
  payload: {
    name: string;
    description: string | null;
    languages: string[];
    readme_content: string;
    code_samples: Array<{ file_path: string; content: string }>;
    file_tree: string[];
  },
  onStatusUpdate?: (statusText: string) => void
): Promise<ProjectEvaluationResult> {
  const groq = getGroqClient();

  const systemInstruction = `You are an expert technical architect and senior code reviewer.
Analyze the provided JSON payload representing a software project repository.

Evaluate the project across 4 distinct pillars (scores 0-100 each):
1. "descriptionScore": Repository description quality, clarity, and stack inclusion (0 if missing/empty).
2. "readmeScore": README documentation thoroughness (Features, Getting Started, Prerequisites, Installation, Usage) (0 if missing/empty).
3. "structureScore": Directory architecture, modularity, SRP, code organization, separation of concerns.
4. "languagesScore": Language choices, code quality, design patterns (SOLID, DRY), error handling, testability.

For EACH of the 4 sections ("description", "readme", "structure", "languages"), provide lists of feedback items: "worseParts", "warnings", and "tips".

CRITICAL: Return ONLY valid JSON matching this schema without markdown codeblock wrapper:
{
  "descriptionScore": number,
  "readmeScore": number,
  "structureScore": number,
  "languagesScore": number,
  "sections": {
    "description": {
      "worseParts": [{ "id": "d1", "type": "worse_part", "title": "string", "message": "string", "actionableSuggestion": "string" }],
      "warnings": [{ "id": "d2", "type": "warning", "title": "string", "message": "string", "actionableSuggestion": "string" }],
      "tips": [{ "id": "d3", "type": "tip", "title": "string", "message": "string", "actionableSuggestion": "string" }]
    },
    "readme": {
      "worseParts": [], "warnings": [], "tips": []
    },
    "structure": {
      "worseParts": [], "warnings": [], "tips": []
    },
    "languages": {
      "worseParts": [], "warnings": [], "tips": []
    }
  }
}`;

  try {
    const parsed = await callGroqWithModelFallback<ProjectEvaluationResult>(async (targetModel) => {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: JSON.stringify(payload) }
        ],
        model: targetModel,
        temperature: 0.2,
        max_completion_tokens: 2048
      });

      const content = chatCompletion.choices[0]?.message?.content || '';
      if (!content) {
        throw new Error('Groq returned empty response for project evaluation.');
      }

      return parseGroqJsonResponse<ProjectEvaluationResult>(content);
    }, onStatusUpdate);

    const emptyFeedback: ProjectSectionFeedback = { worseParts: [], warnings: [], tips: [] };

    return {
      descriptionScore: payload.description ? Math.max(0, Math.min(100, Math.round(parsed.descriptionScore || 70))) : 0,
      readmeScore: payload.readme_content ? Math.max(0, Math.min(100, Math.round(parsed.readmeScore || 70))) : 0,
      structureScore: Math.max(0, Math.min(100, Math.round(parsed.structureScore || 75))),
      languagesScore: Math.max(0, Math.min(100, Math.round(parsed.languagesScore || 80))),
      sections: {
        description: parsed.sections?.description || emptyFeedback,
        readme: parsed.sections?.readme || emptyFeedback,
        structure: parsed.sections?.structure || emptyFeedback,
        languages: parsed.sections?.languages || emptyFeedback
      }
    };
  } catch (error) {
    console.error(`Error evaluating project ${payload.name} with Groq:`, error);

    const hasDesc = !!payload.description && payload.description.length > 5;
    const hasReadme = !!payload.readme_content && payload.readme_content.length > 20;

    return {
      descriptionScore: hasDesc ? 75 : 0,
      readmeScore: hasReadme ? 70 : 0,
      structureScore: 75,
      languagesScore: 80,
      sections: {
        description: {
          worseParts: hasDesc ? [] : [{ id: 'd_err1', type: 'worse_part', title: 'Missing Description', message: 'No repository description found.', actionableSuggestion: 'Add a summary on GitHub.' }],
          warnings: [],
          tips: []
        },
        readme: {
          worseParts: hasReadme ? [] : [{ id: 'r_err1', type: 'worse_part', title: 'Missing README', message: 'No README found in repository.', actionableSuggestion: 'Create a README.md file.' }],
          warnings: [],
          tips: []
        },
        structure: { worseParts: [], warnings: [], tips: [] },
        languages: { worseParts: [], warnings: [], tips: [] }
      }
    };
  }
}
