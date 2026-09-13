import { create } from 'zustand';
import { ApplicationCv } from '../models/applicationCvSchema';
import { JobApplication, JobApplicationStatus } from '../../../../../main/shared/schema/jobApplicationSchema';

export type ActiveView = 'Home' | 'CV Dashboard';

interface CvDashboardState {
  cvItems: ApplicationCv[];
  jobApplications: JobApplication[];
  activeView: ActiveView;
  deletingCvId: string | null;
  isFormModalOpen: boolean;
  editingJobApp: JobApplication | null;

  setActiveView: (view: ActiveView) => void;
  deleteCv: (id: string) => void;
  setDeletingCvId: (id: string | null) => void;
  setFormModalOpen: (open: boolean, app?: JobApplication | null) => void;
  saveJobApplication: (appData: Partial<JobApplication>) => Promise<void>;
  deleteJobApplication: (id: string) => Promise<void>;
  updateJobApplicationStatus: (id: string, status: JobApplicationStatus) => Promise<void>;
  loadJobApplications: () => Promise<void>;
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

export const useCvDashboardStore = create<CvDashboardState>((set, get) => ({
  cvItems: [],
  jobApplications: [],
  activeView: 'Home',
  deletingCvId: null,
  isFormModalOpen: false,
  editingJobApp: null,

  setActiveView: (view: ActiveView) => set({ activeView: view }),

  deleteCv: (id: string) =>
    set((state) => ({
      cvItems: state.cvItems.filter((item) => item.id !== id),
      deletingCvId: state.deletingCvId === id ? null : state.deletingCvId,
    })),

  setDeletingCvId: (id: string | null) => set({ deletingCvId: id }),

  setFormModalOpen: (open: boolean, app: JobApplication | null = null) =>
    set({ isFormModalOpen: open, editingJobApp: app }),

  loadJobApplications: async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.jobApplication?.getAll) {
      try {
        const res = await (window as any).electron.jobApplication.getAll();
        if (res.success && Array.isArray(res.data)) {
          set({ jobApplications: res.data });
        }
      } catch (err) {
        console.error('Error loading job applications:', err);
      }
    }
  },

  saveJobApplication: async (appData: Partial<JobApplication>) => {
    const now = new Date().toISOString();
    const id = appData.id || `job-app-${Date.now()}`;
    const fullApp: JobApplication = {
      id,
      title: appData.title || '',
      jobDescription: appData.jobDescription || '',
      companyDescription: appData.companyDescription || '',
      jobRequirement: appData.jobRequirement || '',
      companyWebsiteUrl: appData.companyWebsiteUrl || '',
      status: appData.status || 'applied',
      created_at: appData.created_at || now,
      updated_at: now,
    };

    if (typeof window !== 'undefined' && (window as any).electron?.jobApplication?.save) {
      try {
        const res = await (window as any).electron.jobApplication.save(fullApp);
        if (res.success && res.data) {
          const updatedList = get().jobApplications.filter((item) => item.id !== res.data.id);
          set({ jobApplications: [res.data, ...updatedList], isFormModalOpen: false, editingJobApp: null });
          return;
        }
      } catch (err) {
        console.error('Error saving job application via IPC:', err);
      }
    }

    // Fallback for local testing or absent IPC
    const existing = get().jobApplications.filter((item) => item.id !== id);
    set({ jobApplications: [fullApp, ...existing], isFormModalOpen: false, editingJobApp: null });
  },

  deleteJobApplication: async (id: string) => {
    if (typeof window !== 'undefined' && (window as any).electron?.jobApplication?.delete) {
      try {
        await (window as any).electron.jobApplication.delete(id);
      } catch (err) {
        console.error('Error deleting job application via IPC:', err);
      }
    }

    set((state) => ({
      jobApplications: state.jobApplications.filter((item) => item.id !== id),
      deletingCvId: state.deletingCvId === id ? null : state.deletingCvId,
    }));
  },

  updateJobApplicationStatus: async (id: string, status: JobApplicationStatus) => {
    if (typeof window !== 'undefined' && (window as any).electron?.jobApplication?.updateStatus) {
      try {
        const res = await (window as any).electron.jobApplication.updateStatus(id, status);
        if (res.success && res.data) {
          set((state) => ({
            jobApplications: state.jobApplications.map((item) =>
              item.id === id ? res.data : item
            ),
          }));
          return;
        }
      } catch (err) {
        console.error('Error updating status via IPC:', err);
      }
    }

    set((state) => ({
      jobApplications: state.jobApplications.map((item) =>
        item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item
      ),
    }));
  },
}));
