export interface FeedbackItem {
  id: string;
  type: 'worse_part' | 'warning' | 'tip';
  title: string;
  message: string;
  actionableSuggestion?: string;
}

export interface GlobalLanguage {
  name: string;
  percentage: number;
  color: string;
}

export interface SectionAnalysis {
  sectionId: 'description' | 'readme' | 'structure' | 'languages';
  title: string;
  score: number; // Range 0 - 100
  hasContent: boolean;
  contentData: Record<string, any>;
  worseParts: FeedbackItem[];
  warnings: FeedbackItem[];
  tips: FeedbackItem[];
}

export interface ProjectScoreOverview {
  globalScore: number; // Aggregated score (0 - 100)
  descriptionScore: number;
  readmeScore: number;
  structureScore: number;
  languagesScore: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  stars: number;
  primaryLanguage: string;
  repoUrl: string;
  scores: ProjectScoreOverview;
  sections: {
    description: SectionAnalysis;
    readme: SectionAnalysis;
    structure: SectionAnalysis;
    languages: SectionAnalysis;
  };
}

export interface UserGitHubProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  profileReadme: {
    exists: boolean;
    contentRaw?: string;
    contentHtml?: string;
    score?: number;
    worseParts?: FeedbackItem[];
    warnings?: FeedbackItem[];
    tips?: FeedbackItem[];
  };
  globalLanguages: GlobalLanguage[];
  projects: ProjectItem[];
}
