# Phase 1 Data Model: CV Job Application - CV Generator

**Feature**: `009-cv-job-generator`

## 1. Updated Schemas & Entities

### JobApplication Schema Update (`jobApplicationSchema.ts`)

```typescript
import { z } from 'zod';

export const JobApplicationStatusSchema = z.enum([
  'pending',
  'applied',
  'called',
  'interview',
  'techTest',
  'rejected',
  'gotTheJob',
]);

export const JobApplicationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
  companyDescription: z.string().optional().default(''),
  jobRequirement: z.string().min(1, 'Job requirements are required'),
  companyWebsiteUrl: z.string().optional().default(''),
  created_at: z.string(),
  updated_at: z.string(),
  status: JobApplicationStatusSchema.default('pending'),
  match_score: z.number().min(0).max(100).optional(),
  tailored_json_resume: z.record(z.any()).optional(),
});

export const JobApplicationListSchema = z.array(JobApplicationSchema);

export type JobApplicationStatus = z.infer<typeof JobApplicationStatusSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
```

### Groq Job Driven Response Payload Type

```typescript
export interface GroqCvJobDrivenResponse {
  success: boolean;
  match_score?: number;
  json_resume?: Record<string, any>;
  error?: string;
}
```

---

## 2. State Transitions

```mermaid
stateDiagram-v2
    [*] --> pending : Job Application Created (Default)
    pending --> applied : User marks as Applied
    applied --> called : Phone screening
    called --> interview : Onsite / Video interview
    interview --> techTest : Technical assessment
    techTest --> gotTheJob : Offer accepted
    techTest --> rejected : Application rejected
    interview --> rejected : Application rejected
    applied --> rejected : Application rejected
```

---

## 3. Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Renderer (JobApplicationFormView)
    participant Renderer (Store)
    participant Main (IpcController)
    participant Main (GroqController)
    participant Main (JobApplicationStorage)
    participant Main (ResumeStorage)

    User->>Renderer (JobApplicationFormView): Submit New Job Application
    Renderer (Store)->>Main (IpcController): resume:load (Fetch Master Resume)
    Main (ResumeStorage)-->>Renderer (Store): Return Master JSON Resume (Read-Only)
    Renderer (Store)->>Main (IpcController): groq:cv-job-driven (Master Resume + Job Data)
    Main (GroqController)->>Groq API: Prompt with Zero-Hallucination & Omit Empty Rules
    Groq API-->>Main (GroqController): Return match_score & tailored json_resume
    Main (GroqController)-->>Main (IpcController): { success: true, match_score, json_resume }
    Renderer (Store)->>Main (IpcController): job-application:save (Application + match_score + tailored_json_resume, status='pending')
    Main (JobApplicationStorage)->>Disk: Write job_applications.json
    Main (JobApplicationStorage)-->>Renderer (Store): Return saved JobApplication
    Renderer (JobApplicationFormView)-->>User: Navigate to List View displaying Card with 'pending' status & match score
```
