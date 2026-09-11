import { z } from 'zod';

export const BasicsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().optional().default(''),
  image: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  phone: z.string().optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal('')),
  summary: z.string().optional(),
  location: z.object({
    address: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    countryCode: z.string().optional(),
    region: z.string().optional()
  }).optional(),
  profiles: z.array(z.object({
    network: z.string().optional(),
    username: z.string().optional(),
    url: z.string().url().optional().or(z.literal(''))
  })).optional()
});

export const WorkSchema = z.object({
  name: z.string().optional().default(''),
  position: z.string().optional().default(''),
  url: z.string().url("Invalid URL").optional().or(z.literal('')),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional()
});

export const EducationSchema = z.object({
  institution: z.string().optional().default(''),
  area: z.string().optional().default(''),
  studyType: z.string().optional(),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default('')
});

export const CertificateSchema = z.object({
  name: z.string().optional().default(''),
  date: z.string().optional().default(''),
  issuer: z.string().optional().default(''),
  url: z.string().url("Invalid URL").optional().or(z.literal(''))
});

export const SkillSchema = z.object({
  name: z.string().optional().default(''),
  keywords: z.array(z.string()).optional().default([])
});

export const LanguageSchema = z.object({
  language: z.string().optional().default(''),
  fluency: z.string().optional()
});

export const ReferenceSchema = z.object({
  name: z.string().optional().default(''),
  reference: z.string().optional().default('')
});

export const ResumeSchema = z.object({
  basics: BasicsSchema,
  work: z.array(WorkSchema).optional(),
  education: z.array(EducationSchema).optional(),
  certificates: z.array(CertificateSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  languages: z.array(LanguageSchema).optional(),
  references: z.array(ReferenceSchema).optional(),
  projects: z.array(z.any()).optional()
});

export type Basics = z.infer<typeof BasicsSchema>;
export type Work = z.infer<typeof WorkSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
