export interface StepTwoState {
  tokenProvided: boolean;
}

export interface StepTwoProps {
  githubTokenInput: string;
  onChangeTokenInput: (token: string) => void;
  onNext: () => void;
  onSkip: () => void;
  authProviderUsed: 'manual' | 'google' | 'github';
  onStateChange: (state: StepTwoState) => void;
}
