import { z } from 'zod';

/**
 * Zod validation schema for the automated PDF export payload sent to Main process IPC.
 */
export const ExportResumePdfAutoSchema = z.object({
  html: z.string().min(1, 'HTML string cannot be empty'),
  resumeTitle: z.string().min(1, 'Resume title is required')
});

/**
 * Zod validation schema for the automated PDF export IPC response.
 */
export const ExportResumePdfResponseSchema = z.object({
  success: z.boolean(),
  filePath: z.string().optional(),
  error: z.string().optional()
});

/**
 * TypeScript type inferred from ExportResumePdfAutoSchema payload.
 */
export type ExportResumePdfAutoInput = z.infer<typeof ExportResumePdfAutoSchema>;

/**
 * TypeScript type inferred from ExportResumePdfResponseSchema response.
 */
export type ExportResumePdfResponse = z.infer<typeof ExportResumePdfResponseSchema>;

/**
 * Configuration options for A4 paper pagination calculation.
 */
export interface PaginationOptions {
  /** Page height in pixels at 96 DPI (default 1123px for 297mm A4) */
  pageHeightPx: number;
  /** Vertical top/bottom padding in pixels (default ~90px for 24mm combined margins) */
  paddingPx: number;
}

/**
 * Height measurements for individual sections of a resume column.
 */
export interface SectionHeightInfo {
  id: string;
  height: number;
}

/**
 * Structured content assigned to a specific A4 page.
 */
export interface PaginatedPage<T> {
  pageNumber: number;
  items: T[];
}
