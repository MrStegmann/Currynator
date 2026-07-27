import { z } from 'zod';

/**
 * Zod schema for validating individual work experience entries.
 */
export const workExperienceItemSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  startMonth: z.string(),
  startYear: z.string(),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  isCurrentRole: z.boolean(),
  context: z.string(),
  highlights: z.array(z.string()),
});

/**
 * Zod schema for validating individual education entries.
 */
export const educationItemSchema = z.object({
  id: z.string(),
  degreeName: z.string(),
  institutionName: z.string(),
  graduationYear: z.string(),
  currentStudy: z.boolean().optional(),
});

/**
 * Zod schema for validating individual certification entries.
 */
export const certificationItemSchema = z.object({
  id: z.string(),
  certificationName: z.string(),
  issuingOrganization: z.string(),
  grantedYear: z.string(),
  currentStudy: z.boolean().optional(),
});

/**
 * Zod schema for validating technical project entries.
 */
export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  score: z.number().optional(),
});

/**
 * Zod schema for skill categories containing grouped skill strings.
 */
export const skillCategorySchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
});

/**
 * Zod schema for candidate personal contact details and social links.
 */
export const personalDetailsSchema = z.object({
  fullName: z.string(),
  professionalTitle: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
});

/**
 * Zod schema for the full ResumeData structure.
 */
export const resumeDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  personalDetails: personalDetailsSchema,
  summary: z.string(),
  skills: z.array(skillCategorySchema),
  languages: z.array(z.string()),
  experience: z.array(workExperienceItemSchema),
  education: z.array(educationItemSchema),
  projects: z.array(projectItemSchema),
  certifications: z.array(certificationItemSchema),
});

/** Inferred TypeScript type for WorkExperienceItem */
export type WorkExperienceItem = z.infer<typeof workExperienceItemSchema>;

/** Inferred TypeScript type for EducationItem */
export type EducationItem = z.infer<typeof educationItemSchema>;

/** Inferred TypeScript type for CertificationItem */
export type CertificationItem = z.infer<typeof certificationItemSchema>;

/** Inferred TypeScript type for ProjectItem */
export type ProjectItem = z.infer<typeof projectItemSchema>;

/** Inferred TypeScript type for SkillCategory */
export type SkillCategory = z.infer<typeof skillCategorySchema>;

/** Inferred TypeScript type for PersonalDetails */
export type PersonalDetails = z.infer<typeof personalDetailsSchema>;

/** Inferred TypeScript type for ResumeData */
export type ResumeData = z.infer<typeof resumeDataSchema>;
