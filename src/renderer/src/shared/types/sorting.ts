import { z } from 'zod';
import { GitHubRepository } from '../../features/projects/types/projects';

/**
 * Interface representing any date-bearing resume or portfolio entry.
 */
export interface ChronologicalItem {
  startDate?: string | null;
  endDate?: string | null;
  date?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

/**
 * Options configuring chronological comparison and sorting.
 */
export interface SortOptions {
  treatEmptyEndDateAsCurrent?: boolean;
  fallbackToStartDate?: boolean;
}

/**
 * Options for matching GitHub repositories against technical keywords.
 */
export interface KeywordMatchOptions {
  keywords: string[];
  repositories: GitHubRepository[];
  caseSensitive?: boolean;
  includeTopics?: boolean;
}

/**
 * Evaluation result of matching a repository against target keywords.
 */
export interface ProjectMatchResult {
  repository: GitHubRepository;
  isMatched: boolean;
  matchedKeywords: string[];
  score?: number;
}

/**
 * Zod Schemas for data validation per project constitution.
 */
export const ChronologicalItemSchema = z.object({
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional()
}).passthrough();

export const SortOptionsSchema = z.object({
  treatEmptyEndDateAsCurrent: z.boolean().optional().default(true),
  fallbackToStartDate: z.boolean().optional().default(true)
});

export const KeywordMatchOptionsSchema = z.object({
  keywords: z.array(z.string().min(1)),
  caseSensitive: z.boolean().optional().default(false),
  includeTopics: z.boolean().optional().default(true)
});

export const ProjectMatchResultSchema = z.object({
  isMatched: z.boolean(),
  matchedKeywords: z.array(z.string()),
  score: z.number().optional()
});
