export interface WorkExperience {
  id: string; // UUID for tracking UI iterations & mutations
  jobTitle: string;
  companyName: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrentRole: boolean;
  context: string;
  highlights: string[]; // Arrays mapping to resume bullets
}

export interface WorkExperienceCardProps {
  experience: WorkExperience;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface WorkExperienceFormModalProps {
  experience?: WorkExperience;
  onSave: (experience: WorkExperience) => void;
  onCancel: () => void;
}
