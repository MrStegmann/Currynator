# Research: Universal Newest-First Chronological Sorting & GitHub Project Keyword Matching

## Research Context & Objectives

Currynator manages professional curriculum vitae and portfolio data compliant with the JSON Resume schema standard. The user requires:
1. Universal newest-first chronological sorting across all date-bearing categories (`work`, `education`, `certificates`, `projects`).
2. Automatic application of this sorting order during CV generation and preview rendering.
3. Dynamic retrieval and keyword-based preselection of GitHub repositories when tailoring projects for a specific job opening.

---

## Technical Decisions & Rationale

### 1. Universal Chronological Sorting Architecture

- **Decision**: Implement a pure, robust date normalization and comparison utility function (`sortChronologicalDescending` / `compareDatesDescending`) in a shared utility module (`src/renderer/src/shared/utils/dateSorting.ts`).
- **Rationale**:
  - Centralizing the date comparison and parsing logic eliminates duplication across individual articles (`WorkArticle`, `EducationArticle`, `CertificatesArticle`), store selectors, and CV generation pipelines.
  - Handles heterogeneous date formats present in JSON Resume: full ISO dates (`YYYY-MM-DD`), year-month (`YYYY-MM`), year only (`YYYY`), ongoing markers (`"Currently"`, `"Present"`, `""` / `null` with active `startDate`), and missing dates.
  - Ongoing positions are treated as current/most recent (highest precedence), followed by descending end dates, with tie-breaking using start dates.
- **Alternatives Considered**:
  - *Ad-hoc sorting inside each React component render*: Rejected because unsorted data would persist in exported JSON and CV generation models, causing inconsistencies between views and generated documents.
  - *Heavy external date library (e.g. Moment / Day.js)*: Rejected because lightweight native Date / string parsing satisfies all ISO 8601 and YYYY-MM scenarios without adding bundle bloat.

### 2. GitHub Project Retrieval & Language Keyword Matching

- **Decision**: Integrate repository retrieval with `useProjectsStore` / `fetchGitHubRepositories` and build a deterministic keyword matching filter (`matchProjectsByKeywords`) based on repository language and topic tags.
- **Rationale**:
  - `useProjectsStore` already possesses encrypted token management, local storage caching, and GitHub API fetching capabilities (`githubService.ts`).
  - The keyword matching engine normalizes tech keywords from job requirements/descriptions (e.g., tokenizing words, handling aliases like `TypeScript` / `TS`, `JavaScript` / `JS`, `React`, `Python`, `Node.js`) and tests them against the repository `language`, `topics`, and `description`.
  - Repositories that match any primary language or requirement keyword are automatically marked as preselected in the CV generator state, allowing users to override or adjust.
- **Alternatives Considered**:
  - *Full AI-only project matching on every keystroke*: Rejected due to latency and rate limiting. A hybrid fast deterministic language/keyword match paired with AI scoring is instantaneous, predictable, and robust offline.

### 3. CV Generation & Export Sorting Integrity

- **Decision**: Apply `sortChronologicalDescending` to all sections within `useCvDashboardStore` / `GroqController` when building the tailored JSON resume before persisting and rendering.
- **Rationale**:
  - Guarantees that regardless of whether the AI generates items in arbitrary order, the resulting `tailored_json_resume` adheres strictly to descending chronological order for work, education, certificates, and projects.
  - Both `PreviewCvModal` and future PDF/document export modules consume cleanly sorted data directly.

---

## Constitution & Principle Alignment

- **Zustand & Local Storage**: Data ordering is consistently maintained in Zustand state and serialized to Local Storage.
- **Zod Validation**: Date structures and project selection schemas are validated with Zod schemas.
- **TailwindCSS Only**: Any UI elements for keyword match indicators or project selection checkboxes strictly use TailwindCSS tokens.
- **TDD Mandatory**: Unit and component tests in Jest are written before implementing sorting and keyword matching logic.
