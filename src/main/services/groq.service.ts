import { Groq } from 'groq-sdk';
import { jsonrepair } from 'jsonrepair';
import { z } from 'zod';
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
 * Handles markdown block wrappers, trailing commentary outside JSON boundaries, and syntax errors.
 * @param rawContent - String content returned by Groq LLM.
 * @returns Parsed JavaScript object.
 */
function parseGroqJsonResponse<T>(rawContent: string): T {
  let cleaned = rawContent.trim();

  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

  // Isolate outermost JSON structure ({ ... } or [ ... ]) to strip trailing/leading text
  const firstBrace = cleaned.search(/[\{\[]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (initialError) {
    try {
      const repaired = jsonrepair(cleaned);
      return JSON.parse(repaired) as T;
    } catch (repairError) {
      console.warn('jsonrepair failed on isolated JSON string, trying regex match fallback...', repairError);
      const objectMatch = rawContent.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          const repairedMatch = jsonrepair(objectMatch[0]);
          return JSON.parse(repairedMatch) as T;
        } catch (matchError) {
          console.error('Failed to parse regex matched JSON object:', matchError);
        }
      }
      throw initialError;
    }
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
        max_completion_tokens: 1500,
        response_format: { type: 'json_object' }
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
        max_completion_tokens: 2048,
        response_format: { type: 'json_object' }
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

export interface StepOptimizationPayload {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  targetLanguage: string;
  currentResume: unknown;
  userFeedback?: string;
}

export interface StepOptimizationResult {
  step: number;
  proposal: unknown;
  reasoning: string;
}

export const OPTIMIZER_SYSTEM_PROMPT = `Role: Technical Resume Editor & ATS Specialist.
Goal: Rewrite software engineering resume text for ATS compliance without inventing ANY new information.

CRITICAL RULE (ZERO INVENTED DATA):
- NEVER invent metrics, percentages, team sizes, dollar amounts, tools, or responsibilities.
- IF A METRIC IS MISSING: Use a exact placeholder like [X%] or [Y metric]. DO NOT fabricate numbers like "50%" or "25%".
- Work ONLY with facts directly stated in the input text.

PROJECT SELECTION RULE:
- AI Agents must select projects by analyzing the score and the languages/technologies.
- Use the data of selected projects verbatim without changing or altering it.
- Use project's readme.md to create a short description (1 sentence) and create 3 bullet points.

RECOMMENDED PROJECT STRUCTURE FORMAT
When optimizing projects, follow this explicit blueprint:

**[Project Name]** | *[Technologies Used]* | [Link/GitHub]  
> *[1-sentence overview explaining core application purpose]*  
* **[Action Verb]** [Technical contribution using specified stack].  
* **[Action Verb]** [Optimization or problem solved] resulting in **[X%]** performance improvement.

TASKS:
1. ATS Standardization: Translate to English if needed. Standardize technical terms and headers.
2. Structure & Clarity: Use action verbs (Engineered, Architected, Refactored) and clear technical descriptions.
3. Formatting: Output plain text/Markdown bullets.

OUTPUT RULES:
- Provide the optimized text.
- If placeholders like [X%] were inserted, explicitly list them under a section called "Action Items for Candidate".`;

const stepLangSchema = z.object({
  selectedLanguage: z.string(),
  reasoning: z.string().optional().default('')
});

const stepTitleSchema = z.object({
  proposedTitle: z.string(),
  reasoning: z.string().optional().default('')
});

const stepSummarySchema = z.object({
  proposedSummary: z.string(),
  reasoning: z.string().optional().default('')
});

const stepExperienceSchema = z.object({
  proposedExperience: z.array(z.object({
    id: z.string(),
    jobTitle: z.string(),
    companyName: z.string(),
    startMonth: z.string(),
    startYear: z.string(),
    endMonth: z.string().optional(),
    endYear: z.string().optional(),
    isCurrentRole: z.boolean(),
    context: z.string(),
    highlights: z.array(z.string())
  })),
  reasoning: z.string().optional().default('')
});

const stepEducationSchema = z.object({
  proposedEducation: z.array(z.object({
    id: z.string(),
    degreeName: z.string(),
    institutionName: z.string(),
    graduationYear: z.string(),
    currentStudy: z.boolean().optional()
  })),
  proposedCertifications: z.array(z.object({
    id: z.string(),
    certificationName: z.string(),
    issuingOrganization: z.string(),
    grantedYear: z.string(),
    currentStudy: z.boolean().optional()
  })),
  reasoning: z.string().optional().default('')
});

const stepSkillsSchema = z.object({
  proposedSkills: z.array(z.object({
    category: z.string(),
    skills: z.array(z.string())
  })),
  reasoning: z.string().optional().default('')
});

const stepProjectsSchema = z.object({
  proposedProjects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    score: z.number().optional()
  })).min(1),
  reasoning: z.string().optional().default('')
});

/**
 * Builds step-specific prompt instruction for Groq completion.
 *
 * @param step - Current optimization step (1 to 7).
 * @param targetLanguage - Target output language selected by the candidate.
 * @param feedback - Optional user feedback instruction.
 * @returns Formatted prompt string.
 */
function buildStepPrompt(step: number, targetLanguage: string, feedback?: string): string {
  const feedbackClause = feedback ? `\nUser Feedback / Re-proposal Instruction: "${feedback}"` : '';
  const langClause = `\nCRITICAL: Generate all proposed text in target language: "${targetLanguage}".`;

  switch (step) {
    case 1:
      return `Step 1: Language selection acknowledged as ${targetLanguage}.`;
    case 2:
      return `Step 2: Optimize Professional Title for ATS compliance and recruiter impact.${langClause}${feedbackClause}\nReturn valid JSON object: { "proposedTitle": string, "reasoning": string }`;
    case 3:
      return `Step 3: Rewrite Professional Summary applying ATS standards and Google's XYZ formula where applicable.${langClause}${feedbackClause}\nReturn valid JSON object: { "proposedSummary": string, "reasoning": string }`;
    case 4:
      return `Step 4: Filter & rewrite Work Experience. Rephrase highlight bullets using Google's XYZ formula (Accomplished [X], measured by [Y], by doing [Z]) with strong technical verbs.${langClause}${feedbackClause}\nReturn valid JSON object: { "proposedExperience": [...WorkExperienceItem], "reasoning": string }`;
    case 5:
      return `Step 5: Select supporting Education & Certifications aligned with the professional title/summary.${langClause}${feedbackClause}\nReturn valid JSON object: { "proposedEducation": [...EducationItem], "proposedCertifications": [...CertificationItem], "reasoning": string }`;
    case 6:
      return `Step 6: Categorize and optimize Hard Skills and Soft Skills into clean categories.${langClause}${feedbackClause}\nReturn valid JSON object: { "proposedSkills": [...SkillCategory], "reasoning": string }`;
    case 7:
      return `Step 7: Select relevant Technical Projects by analyzing the project score and matching languages/technologies. DO NOT change or alter any project text, description, metrics, or details; use the data verbatim.${langClause}${feedbackClause}\nReturn valid JSON object: { "proposedProjects": [...ProjectItem], "reasoning": string }`;
    default:
      throw new Error(`Invalid optimization step: ${step}`);
  }
}

/**
 * Helper to validate parsed step proposal using corresponding Zod schemas.
 *
 * @param step - Optimization step number (1 to 7).
 * @param rawParsed - Raw JSON object parsed from LLM response.
 * @param targetLanguage - Target language used for fallback responses.
 * @returns Object containing validated proposal object and reasoning string.
 */
function validateStepResponse(
  step: number,
  rawParsed: Record<string, unknown>,
  targetLanguage: string
): { proposal: unknown; reasoning: string } {
  const defaultReasoning = 'AI optimization completed according to ATS guidelines.';
  const rawReasoning = rawParsed.reasoning;
  const reasoningText = typeof rawReasoning === 'string' ? rawReasoning : defaultReasoning;

  switch (step) {
    case 1: {
      const val = stepLangSchema.parse({ selectedLanguage: targetLanguage, ...rawParsed });
      return { proposal: { selectedLanguage: val.selectedLanguage }, reasoning: val.reasoning || `Target output language set to ${targetLanguage}.` };
    }
    case 2: {
      const val = stepTitleSchema.parse(rawParsed);
      return { proposal: { proposedTitle: val.proposedTitle }, reasoning: val.reasoning || reasoningText };
    }
    case 3: {
      const val = stepSummarySchema.parse(rawParsed);
      return { proposal: { proposedSummary: val.proposedSummary }, reasoning: val.reasoning || reasoningText };
    }
    case 4: {
      const val = stepExperienceSchema.parse(rawParsed);
      return { proposal: { proposedExperience: val.proposedExperience }, reasoning: val.reasoning || reasoningText };
    }
    case 5: {
      const val = stepEducationSchema.parse(rawParsed);
      return {
        proposal: { proposedEducation: val.proposedEducation, proposedCertifications: val.proposedCertifications },
        reasoning: val.reasoning || reasoningText
      };
    }
    case 6: {
      const val = stepSkillsSchema.parse(rawParsed);
      return { proposal: { proposedSkills: val.proposedSkills }, reasoning: val.reasoning || reasoningText };
    }
    case 7: {
      const val = stepProjectsSchema.parse(rawParsed);
      return { proposal: { proposedProjects: val.proposedProjects }, reasoning: val.reasoning || reasoningText };
    }
    default:
      throw new Error(`Unsupported step number: ${step}`);
  }
}

/**
 * Executes a step-by-step AI optimization request using Groq SDK with model fallback.
 *
 * @param payload - Step payload containing step index (1-7), target language, active resume context, and optional user feedback.
 * @param onStatusUpdate - Optional callback to report status or model fallback updates.
 * @returns Promise resolving to step optimization result.
 */
export async function optimizeResumeStepWithGroq(
  payload: StepOptimizationPayload,
  onStatusUpdate?: (statusText: string) => void
): Promise<StepOptimizationResult> {
  if (payload.step === 1) {
    return {
      step: 1,
      proposal: { selectedLanguage: payload.targetLanguage },
      reasoning: `Output language selected: ${payload.targetLanguage.toUpperCase()}`
    };
  }

  const groq = getGroqClient();
  const stepPrompt = buildStepPrompt(payload.step, payload.targetLanguage, payload.userFeedback);

  const messages = [
    { role: 'system' as const, content: OPTIMIZER_SYSTEM_PROMPT },
    { role: 'user' as const, content: `Active Resume Data:\n${JSON.stringify(payload.currentResume)}\n\n${stepPrompt}` }
  ];

  const rawParsed = await callGroqWithModelFallback<Record<string, unknown>>(
    async (targetModel) => {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: targetModel,
        temperature: 0.2,
        max_completion_tokens: 2048,
        response_format: { type: 'json_object' }
      });

      const content = chatCompletion.choices[0]?.message?.content || '';
      if (!content) {
        throw new Error(`Groq returned empty response for optimization step ${payload.step}`);
      }

      return parseGroqJsonResponse<Record<string, unknown>>(content);
    },
    onStatusUpdate
  );

  const { proposal, reasoning } = validateStepResponse(payload.step, rawParsed, payload.targetLanguage);

  return {
    step: payload.step,
    proposal,
    reasoning
  };
}


