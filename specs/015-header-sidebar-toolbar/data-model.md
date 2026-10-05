# Data Model: Header, Sidebar, and Dynamic Toolbar

## Entities & View Types

### 1. ActiveView
Represents the current primary view selected by the user.

- **Values**: `'Home' | 'Projects' | 'CV Dashboard'`
- **Validation**:
  - Must be one of the enumerated view values.
  - Default view is `'Home'`.

### 2. NavItem
Represents an item in the permanent navigation sidebar.

- **Fields**:
  - `id`: `string` - unique identifier (`'home'`, `'projects'`, `'cv-dashboard'`)
  - `label`: `string` - display name (`'Home'`, `'Projects'`, `'CV Dashboard'`)
  - `view`: `ActiveView` - target active view
  - `icon`: `LucideIcon` - icon component reference (`Home`, `FolderGit2`, `FileText`)
  - `order`: `number` - sequential order index:
    - 1: Home
    - 2: Projects
    - 3: CV Dashboard

### 3. ToolbarActionItem
Represents a dynamic action button rendered in the right-side toolbar.

- **Fields**:
  - `id`: `string` - unique action ID (`'import-linkedin-csv'`, `'new-apply'`, `'sync-projects'`, `'score-projects'`)
  - `label`: `string` - button text (`'Import LinkedIn CSV'`, `'New Apply'`, `'Sync Projects'`, `'Score Projects'`)
  - `icon`: `LucideIcon` - associated icon (e.g. `Upload`, `Plus`, `RefreshCw`, `Sparkles`)
  - `view`: `ActiveView` - associated active view where this button appears
  - `variant`: `'primary' | 'secondary'` - visual style
  - `onClick`: `() => void | Promise<void>` - handler function
  - `disabled`: `boolean` (optional) - whether the action is currently disabled or loading
  - `ariaLabel`: `string` - accessible label for assistive tools

### 4. LayoutState
Tracks the layout configuration and responsive state.

- **Fields**:
  - `isPinned`: `boolean` - whether the navigation bar is pinned open (true on desktop/maximized screens)
  - `isMaximized`: `boolean` - whether the window is currently maximized
