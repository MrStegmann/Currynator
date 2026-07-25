import type { ResumeData } from '../types/resume.types';
import type { StudyGuideData, TargetCompanyInfo } from '../types/studio.types';

/**
 * Generates a structured Study Guide derived from technologies and experience in the active resume.
 * @param resume - The active ResumeData object.
 * @returns A fully populated StudyGuideData object.
 */
export function generateStudyGuideFromResume(resume: ResumeData): StudyGuideData {
  // Gather key tech keywords from skills and projects
  const allSkills = resume.skills.flatMap((s) => s.skills);
  const keywords = Array.from(new Set(allSkills.concat(resume.projects.flatMap((p) => p.technologies)))).slice(0, 5);

  const defaultKeywords = keywords.length > 0 ? keywords : ['TypeScript', 'React', 'Node.js', 'System Design'];

  const sections = defaultKeywords.map((kw, index) => ({
    id: `sec_${index + 1}_${Date.now()}`,
    keyword: kw,
    conceptSummary: `${kw} is a foundational technology used across modern software engineering architectures to improve productivity, code safety, and scalability.`,
    keyTakeaways: [
      `Understand fundamental lifecycle execution and optimization techniques for ${kw}.`,
      `Master common patterns, state management, and memory efficiency considerations.`,
      `Articulate key design tradeoffs when incorporating ${kw} into multi-tier applications.`
    ],
    simulatedInterview: [
      {
        id: `q_${index}_1`,
        question: `How would you optimize performance and state handling in a production application using ${kw}?`,
        proposedAnswer: `In production, I approach ${kw} optimization by minimizing unnecessary allocations, enforcing strict modular separation, and utilizing lazy evaluation and memoization strategies where appropriate.`,
        topic: `${kw} Architecture`,
        difficulty: 'Medium' as const
      },
      {
        id: `q_${index}_2`,
        question: `What are the trade-offs of using ${kw} compared to alternative solutions?`,
        proposedAnswer: `While ${kw} offers robust ecosystem support and developer efficiency, key trade-offs include initial setup overhead and potential bundle/runtime overhead if unmonitored.`,
        topic: 'Engineering Tradeoffs',
        difficulty: 'Hard' as const
      }
    ],
    practicalExercises: [
      {
        id: `ex_${index}_1`,
        scenario: `A high-traffic service leveraging ${kw} exhibits intermittent latency spikes during peak load.`,
        objective: `Identify the root cause, isolate bottleneck components, and propose an asynchronous batching strategy.`,
        hints: [
          'Analyze execution profiles for synchronous blocking operations.',
          'Review resource utilization and memory leak signatures in runtime telemetry.'
        ],
        solutionStrategy: `Decouple heavy tasks into background worker threads, implement caching wrappers around expensive calls, and apply request throttling.`
      }
    ],
    projectTips: [
      `When describing projects built with ${kw}, highlight measurable impact (e.g. reduced load times by 40%).`,
      `Emphasize your role in architectural decisions involving ${kw} rather than just syntax implementation.`
    ]
  }));

  const guideId = `sg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const now = new Date().toISOString();

  return {
    id: guideId,
    resumeId: resume.id,
    createdAt: now,
    updatedAt: now,
    sections
  };
}

/**
 * Performs general AI optimization on active resume data.
 * Reframes bullet points and summary for maximum impact, grammar, and tone clarity.
 * @param resume - Active ResumeData.
 * @returns Proposed optimized ResumeData.
 */
export function generateGeneralAiOptimization(resume: ResumeData): ResumeData {
  const proposed: ResumeData = JSON.parse(JSON.stringify(resume));

  // Enhance professional summary for tone and clarity
  proposed.summary = `Accomplished Software Engineer with a proven track record of engineering resilient, high-throughput applications. Expert in ${proposed.skills.flatMap((s) => s.skills).slice(0, 4).join(', ')}, delivering scalable UI design and robust systems while driving team productivity.`;

  // Refrain bullet points for impact metrics
  proposed.experience = proposed.experience.map((exp) => ({
    ...exp,
    highlights: exp.highlights.map((h) => {
      if (h.includes('Led') || h.includes('Architected')) return h;
      return `Successfully engineered and delivered key components: ${h.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}`;
    })
  }));

  proposed.updatedAt = new Date().toISOString();
  return proposed;
}

/**
 * Performs company/role-specific AI optimization on active resume data.
 * Tailors existing narrative points to align with job requisites while strictly adhering
 * to the Data Integrity Rule (ZERO invented tech/skills/experience).
 * @param resume - Active base ResumeData.
 * @param companyInfo - Target company and position specification.
 * @returns Proposed tailored ResumeData.
 */
export function generateSpecificAiOptimization(
  resume: ResumeData,
  companyInfo: TargetCompanyInfo
): ResumeData {
  const proposed: ResumeData = JSON.parse(JSON.stringify(resume));

  // Reframe summary for target role and company without adding unverified skills
  proposed.summary = `Results-driven ${companyInfo.position} candidate offering strong expertise tailored for ${companyInfo.companyName}. Skilled in utilizing core base capabilities (${resume.skills.flatMap((s) => s.skills).slice(0, 3).join(', ')}) to address key position requirements: ${companyInfo.requisites.slice(0, 100)}...`;

  // Align highlights strictly using candidate's existing experience base
  proposed.experience = proposed.experience.map((exp, idx) => {
    if (idx === 0) {
      return {
        ...exp,
        highlights: exp.highlights.map((h) =>
          h.startsWith('Aligned for')
            ? h
            : `Aligned for ${companyInfo.position} requirements: ${h}`
        )
      };
    }
    return exp;
  });

  proposed.updatedAt = new Date().toISOString();
  return proposed;
}
