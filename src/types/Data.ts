export interface Location {
    address: string;
    postalCode: string;
    city: string;
    countryCode: string;
    region: string;
}

export interface Profile {
    network: string;
    username: string;
    url: string;
}

export interface Basics {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: Location;
    profiles: Profile[];
}

export interface Work {
    id: string; // custom field for React keys
    name: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
}

export interface Education {
    id: string; // custom field for React keys
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score: string;
    courses: string[];
}

export interface Certificate {
    id: string; // custom field for React keys
    name: string;
    date: string;
    issuer: string;
    url: string;
}

export interface Project {
    id: string; // custom field for React keys
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    highlights: string[];
    url: string;
    keywords: string[];
    roles: string[];
}

export interface Skill {
    name: string;
    level: string;
    keywords: string[];
}

export interface Language {
    language: string;
    fluency: string;
}

export interface Interest {
    name: string;
    keywords: string[];
}

export interface Reference {
    name: string;
    reference: string;
}

export interface DataProfile {
    id: string;
    profileLabel: string;
    lastUpdated: string;
    
    // JSON Resume fields
    basics: Basics;
    work: Work[];
    education: Education[];
    certificates: Certificate[];
    skills: Skill[];
    languages: Language[];
    projects: Project[];
    interests: Interest[];
    references: Reference[];
}