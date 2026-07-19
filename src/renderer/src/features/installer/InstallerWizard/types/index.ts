import type { StepOneState } from './StepOne.types';
import type { StepTwoState } from './StepTwo.types';
import type { StepThreeState } from './StepThree.types';

export interface InstallerWizardState {
  step1: StepOneState;
  step2: StepTwoState;
  step3: StepThreeState;
}

export * from './StepOne.types';
export * from './StepTwo.types';
export * from './StepThree.types';
