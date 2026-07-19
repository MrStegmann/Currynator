export interface StepThreeState {
  outputDirectoryPath: string;
}

export interface StepThreeProps {
  state: StepThreeState;
  onChange: (state: StepThreeState) => void;
  onComplete: () => Promise<void>;
}
