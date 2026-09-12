import { z } from 'zod';

export const ApplicationCvSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  targetVacancyTitle: z.string().min(1, 'Target vacancy title is required').max(120),
  jobDescriptionSnippet: z.string().min(1, 'Job description snippet is required'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ApplicationCv = z.infer<typeof ApplicationCvSchema>;
