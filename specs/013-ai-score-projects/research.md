# Research: AI Score Projects

## 1. Groq Prompt & JSON Schema Design

### Decision
We will add a dedicated method `scoreProject(repoData: ProjectScoreRequestPayload)` to `GroqController.ts` using the Groq SDK with `response_format: { type: "json_object" }`.

### Rationale
- Setting `response_format: { type: "json_object" }` on Groq `chat.completions.create` guarantees valid JSON formatting.
- The prompt explicitly specifies the required JSON output schema containing logs and improvement suggestions for the 7 requested criteria and a total score scaled between 1 and 100.

### Alternatives Considered
- Free-form text parsing: Rejected due to unreliability and potential JSON syntax errors.

---

## 2. IPC Communication Pattern

### Decision
Add IPC channel `groq:score-project` (or batch `groq:score-projects`) handled in `IpcController.ts` delegating to `GroqController.ts`, exposed via `window.electron.groq.scoreProjects`.

### Rationale
- Maintains clean MVC architecture where `IpcController` routes renderer calls to `GroqController`.
- Adheres to the existing preload script context bridge pattern (`preload.cts`).

### Alternatives Considered
- Direct HTTP requests from renderer to Groq: Rejected because API key handling and node file operations belong in main process controllers.

---

## 3. UI Selection & Modal Workflow in Zustand Store

### Decision
Extend `useProjectsStore.ts` with:
- `selectedRepoIds: Set<number>` (or `number[]`)
- `toggleSelectRepo(id: number)`
- `selectAllRepos()` / `clearSelection()`
- `isConfirmModalOpen: boolean`
- `isScoring: boolean`
- `scoringProgress: { current: number; total: number }`
- `projectScores: Record<number, AIScoreResult>`

### Rationale
- Zustand centralizes state so `ProjectCard`, `ProjectsView`, `FloatingScoreButton`, and `ConfirmModal` stay synchronized.
- LocalStorage persistence key `currynator_project_scores` ensures score history is retained across app reloads.
- Confirmation modal displays warning: `${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.`

### Alternatives Considered
- Component local state: Rejected because selection state needs to be accessible across `FloatingScoreButton` (header/toolbar) and individual `ProjectCard` items.

---

## 4. Evaluation Criteria Prompt Mapping

### Criteria Evaluated:
1. `README.md` file structure
2. Presence of a real demo (URLs, live links, preview badges)
3. Clean commit log history
4. Codebase structure and pattern consistency
5. Programming language best practices and naming conventions
6. Absence of `console.log()` or debug artifacts
7. Presence of unit or integration tests

### Output Schema:
```json
{
  "totalScore": 85,
  "breakdown": [
    {
      "category": "readme_structure",
      "title": "README.md Structure",
      "score": 90,
      "log": "Detailed README with setup instructions and usage.",
      "improvements": ["Add badges for CI build status", "Include troubleshooting section"]
    },
    {
      "category": "real_demo",
      "title": "Real Demo",
      "score": 80,
      "log": "Live demo link found in repository metadata.",
      "improvements": ["Add video GIF preview to README"]
    },
    {
      "category": "commit_history",
      "title": "Clean Commit Log",
      "score": 85,
      "log": "Clean, descriptive commit messages.",
      "improvements": ["Use conventional commit prefixes (feat, fix, docs)"]
    },
    {
      "category": "codebase_structure",
      "title": "Codebase Structure",
      "score": 90,
      "log": "Well organized directory layout following standard conventions.",
      "improvements": ["Extract inline helper functions into modular utility files"]
    },
    {
      "category": "language_best_practices",
      "title": "Best Practices & Naming",
      "score": 85,
      "log": "Consistent naming conventions and clean code structure.",
      "improvements": ["Enforce strict TypeScript interfaces for all API payloads"]
    },
    {
      "category": "no_debug_artifacts",
      "title": "Absence of Debug Artifacts",
      "score": 75,
      "log": "Minor debug statements found.",
      "improvements": ["Remove console.log calls before production commits"]
    },
    {
      "category": "test_coverage",
      "title": "Testing Quality",
      "score": 85,
      "log": "Unit test suites present and passing.",
      "improvements": ["Add integration tests for IPC controllers"]
    }
  ]
}
```
