export interface HomeFeatureState {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
  metrics: {
    profileReadme: {
      score: number; // 0 to 100
      exists: boolean;
      improvementTips: string[];
    };
    languages: Array<{
      name: string;
      percentage: number;
      color: string;
    }>;
    topProjects: Array<{
      repositoryName: string;
      description: string;
      readmeShort: string;
      languages: string[];
      score: number;
      strengths: string[];
      areasForImprovement: string[];
      justification: string;
    }>;
  };
}
