import { create } from 'zustand';
import { Resume, Basics } from '../../../shared/schema/resumeSchema';

interface ResumeState {
  data: Resume | null;
  isLoading: boolean;
  error: string | null;
  loadResume: () => Promise<void>;
  setResumeData: (data: Resume) => void;
  updateBasics: (basics: Basics) => Promise<void>;
  addArrayItem: <K extends keyof Omit<Resume, 'basics'>>(section: K, item: any) => Promise<void>;
  updateArrayItem: <K extends keyof Omit<Resume, 'basics'>>(section: K, index: number, item: any) => Promise<void>;
  deleteArrayItem: <K extends keyof Omit<Resume, 'basics'>>(section: K, index: number) => Promise<void>;
}

// Ensure TypeScript knows about window.electron
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  data: null,
  isLoading: true,
  error: null,

  loadResume: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await window.electron.ipcRenderer.invoke('resume:load');
      // If it's a new user, data might be empty. Provide a default structure.
      const defaultData: Resume = {
        basics: { name: 'User', label: '', email: '' }
      };
      set({ data: data || defaultData, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setResumeData: (data: Resume) => {
    set({ data, isLoading: false, error: null });
  },

  updateBasics: async (basics) => {
    const { data } = get();
    if (!data) return;
    
    const newData = { ...data, basics };
    set({ data: newData });
    
    try {
      await window.electron.ipcRenderer.invoke('resume:save', newData);
    } catch (err: any) {
      set({ error: err.message });
      // Revert on failure
      set({ data });
    }
  },

  addArrayItem: async (section, item) => {
    const { data } = get();
    if (!data) return;

    const currentArray = data[section] || [];
    const newArray = [...currentArray, item];
    const newData = { ...data, [section]: newArray };
    
    set({ data: newData });
    
    try {
      await window.electron.ipcRenderer.invoke('resume:save', newData);
    } catch (err: any) {
      set({ error: err.message });
      set({ data });
    }
  },

  updateArrayItem: async (section, index, item) => {
    const { data } = get();
    if (!data) return;

    const currentArray = data[section] || [];
    const newArray = [...currentArray];
    newArray[index] = item;
    const newData = { ...data, [section]: newArray };
    
    set({ data: newData });
    
    try {
      await window.electron.ipcRenderer.invoke('resume:save', newData);
    } catch (err: any) {
      set({ error: err.message });
      set({ data });
    }
  },

  deleteArrayItem: async (section, index) => {
    const { data } = get();
    if (!data) return;

    const currentArray = data[section] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    const newData = { ...data, [section]: newArray };
    
    set({ data: newData });
    
    try {
      await window.electron.ipcRenderer.invoke('resume:save', newData);
    } catch (err: any) {
      set({ error: err.message });
      set({ data });
    }
  }
}));
