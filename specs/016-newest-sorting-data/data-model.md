# Data Model: Newest-First Chronological Data Sorting & GitHub Project Keyword Matching

## 1. Entities & Data Structures

### 1.1 Chronological Date Boundaries (`DateBoundEntry`)
Represents any JSON Resume section item possessing chronological date properties.

```typescript
export interface DateBoundEntry {
  startDate?: string | null;
  endDate?: string | null;
  date?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}
```

**Sorting Precedence Rules**:
1. **Ongoing / Present Status**: If `endDate` is empty/null/undefined or matches case-insensitively `/(current|present|actual|actualmente|hoy)/i` while `startDate` is present, the item is considered *Ongoing* and given the highest priority (`Date.now() + futureOffset`).
2. **Effective End Date**: Descending sort by `endDate` (or single `date` / `updated_at` property).
3. **Effective Start Date**: If end dates are identical, descending sort by `startDate`.
4. **Undated Items**: Items missing all date fields are placed at the bottom in stable order.

---

### 1.2 GitHub Repository (`GitHubRepository`)
Represents an external or cached GitHub project for portfolio integration.

```typescript
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
  size: number;
  topics?: string[];
}
```

---

### 1.3 Keyword Match Result (`ProjectKeywordMatch`)
Represents the evaluation of a GitHub project against target job/language keywords.

```typescript
export interface ProjectKeywordMatch {
  repository: GitHubRepository;
  isMatched: boolean;
  matchedKeywords: string[];
  score: number; // match relevance score based on language and topic hits
}
```

---

### 1.4 Tailored JSON Resume Section Ordering (`TailoredJsonResume`)
Ensures all collections in a generated CV comply with chronological ordering.

```typescript
export interface TailoredJsonResume {
  basics?: Record<string, any>;
  work?: Work[];              // Sorted newest-first
  education?: Education[];    // Sorted newest-first
  certificates?: Certificate[];// Sorted newest-first
  projects?: Project[];       // Sorted newest-first (or updated_at descending)
  skills?: Skill[];
  languages?: Language[];
  references?: Reference[];
}
```

---

## 2. Validation & Zod Schemas

```typescript
import { z } from 'zod';

export const DateStringSchema = z.string().trim();

export const ChronologicalSortOptionsSchema = z.object({
  treatEmptyEndDateAsCurrent: z.boolean().default(true),
  fallbackToStartDate: z.boolean().default(true)
});

export const KeywordMatchingOptionsSchema = z.object({
  targetKeywords: z.array(z.string().min(1)),
  includeTopics: z.boolean().default(true),
  caseSensitive: z.boolean().default(false)
});
```

---

## 3. State Lifecycle & Transitions

```
[Master Resume Data / Job Application Input]
        │
        ▼
[Extract Target Keywords] ──► [Retrieve GitHub Projects]
        │                              │
        ▼                              ▼
[Filter & Preselect Projects] ◄────────┘
        │
        ▼
[CV Generation Engine (Groq AI / Tailoring)]
        │
        ▼
[Universal Chronological Sorting Hook]
        ├── Sort Work (Newest -> Oldest)
        ├── Sort Education (Newest -> Oldest)
        ├── Sort Certificates (Newest -> Oldest)
        └── Sort Projects (Newest -> Oldest)
        │
        ▼
[Persist in Store & Render Preview]
```
