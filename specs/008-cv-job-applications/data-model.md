# Data Model: CV Job Application Management

## Entities

### `JobApplication`

Represents an individual job application tracked within the application.

#### Schema Fields

| Field | Type | Required | Validation / Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | Non-empty string (UUID v4 or timestamp string) | Primary key / unique identifier. |
| `title` | `string` | Yes | Non-empty string | Position or vacancy title. |
| `jobDescription` | `string` | Yes | Non-empty string | Full job description text. |
| `companyDescription` | `string` | No | Optional string | Information about the hiring company. |
| `jobRequirement` | `string` | Yes | Non-empty string | Key skills/requirements for the role. |
| `companyWebsiteUrl` | `string` | No | Optional URL / string | Website or application portal link. |
| `created_at` | `string` | Yes | ISO 8601 string, auto-generated | Creation timestamp. |
| `updated_at` | `string` | Yes | ISO 8601 string, updated on save | Last modification timestamp. |
| `status` | `JobApplicationStatus` | Yes | Default: `'applied'` | Current stage in application lifecycle. |

#### `JobApplicationStatus` Enum / Union Type

```typescript
export type JobApplicationStatus =
  | 'applied'
  | 'called'
  | 'interview'
  | 'techTest'
  | 'rejected'
  | 'gotTheJob';
```

#### Status Progression Pipeline

```
[ applied ] ➔ [ called ] ➔ [ interview ] ➔ [ techTest ] ➔ [ rejected ] ➔ [ gotTheJob ]
```

- Terminal states: `rejected` and `gotTheJob`.
- Progression rule: Clicking fast-status progression advances status to next index. Reaching `gotTheJob` or `rejected` caps status or loops to `applied`.

## Storage Format (`job_applications.json`)

Saved as a JSON array of `JobApplication` objects under `app.getPath('userData')/job_applications.json`:

```json
[
  {
    "id": "job-app-1726260000000",
    "title": "Senior Frontend Developer",
    "jobDescription": "Full-time position working with React and TypeScript...",
    "companyDescription": "Innovative tech company building developer tools.",
    "jobRequirement": "5+ years JS/TS experience, React proficiency.",
    "companyWebsiteUrl": "https://example.com/careers/123",
    "created_at": "2026-09-13T20:00:00.000Z",
    "updated_at": "2026-09-13T20:00:00.000Z",
    "status": "applied"
  }
]
```

## Zod Schema Definition (`src/main/shared/schema/jobApplicationSchema.ts`)

```typescript
import { z } from 'zod';

export const JobApplicationStatusSchema = z.enum([
  'applied',
  'called',
  'interview',
  'techTest',
  'rejected',
  'gotTheJob',
]);

export const JobApplicationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
  companyDescription: z.string().optional(),
  jobRequirement: z.string().min(1, 'Job requirements are required'),
  companyWebsiteUrl: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  status: JobApplicationStatusSchema.default('applied'),
});

export const JobApplicationListSchema = z.array(JobApplicationSchema);

export type JobApplicationStatus = z.infer<typeof JobApplicationStatusSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
```
