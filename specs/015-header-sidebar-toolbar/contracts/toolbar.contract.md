# Contract: Dynamic Toolbar & Navigation Component Interface

## Component Contracts

### 1. `DynamicToolbar` Contract
Rendered on the right side of the header/layout to expose context-specific actions.

```typescript
export interface DynamicToolbarProps {
  activeView: 'Home' | 'Projects' | 'CV Dashboard';
  // Optional callbacks or store bindings
  onImportCsv?: () => void;
  onNewApply?: () => void;
  onSyncProjects?: () => void;
  onScoreProjects?: () => void;
}
```

#### Behavior Contract:
- **When `activeView === 'Home'`**:
  - Renders button: `"Import LinkedIn CSV"`
  - Triggers CSV import modal or full-page import view.
- **When `activeView === 'CV Dashboard'`**:
  - Renders button: `"New Apply"`
  - Triggers Job Application form modal.
- **When `activeView === 'Projects'`**:
  - Renders button: `"Sync Projects"` (refreshes repository list)
  - Renders button: `"Score Projects"` (runs AI score evaluation for projects)

---

### 2. `Header` Contract

```typescript
export interface HeaderProps {
  currentViewName: string;
  onToggleSidebar?: () => void;
  showBurger?: boolean; // Default: false in maximized/desktop view
  rightSlot?: React.ReactNode; // Slot for DynamicToolbar
}
```

---

### 3. `RightNavBar` / `SideNavBar` Contract

```typescript
export interface SideNavBarProps {
  isOpen: boolean;
  activeView: 'Home' | 'Projects' | 'CV Dashboard';
  onSelectView?: (view: 'Home' | 'Projects' | 'CV Dashboard') => void;
}
```

#### Navigation Order Contract:
1. `Home`
2. `Projects`
3. `CV Dashboard`
