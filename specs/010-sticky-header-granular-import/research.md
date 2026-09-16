# Research & Technical Decisions: Sticky Header and Granular LinkedIn Import

## 1. Sticky Header Positioning & Layout Architecture

### Context
The application header (`Header.tsx`) currently scrolls off-screen when users scroll long form content or views on `Home.tsx`.

### Research & Decision
- **CSS Strategy**: Use Tailwind CSS sticky utilities: `sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm`.
- **Layout Compatibility**: Ensure the top-level container in `Home.tsx` does not have conflicting overflow styles (`overflow-hidden` or nested scroll boundaries) that break CSS `sticky` positioning. `flex flex-col` parent container with `sticky top-0` header guarantees element stays pinned to top viewport edge during document/main container scrolling.
- **Sidebar Interaction**: The drawer/sidebar navigation (`RightNavBar`) will render adjacent to or overlaying content below/aligned with the sticky header.

---

## 2. Granular Per-Section Import Conflict Resolution

### Context
Currently, `PreExistingPromptModal.tsx` prompts for a global decision ("Replace" vs "Keep & Merge") across the entire resume. The user requires per-section granular decisions with 3 options per section containing existing data: **Replace**, **Keep Original**, and **Merge**.

### Section Resolution Map Data Model
For each JSON Resume section (`basics`, `work`, `education`, `certificates`, `skills`, `languages`, `projects`, `references`), we track:
- Section Name & Human Label
- Conflict status: whether existing data has records AND imported data has records for that section
- Decision: `'replace' | 'keep' | 'merge'` (Default: `'merge'`)

### Resolution Strategies Execution Logic
1. **Replace**: `target[section] = imported[section]`
2. **Keep Original**: `target[section] = existing[section]` (ignore imported section)
3. **Merge**:
   - For object sections (like `basics`): Merge non-empty fields from imported into existing without overwriting existing non-empty values.
   - For array sections (like `work`, `education`, `certificates`, `skills`, `languages`, `projects`, `references`): Concatenate array items, deduplicating matching items by unique business keys (e.g., `company` + `position` + `startDate` for work; `institution` + `area` for education).

---

## 3. LinkedIn ZIP Import in First-Time Onboarding

### Context
When the app launches without stored resume data, `OnboardingForm.tsx` handles initial setup. Users need a prominent alternative path: "Import LinkedIn ZIP".

### Architectural Design
- `OnboardingForm.tsx` will present a choice header / tab selector at step 1:
  - Option A: "Manual Entry" (existing step-by-step form)
  - Option B: "Import from LinkedIn ZIP" (embedded ZIP dropzone / file picker)
- When a ZIP file is dropped/uploaded during onboarding:
  1. The LinkedIn archive parser extracts CSV data into JSON Resume format.
  2. Because existing resume data is empty, conflict resolution is bypassed (all sections are directly assigned).
  3. Profile data is saved via `saveData` in `useInitStore` / `useResumeStore`.
  4. The onboarding process completes, automatically navigating the user to the main view (`Home.tsx`).
