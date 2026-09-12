# Research & Technical Decisions: Work Section AI Optimization

## 1. Groq Controller Extension vs. New Controller

- **Decision**: Extend existing `GroqController` (`src/main/controllers/GroqController.ts`) with `analyzeWorkSection(workData: Work[])`.
- **Rationale**: `GroqController` already handles environment variable loading (`ensureEnvLoaded()`), Groq SDK client instantiation, markdown fence sanitization, and error handling. Adding `analyzeWorkSection` to this controller respects SRP and avoids duplicating API connection logic.
- **Alternatives Considered**: Creating a standalone `GroqWorkController`. Rejected because it duplicates SDK initialization and environment loading.

## 2. Model & Temperature Configuration

- **Decision**: Use `qwen/qwen3.8-27b` (or standard Groq chat completion model) with low temperature (`0.1`).
- **Rationale**: Low temperature minimizes creative extrapolation and hallucination, enforcing strict adherence to existing facts and metrics while polishing vocabulary and grammar.
- **Alternatives Considered**: Higher temperature (`0.7`). Rejected because higher variance risks modifying factual details or metrics.

## 3. IPC Communication Pattern

- **Decision**: Register a new IPC invoke channel `groq:analyze-work` in `IpcController.ts`.
- **Rationale**: Consistent with existing IPC channel naming conventions (`groq:analyze-skills`, `resume:save`, `resume:load`). Passes `workData` payload directly and returns `{ success: true, data: Work[] } | { success: false, error: string }`.

## 4. State Management & Persistence

- **Decision**: Add `analyzeWork()` action to `useResumeStore.ts`.
- **Rationale**: Centralizes resume state mutations in Zustand. Upon receiving response from `groq:analyze-work`, updates `data.work` and persists changes via `resume:save`.

## 5. UI/UX & Layout Integration

- **Decision**: Place the "Analyze with AI" button in `WorkArticle.tsx` header inside `<div className="flex items-center gap-2">` immediately to the left of the Edit button.
- **Rationale**: Satisfies explicit UI requirement. Button styled using TailwindCSS `bg-primary-container text-primary hover:bg-primary hover:text-on-primary rounded-md`, with `Sparkles` icon when idle and spinning `Loader2` icon when processing.
