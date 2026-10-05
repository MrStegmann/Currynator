# Research: Header, Sidebar, and Dynamic Toolbar

## Technical Decisions

### Decision 1: Window Maximization on Startup
- **Decision**: In `src/main/views/WindowView.ts`, invoke `this.window.maximize()` immediately after window creation and before showing or loading the renderer URL.
- **Rationale**: Electron's `BrowserWindow.maximize()` reliably sets the desktop window to full screen dimensions across OS platforms (Windows, macOS, Linux) without violating native window frame controls.
- **Alternatives considered**:
  - Setting hardcoded screen dimensions: Rejected because monitor resolutions vary significantly.
  - Setting `fullscreen: true`: Rejected because fullscreen mode removes standard OS titlebar controls (minimize, maximize, close).

### Decision 2: Sidebar Pinning & Responsive Burger Toggle
- **Decision**: Make the sidebar (`RightNavBar` / Left sidebar) permanently visible (`w-64`, fixed on the left) at desktop / maximized viewport sizes (`lg` breakpoint / window maximized) and remove the burger toggle icon from the Header in maximized state.
- **Rationale**: Eliminates redundant toggle interactions and provides direct one-click navigation on desktop screens while keeping the layout clean and stable.
- **Alternatives considered**:
  - Always keeping sidebar open regardless of viewport size: Rejected because mobile/small tablet screens would experience overflow.
  - Retaining the burger icon alongside an open sidebar: Rejected as explicitly forbidden by user specifications.

### Decision 3: Navigation Order
- **Decision**: Strictly order the navigation links in the navigation bar component as:
  1. `Home` (`/` or `Home` view)
  2. `Projects` (`Projects` view)
  3. `CV Dashboard` (`CV Dashboard` view)
- **Rationale**: Matches the user requirement and aligns with the natural flow from personal data & base profile -> GitHub projects -> targeted CV job applications.

### Decision 4: Contextual Dynamic Right Toolbar
- **Decision**: Introduce a dedicated `DynamicToolbar` component placed on the top-right / right layout area.
  - In `Home` view: displays "Import LinkedIn CSV" action button.
  - In `CV Dashboard` view: displays "New Apply" action button (triggering `setFormModalOpen(true, null)` via store).
  - In `Projects` view: displays "Sync Projects" (calling `fetchRepositories(true)`) and "Score Projects" (triggering project scoring/modal).
- **Rationale**: Unifies primary view actions into an intuitive, consistent toolbar on the right side across all views without requiring floating action buttons scattered throughout different view bodies.
- **Alternatives considered**:
  - Retaining disparate floating action buttons on individual pages: Rejected because user explicitly requested a unified dynamic toolbar on the right side.
