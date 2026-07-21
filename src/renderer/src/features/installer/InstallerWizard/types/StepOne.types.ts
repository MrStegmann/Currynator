export interface StepOneState {
  fullName: string;
  avatarUrl?: string;
  email: string;
  authProviderUsed: 'manual' | 'google' | 'github' | 'linkedin';
}

export interface StepOneProps {
  state: StepOneState;
  onChange: (state: StepOneState) => void;
  onNext: () => void;
  onSkipToStep3: () => void;
  onGithubTokenRetrieved: (token: string) => void;
}
