/**
 * Data contracts and type definitions for resumes in the Studio feature.
 */

export interface WorkExperienceItem {
  id: string;
  jobTitle: string;
  companyName: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrentRole: boolean;
  context: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degreeName: string;
  institutionName: string;
  graduationYear: string;
  currentStudy?: boolean;
}

export interface CertificationItem {
  id: string;
  certificationName: string;
  issuingOrganization: string;
  grantedYear: string;
  currentStudy?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  score?: number;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface PersonalDetails {
  fullName: string;
  professionalTitle: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  avatarUrl?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  personalDetails: PersonalDetails;
  summary: string;
  skills: SkillCategory[];
  languages: string[];
  experience: WorkExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}
