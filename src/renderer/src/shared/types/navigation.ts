import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ActiveView = 'Home' | 'Projects' | 'CV Dashboard';

export interface NavItem {
  id: string;
  label: string;
  view: ActiveView;
  icon: LucideIcon;
  order: number;
}

export interface ToolbarActionItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  view: ActiveView;
  variant?: 'primary' | 'secondary';
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface DynamicToolbarProps {
  isOpen?: boolean;
  activeView: ActiveView;
  onImportCsv?: () => void;
  onNewApply?: () => void;
  onSyncProjects?: () => void;
  onScoreProjects?: () => void;
  isScoringProjects?: boolean;
  isSyncingProjects?: boolean;
}

export interface HeaderProps {
  currentViewName: string;
  onToggleSidebar?: () => void;
  onToggleToolbar?: () => void;
  showBurger?: boolean;
  showToolbarToggle?: boolean;
  rightSlot?: React.ReactNode;
}

export interface SideNavBarProps {
  isOpen: boolean;
  activeView: ActiveView;
  onSelectView?: (view: ActiveView) => void;
}
