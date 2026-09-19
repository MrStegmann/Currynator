# Data Model: Project Score Visual & Improvement Tips

## Entities & Interfaces

### 1. `AIScoreResult` (Existing domain model in `src/renderer/src/features/projects/types/projects.ts`)
Represents the evaluated AI score structure attached to a project repository.

| Field | Type | Description | Validation / Constraints |
|---|---|---|---|
| `repoId` | `number` | Unique GitHub repository ID | Required |
| `repoName` | `string` | Repository name | Required |
| `totalScore` | `number` | Overall calculated score | 1 to 100 integer |
| `evaluatedAt` | `string` | ISO timestamp of scoring run | Required |
| `logs` | `ScoreLogItem[]` | Array of section evaluation breakdowns | Required |

### 2. `ScoreLogItem` (Existing domain model in `src/renderer/src/features/projects/types/projects.ts`)
Represents single section evaluation criterion.

| Field | Type | Description | Validation / Constraints |
|---|---|---|---|
| `category` | `string` | Category identifier (e.g., `readme_structure`, `test_coverage`) | Required |
| `title` | `string` | Human-readable title | Required |
| `score` | `number` | Section numerical score | 0 to 100 integer |
| `log` | `string` | Detailed analysis explanation | Required |
| `improvements` | `string[]` | List of actionable improvement recommendations | Required |

### 3. `ProjectScoreModalProps` (New component interface)
Interface for `ProjectScoreModal` component.

| Prop | Type | Description | Required |
|---|---|---|---|
| `isOpen` | `boolean` | Controls modal open/close state | Yes |
| `onClose` | `() => void` | Callback when modal close is triggered | Yes |
| `repositoryName` | `string` | Name of the project repository being inspected | Yes |
| `scoreResult` | `AIScoreResult \| undefined` | The AI evaluation score result data | No (handles unscored state) |
| `triggerRef` | `React.RefObject<HTMLElement> \| undefined` | Ref to element that triggered modal (for focus return) | No |

## Visual State Indicators

| Score Range | Badge & Header Style Variant | Color Tokens (Tailwind) |
|---|---|---|
| ≥ 80 | High Quality / Emerald | `bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400` |
| 50 – 79 | Moderate Quality / Amber | `bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400` |
| < 50 | Needs Improvement / Rose | `bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400` |
| Unscored | Neutral / Pending | `bg-surface-container-high text-on-surface-variant border-outline-variant` |
