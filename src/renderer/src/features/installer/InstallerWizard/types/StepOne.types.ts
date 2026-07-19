export interface StepOneState {
  firstName: string;
  lastName: string;
  email: string;
  authProviderUsed: 'manual' | 'google' | 'github';
}

export interface StepOneProps {
  state: StepOneState;
  onChange: (state: StepOneState) => void;
  onNext: () => void;
  onGithubTokenRetrieved: (token: string) => void;
}
