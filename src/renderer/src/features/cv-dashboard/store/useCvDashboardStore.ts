import { create } from 'zustand';
import { ApplicationCv } from '../models/applicationCvSchema';

export type ActiveView = 'Home' | 'CV Dashboard';

interface CvDashboardState {
  cvItems: ApplicationCv[];
  activeView: ActiveView;
  deletingCvId: string | null;
  setActiveView: (view: ActiveView) => void;
  deleteCv: (id: string) => void;
  setDeletingCvId: (id: string | null) => void;
}

const initialMockCvItems: ApplicationCv[] = [
  {
    id: 'cv-mock-1',
    targetVacancyTitle: 'Senior Frontend Developer - React',
    jobDescriptionSnippet: 'Looking for a Senior Frontend Developer experienced with React, TypeScript, and modern state management tools.',
    createdAt: '2026-09-01T09:30:00Z',
    updatedAt: '2026-09-10T14:15:00Z',
  },
  {
    id: 'cv-mock-2',
    targetVacancyTitle: 'Desktop Applications Engineer (Electron)',
    jobDescriptionSnippet: 'Build desktop apps with Electron, React, and Node.js backend integration.',
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-11T16:45:00Z',
  },
  {
    id: 'cv-mock-3',
    targetVacancyTitle: 'Full Stack Engineer - AI & Web',
    jobDescriptionSnippet: 'Integrate Generative AI pipelines and LLM APIs into user-friendly web applications.',
    createdAt: '2026-09-05T08:20:00Z',
    updatedAt: '2026-09-12T10:00:00Z',
  },
];

export const useCvDashboardStore = create<CvDashboardState>((set) => ({
  cvItems: initialMockCvItems,
  activeView: 'Home',
  deletingCvId: null,
  setActiveView: (view: ActiveView) => set({ activeView: view }),
  deleteCv: (id: string) =>
    set((state) => ({
      cvItems: state.cvItems.filter((item) => item.id !== id),
      deletingCvId: state.deletingCvId === id ? null : state.deletingCvId,
    })),
  setDeletingCvId: (id: string | null) => set({ deletingCvId: id }),
}));
