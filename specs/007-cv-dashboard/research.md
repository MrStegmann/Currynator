# Research: CV Dashboard View

## Technical Decisions & Rationale

### 1. View Routing & State Management in Renderer
- **Decision**: Integrate active view routing within `Home.tsx` (or top-level navigation container) using a Zustand store (`useNavigationStore` or `useCvDashboardStore`) or local navigation state.
- **Rationale**: The application uses single-page view switching in the renderer process. Main navbar / sidebar triggers view changes (e.g. `Home` vs `CV Dashboard`).
- **Alternatives Considered**: React Router was considered, but the current codebase relies on lightweight state-driven view switching without external router dependencies.

### 2. State & Data Persistence for CV Items
- **Decision**: Create `useCvDashboardStore` using Zustand to manage application-specific CV items, supporting initial mock data, item addition (placeholder), item deletion, and active view selection.
- **Rationale**: Constitution Rule III mandates Zustand for global state management and Zod for validation.
- **Alternatives Considered**: Component local state was considered, but Zustand allows seamless sharing of CV items across Navbar, Dashboard, and future edit/view modals.

### 3. Responsive Grid Layout Strategy
- **Decision**: Implement CSS grid using TailwindCSS utility classes (`grid grid-cols-1 @[675px]:grid-cols-3` or custom breakpoint / media query matching `675px`).
- **Rationale**: Constitution Rule V mandates TailwindCSS exclusively for all styling without custom CSS files.
- **Alternatives Considered**: Flexbox wrapping was evaluated, but CSS grid provides strict 3-column alignment on >675px screens and single-column stack on <=675px screens as specified in requirements.

### 4. Custom Confirmation Modal Dialog
- **Decision**: Reusable custom modal component (utilizing existing `Modal` component or extending it) to confirm deletion requests without using native browser `alert` or `confirm`.
- **Rationale**: Requirement FR-009 & FR-010 explicitly prohibit native browser dialogs.
- **Alternatives Considered**: Inline card inline-confirmation state, but spec specifies a custom modal notification popup.

### 5. Testing Framework & TDD Approach
- **Decision**: Jest with React Testing Library (`@testing-library/react`) for renderer components and Zustand stores.
- **Rationale**: Constitution Rule IV mandates TDD with Jest as the primary testing framework.
