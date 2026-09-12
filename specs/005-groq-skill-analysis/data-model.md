# Data Model: Groq API Skill Analysis & Categorization

## 1. Domain Entities & Schemas

### `SkillCategory` (JSON Resume Compatible)
Matches existing `SkillSchema` in `src/shared/schema/resumeSchema.ts`.

```typescript
export interface SkillCategory {
  name: AllowedCategory;
  keywords: string[];
}
```

#### Allowed Categories Enum / Type
```typescript
export type AllowedCategory =
  | 'Programming Languages'
  | 'Backend, Frameworks & Libraries'
  | 'Frontend & Web Development'
  | 'Databases & Storage'
  | 'Tools & Environments'
  | 'Cloud, DevOps & Infrastructure'
  | 'Version Control & Workflows'
  | 'Testing & Quality Assurance'
  | 'Architecture & Patterns'
  | 'Methodologies & Management'
  | 'Non-Elemental'
  | 'Non-grouped';
```

---

### `GroqAnalysisRequest`
Payload passed to the Groq controller from raw CSV skills input.

```typescript
export interface GroqAnalysisRequest {
  skills: string[];
}
```

---

### `GroqAnalysisResponse`
IPC response payload returned from Main process controller to Renderer.

```typescript
export interface GroqAnalysisResponse {
  success: boolean;
  data?: SkillCategory[];
  error?: string;
}
```

---

## 2. Validation Rules & State Transitions

1. **Header Stripping**: The input skill string array must exclude CSV table header rows (e.g., "Name", "Skill").
2. **Category Schema Enforcement**: Each parsed category object must contain a valid `name` string matching an allowed category and an array of string `keywords`.
3. **Fallback Grouping**: Any useful skill not matching primary tech stacks is categorized under `Non-grouped`.
4. **Redundant/Outdated Grouping**: Any redundant, outdated, broad, or bad-practice skill is categorized under `Non-Elemental`.
5. **State Storage**: Successful categorization updates the Zustand dashboard store and persists to Local Storage under the JSON Resume structure.
