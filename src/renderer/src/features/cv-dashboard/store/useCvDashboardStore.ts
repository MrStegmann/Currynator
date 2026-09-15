import { create } from 'zustand';
import { ApplicationCv } from '../models/applicationCvSchema';
import { JobApplication, JobApplicationStatus } from '../../../../../main/shared/schema/jobApplicationSchema';
import { ipcClient } from '../../../shared/ipc/ipcClient';
import { useResumeStore } from '../../../store/useResumeStore';

export type ActiveView = 'Home' | 'CV Dashboard';

interface CvDashboardState {
  cvItems: ApplicationCv[];
  jobApplications: JobApplication[];
  activeView: ActiveView;
  deletingCvId: string | null;
  isFormModalOpen: boolean;
  editingJobApp: JobApplication | null;
  previewingCvApp: JobApplication | null;
  regeneratingAppId: string | null;

  setActiveView: (view: ActiveView) => void;
  deleteCv: (id: string) => void;
  setDeletingCvId: (id: string | null) => void;
  setFormModalOpen: (open: boolean, app?: JobApplication | null) => void;
  setPreviewingCvApp: (app: JobApplication | null) => void;
  saveJobApplication: (appData: Partial<JobApplication>) => Promise<void>;
  deleteJobApplication: (id: string) => Promise<void>;
  updateJobApplicationStatus: (id: string, status: JobApplicationStatus) => Promise<void>;
  regenerateCv: (id: string) => Promise<void>;
  loadJobApplications: () => Promise<void>;
}

export const useCvDashboardStore = create<CvDashboardState>((set, get) => ({
  cvItems: [],
  jobApplications: [],
  activeView: 'Home',
  deletingCvId: null,
  isFormModalOpen: false,
  editingJobApp: null,
  previewingCvApp: null,
  regeneratingAppId: null,

  setActiveView: (view: ActiveView) => set({ activeView: view }),

  deleteCv: (id: string) =>
    set((state) => ({
      cvItems: state.cvItems.filter((item) => item.id !== id),
      deletingCvId: state.deletingCvId === id ? null : state.deletingCvId,
    })),

  setDeletingCvId: (id: string | null) => set({ deletingCvId: id }),

  setFormModalOpen: (open: boolean, app: JobApplication | null = null) =>
    set({ isFormModalOpen: open, editingJobApp: app }),

  setPreviewingCvApp: (app: JobApplication | null) => set({ previewingCvApp: app }),

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
    const isNew = !appData.id;
    const id = appData.id || `job-app-${Date.now()}`;
    const status: JobApplicationStatus = appData.status || 'pending';

    let matchScore = appData.match_score;
    let tailoredCv = appData.tailored_json_resume;

    // Trigger Groq AI CV generation upon creating a new job application if not provided
    if (isNew && !tailoredCv && typeof window !== 'undefined' && (window as any).electron) {
      try {
        let masterResume: any = null;
        if ((window as any).electron.ipcRenderer?.invoke) {
          try {
            masterResume = await (window as any).electron.ipcRenderer.invoke('resume:load');
          } catch (err) {
            console.warn('Could not load resume from IPC, attempting store fallback:', err);
          }
        }

        const storeResume = useResumeStore.getState().data;
        const resumePayload = masterResume || storeResume || {
          basics: { name: 'User', label: 'Job Applicant', email: '' },
          work: [],
          skills: []
        };

        const groqRes = await ipcClient.analyzeCvJobDriven({
          resume: resumePayload,
          jobApplication: {
            title: appData.title || '',
            jobDescription: appData.jobDescription || '',
            jobRequirement: appData.jobRequirement || '',
            companyDescription: appData.companyDescription || '',
            companyWebsiteUrl: appData.companyWebsiteUrl || '',
          },
        });

        if (groqRes && groqRes.success) {
          matchScore = groqRes.match_score;
          tailoredCv = groqRes.json_resume;
        } else if (groqRes && !groqRes.success) {
          console.error('Groq AI CV generation returned error:', groqRes.error);
        }
      } catch (err) {
        console.error('Error during AI CV tailoring on creation:', err);
      }
    }

    const fullApp: JobApplication = {
      id,
      title: appData.title || '',
      jobDescription: appData.jobDescription || '',
      companyDescription: appData.companyDescription || '',
      jobRequirement: appData.jobRequirement || '',
      companyWebsiteUrl: appData.companyWebsiteUrl || '',
      status,
      match_score: matchScore,
      tailored_json_resume: tailoredCv,
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

  regenerateCv: async (id: string) => {
    const target = get().jobApplications.find((app) => app.id === id);
    if (!target) return;

    set({ regeneratingAppId: id });

    try {
      let masterResume: any = null;
      if (typeof window !== 'undefined' && (window as any).electron?.ipcRenderer?.invoke) {
        try {
          masterResume = await (window as any).electron.ipcRenderer.invoke('resume:load');
        } catch (err) {
          console.warn('Could not load resume from IPC, attempting store fallback:', err);
        }
      }

      const storeResume = useResumeStore.getState().data;
      const resumePayload = masterResume || storeResume || {
        basics: { name: 'User', label: 'Job Applicant', email: '' },
        work: [],
        skills: []
      };

      const groqRes = await ipcClient.analyzeCvJobDriven({
        resume: resumePayload,
        jobApplication: {
          title: target.title,
          jobDescription: target.jobDescription,
          jobRequirement: target.jobRequirement,
          companyDescription: target.companyDescription,
          companyWebsiteUrl: target.companyWebsiteUrl,
        },
      });

      if (groqRes && groqRes.success) {
        const updatedApp: JobApplication = {
          ...target,
          match_score: groqRes.match_score,
          tailored_json_resume: groqRes.json_resume,
          updated_at: new Date().toISOString(),
        };

        if (typeof window !== 'undefined' && (window as any).electron?.jobApplication?.save) {
          const saveRes = await (window as any).electron.jobApplication.save(updatedApp);
          if (saveRes.success && saveRes.data) {
            set((state) => ({
              jobApplications: state.jobApplications.map((item) =>
                item.id === id ? saveRes.data : item
              ),
            }));
            return;
          }
        }

        set((state) => ({
          jobApplications: state.jobApplications.map((item) =>
            item.id === id ? updatedApp : item
          ),
        }));
      }
    } catch (err) {
      console.error('Error regenerating CV:', err);
    } finally {
      set({ regeneratingAppId: null });
    }
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
