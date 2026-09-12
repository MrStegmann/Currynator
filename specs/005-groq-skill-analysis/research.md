# Phase 0 Research: Groq API Skill Analysis & Categorization

## 1. Groq Controller Architecture & IPC Bridge

### Decision
Implement `GroqController` in the Electron Main process (`src/main/controllers/GroqController.ts`) and expose an IPC channel `groq:analyze-skills` via `IpcController.ts`.

### Rationale
- Complies with Constitution Principle I (MVC architecture for Electron backend).
- Keeps `GROQ_API_KEY` strictly on the backend/main process, preventing secret leakage to the renderer process.
- Avoids cross-origin resource sharing (CORS) constraints inherent in browser environments.

### Alternatives Considered
- *Direct API call from Renderer*: Rejected due to security rule requiring `GROQ_API_KEY` to remain unexposed to frontend code and potential browser fetch/CORS limitations.

---

## 2. Environment Configuration (`GROQ_API_KEY`)

### Decision
Configure `GROQ_API_KEY` in `.env` and document it in `.env.example`. The Main process retrieves it via `process.env.GROQ_API_KEY` using the Groq SDK (`groq-sdk`).

### Rationale
- Adheres strictly to security requirements specified in the feature description.
- Ensures environment isolation across development, testing, and production runtime environments.

### Alternatives Considered
- *Hardcoded fallback key*: Rejected by explicit security constraints.

---

## 3. Robust JSON Response Parsing & Validation Strategy

### Decision
Combine pre-parsing sanitization (extracting JSON arrays between `[` and `]`) with Zod schema validation (`z.array(SkillSchema)`).

### Rationale
- LLMs can occasionally enclose JSON within markdown code blocks (e.g., ` ```json ... ``` `) despite strict system prompt instructions.
- Extracting the array substring ensures clean parsing without failing on markdown fences or whitespace.
- Zod schema validation guarantees runtime type safety for the JSON Resume `skills` model.

### Alternatives Considered
- *Direct `JSON.parse` without sanitization*: Rejected because minor prompt wrapper variations (like code fences) would crash the parser.

---

## 4. Non-Elemental Category Floating Label & Tooltip UI

### Decision
Implement `NonElementalLabel` in `src/renderer/src/features/home/SkillsArticle` styled exclusively with TailwindCSS utilities (`relative`, `inline-flex`, `group`, `opacity-0 group-hover:opacity-100`).

### Rationale
- Meets Constitution Principle V (TailwindCSS exclusively, no custom CSS files).
- Floating label text: `Skills no necesarias/prescindibles` anchored to the right of the category header.
- Hover tooltip displays Spanish definition: *"Non-Elemental se refiere a habilidades que son redundantes, excesivamente genéricas, obsoletas, ambiguas o consideradas malas prácticas cuando se incluyen en un currículum profesional."*
- Pure TailwindCSS transition utilities ensure smooth fade-in/fade-out interaction.

### Alternatives Considered
- *External tooltip library (e.g. Radix Tooltip)*: Rejected to avoid unnecessary dependency overhead when Tailwind CSS hover/group states suffice.
