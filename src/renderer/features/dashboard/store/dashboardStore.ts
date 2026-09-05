import { create } from 'zustand';

interface DashboardState {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeSection: 'basics',
  setActiveSection: (section) => set({ activeSection: section }),
}));
