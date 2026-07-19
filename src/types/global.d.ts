export {};

declare global {
  interface Window {
    electronAPI: {
      // Window controls
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;

      // Resume data
      saveResumeData: (data: any, options?: { isGenerated?: boolean; customFileName?: string }) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
      listResumeData: () => Promise<{ success: boolean; files?: string[]; error?: string }>;
      readResumeData: (filename: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteResumeData: (filename: string) => Promise<{ success: boolean; error?: string }>;

      // Generated CVs
      listGeneratedCVs: () => Promise<{ success: boolean; files?: { filename: string; hasJobDetails: boolean }[]; error?: string }>;
      readGeneratedCV: (filename: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteGeneratedCV: (filename: string) => Promise<{ success: boolean; error?: string }>;
      readAIReasoning: (filename: string) => Promise<{ success: boolean; data?: string; error?: string }>;

      // CV generation
      generateCV: (args: { profileData: any; generationType: 'general' | 'specific'; jobDetails: any; aiInstructions: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
      exportPDF: (html: string) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;

      // Study guides
      generateStudyGuide: (args: { profileData: any; jobDetails: any; aiInstructions?: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
      exportStudyGuidePDF: (args: { html: string; baseName: string }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      listStudyGuides: () => Promise<{ success: boolean; files?: string[]; error?: string }>;
      deleteStudyGuide: (filename: string) => Promise<{ success: boolean; error?: string }>;
      openStudyGuide: (filename: string) => Promise<{ success: boolean; error?: string }>;

      // File utilities
      checkFileExists: (filename: string, type: 'cv' | 'guide') => Promise<{ success: boolean; exists?: boolean; error?: string }>;
      renameFile: (oldName: string, newName: string, type: 'cv' | 'guide') => Promise<{ success: boolean; error?: string }>;
      selectFolder: () => Promise<{ success: boolean; path?: string; canceled?: boolean; error?: string }>;

      // Settings
      getSettings: () => Promise<{ success: boolean; data?: any; error?: string }>;
      saveSettings: (settings: any) => Promise<{ success: boolean; error?: string }>;

      // OAuth / integrations
      googleOAuthFlow: () => Promise<{ success: boolean; error?: string }>;
      githubOAuthFlow: () => Promise<{ success: boolean; error?: string }>;
      saveSecureToken: (tokenType: string, value: string) => Promise<{ success: boolean; error?: string }>;
      analyzeGithub: () => Promise<{ success: boolean; data?: any; error?: string }>;

      // Error reporting
      sendError: (errorInfo: Record<string, unknown>) => void;
    };
  }
}

