export {};

declare global {
  interface Window {
    electronAPI: {
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      saveResumeData: (data: any, options?: { isGenerated?: boolean, customFileName?: string }) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
      exportPDF: (html: string) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
      generateStudyGuide: (args: { profileData: any, jobDetails: any }) => Promise<{ success: boolean; data?: any; error?: string }>;
      exportStudyGuidePDF: (args: { html: string, baseName: string }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      listResumeData: () => Promise<{ success: boolean; files?: string[]; error?: string }>;
      readResumeData: (filename: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteResumeData: (filename: string) => Promise<{ success: boolean; error?: string }>;
      listGeneratedCVs: () => Promise<{ success: boolean; files?: {filename: string, hasJobDetails: boolean}[]; error?: string }>;
      readGeneratedCV: (filename: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteGeneratedCV: (filename: string) => Promise<{ success: boolean; error?: string }>;
      readAIReasoning: (filename: string) => Promise<{ success: boolean; data?: string; error?: string }>;
    };
  }
}
