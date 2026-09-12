import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { Skill } from '../shared/schema/resumeSchema.js';

export interface GroqAnalysisResponse {
  success: boolean;
  data?: Skill[];
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
   * Sanitizes markdown fences and validates JSON array format
   */
  private parseAndValidateResponse(responseText: string): Skill[] {
    let cleanText = responseText.trim();

    // Extract JSON array between [ and ] if markdown code blocks or conversational wrappers exist
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    const rawArray = JSON.parse(cleanText);

    if (!Array.isArray(rawArray)) {
      throw new Error('Groq response did not return a valid array');
    }

    return rawArray.map((item: any) => ({
      name: typeof item.name === 'string' ? item.name : 'Non-grouped',
      keywords: Array.isArray(item.keywords) ? item.keywords.map(String) : []
    }));
  }
}
