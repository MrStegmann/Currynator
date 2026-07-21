import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface WorkExperience {
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

export interface Education {
  id: string;
  degreeName: string;
  institutionName: string;
  graduationYear: string;
  currentStudy?: boolean;
}

export interface Certification {
  id: string;
  certificationName: string;
  issuingOrganization: string;
  grantedYear: string;
  currentStudy?: boolean;
}

export interface UserProfile {
  fullName: string;
  avatarUrl?: string;
  email: string;
  professionalTitle: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  phonePrefix: string;
  phoneNumber: string;
  city: string;
  country: string;
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
}

export const getProfileFilePath = () => {
  return path.join(app.getPath('userData'), 'profile.json');
};

export const getDefaultProfile = (): UserProfile => {
  return {
    fullName: '',
    email: '',
    professionalTitle: '',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
    phonePrefix: '',
    phoneNumber: '',
    city: '',
    country: '',
    experience: [],
    education: [],
    certifications: []
  };
};

export const readProfile = async (): Promise<UserProfile> => {
  const filePath = getProfileFilePath();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Migration: Convert firstName/lastName to fullName
    if (parsed.firstName !== undefined || parsed.lastName !== undefined) {
      if (!parsed.fullName) {
        parsed.fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim();
      }
      delete parsed.firstName;
      delete parsed.lastName;
    }
    
    return { ...getDefaultProfile(), ...parsed };
  } catch (error) {
    return getDefaultProfile();
  }
};

export const saveProfile = async (profileUpdate: Partial<UserProfile>): Promise<UserProfile> => {
  const currentProfile = await readProfile();
  const newProfile = { ...currentProfile, ...profileUpdate };
  const filePath = getProfileFilePath();
  
  await fs.writeFile(filePath, JSON.stringify(newProfile, null, 2), 'utf-8');
  return newProfile;
};
