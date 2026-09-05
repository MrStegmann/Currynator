# Data Model & Interfaces

## JSON Resume Schema (Zod)

The data model strictly follows the JSON Resume schema as outlined in the Constitution. The following models will be defined using `zod` for runtime validation.

### Basics
```typescript
import { z } from 'zod';

export const BasicsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  image: z.string().optional(),
  email: z.string().email("Invalid email").min(1, "Email is required"),
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
    network: z.string(),
    username: z.string(),
    url: z.string().url().optional().or(z.literal(''))
  })).optional()
});
```

### Array-Based Sections
```typescript
export const WorkSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  url: z.string().url().optional().or(z.literal('')),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"), // Can be a Date string or "Currently"
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional()
});

export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  area: z.string().min(1, "Area is required"),
  studyType: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required")
});

export const CertificateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  issuer: z.string().min(1, "Issuer is required"),
  url: z.string().url().optional().or(z.literal(''))
});

export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  keywords: z.array(z.string()).min(1, "At least 1 keyword is required")
});

export const LanguageSchema = z.object({
  language: z.string().min(1, "Language is required"),
  fluency: z.string().optional()
});

export const ReferenceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  reference: z.string().min(1, "Reference text is required")
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
```

## State Management (Zustand)

```typescript
interface ResumeState {
  data: Resume;
  isLoading: boolean;
  error: string | null;
  loadResume: () => Promise<void>;
  updateBasics: (basics: Basics) => Promise<void>;
  addArrayItem: <K extends keyof Omit<Resume, 'basics'>>(section: K, item: any) => Promise<void>;
  updateArrayItem: <K extends keyof Omit<Resume, 'basics'>>(section: K, index: number, item: any) => Promise<void>;
  deleteArrayItem: <K extends keyof Omit<Resume, 'basics'>>(section: K, index: number) => Promise<void>;
}
```
