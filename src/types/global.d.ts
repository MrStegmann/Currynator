export { };

declare global {
  interface Window {
    electronAPI: {
      // Window controls
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;

      selectFolder: () => Promise<{ success: boolean; path?: string; canceled?: boolean; error?: string }>;
      // Settings
      getSettings: () => Promise<{ success: boolean; data?: any; error?: string }>;
      saveSettings: (settings: any) => Promise<{ success: boolean; error?: string }>;

      // Profile
      getProfile: () => Promise<{ success: boolean; data?: any; error?: string }>;
      saveProfile: (profile: any) => Promise<{ success: boolean; data?: any; error?: string }>;

      // OAuth / integrations
      googleOAuthFlow: () => Promise<{ success: boolean; error?: string }>;
      githubOAuthFlow: () => Promise<{ success: boolean; error?: string }>;
      saveSecureToken: (tokenType: string, value: string) => Promise<{ success: boolean; error?: string }>;
      analyzeGithub: () => Promise<{ success: boolean; data?: any; error?: string }>;

    };
  }
}

