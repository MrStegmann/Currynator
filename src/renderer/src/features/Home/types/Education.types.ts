export interface Education {
  id: string;
  degreeName: string;
  institutionName: string;
  graduationYear: string;
  currentStudy?: boolean;
}

export interface EducationCardProps {
  education: Education;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface EducationFormModalProps {
  education?: Education;
  onSave: (education: Education) => void;
  onCancel: () => void;
}
