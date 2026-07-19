export interface BasicInformationState {
  firstName: string;
  lastName: string;
  email: string;
  professionalTitle: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  phonePrefix: string;
  phoneNumber: string;
  city: string;
  country: string;
  context: string;
}

export interface BasicInformationProps {
  state: BasicInformationState;
  onSave: (state: BasicInformationState) => void;
}
