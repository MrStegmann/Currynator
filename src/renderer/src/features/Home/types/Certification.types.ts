export interface Certification {
  id: string;
  certificationName: string;
  issuingOrganization: string;
  grantedYear: string;
  currentStudy?: boolean;
}

export interface CertificationCardProps {
  certification: Certification;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface CertificationFormModalProps {
  certification?: Certification;
  onSave: (certification: Certification) => void;
  onCancel: () => void;
}
