# Research: Project Score Visual & Improvement Tips

## Technical Context & Decisions

### 1. Interactive Top-Right Score Badge Component
- **Decision**: Position the total score badge cleanly in the top-right corner of each `ProjectCard`, replacing static layout inline elements.
- **Rationale**: Elevates score visibility to top-level card header status. Making it an interactive button with visible hover, focus, and active states provides a direct entry point into the breakdown modal.
- **Alternatives Considered**: Keeping expandable accordion inside the card body (rejected because it cluttered individual cards and hid detailed analysis behind nested dropdowns).

### 2. Score Breakdown & Improvement Tips Modal Component
- **Decision**: Create a dedicated, reusable `ProjectScoreModal.tsx` component in `src/renderer/src/features/projects/components/`.
- **Rationale**: A full modal dialog provides ample screen space to render structured section scores, detailed logs, and a clean bulleted list of repository improvement tips without cramped card layouts.
- **Alternatives Considered**: Inline expansion drawer inside grid (rejected due to grid item height shifting and visual clutter across multi-column layouts).

### 3. Focus Management & Accessibility Pattern
- **Decision**: Implement accessibility using native React hooks (`useEffect`, `useRef`) for keyboard events (`Escape` key close, `Tab` focus trapping) and semantic ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`).
- **Rationale**: Lightweight, dependency-free, compliant with project constitution and accessibility standards. Focus automatically returns to the triggering score badge element when closed.
- **Alternatives Considered**: External modal packages (rejected to avoid introducing extra external dependencies).

### 4. Theme & Aesthetic Styling
- **Decision**: Utilize TailwindCSS design system classes from `DESIGN.md` (e.g., `bg-surface-container-lowest`, `border-outline-variant`, `text-on-surface`, `bg-primary`, color variants for scores: emerald for ≥80, amber for 50–79, rose for <50, neutral for unscored).
- **Rationale**: Complies with Constitution Rule V (TailwindCSS exclusively, no custom CSS files, consistent design system).
