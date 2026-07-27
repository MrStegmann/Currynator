import type { ResumeData, ProjectItem } from '../types/resume.types';

/**
 * Generates a default populated ResumeData object by merging profile data
 * from profile.service.ts and top GitHub project defaults.
 * @returns Promise resolving to a pre-populated ResumeData structure.
 */
export async function createDefaultResume(): Promise<ResumeData> {
  let userProfile: any = null;

  try {
    const res = await window.electronAPI?.getProfile();
    if (res?.success && res.data) {
      userProfile = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch user profile for resume default:', error);
  }

  // Load and score GitHub project defaults
  let selectedProjects: ProjectItem[] = [];
  try {
    const cached = localStorage.getItem('githubProfileData');
    if (cached) {
      const parsed = JSON.parse(cached);
      const rawProjects: any[] = parsed?.profile?.projects || parsed?.projects || [];

      if (rawProjects.length > 0) {
        // Filter scored projects
        const scored = rawProjects
          .filter((p) => typeof p.statusScore === 'string' && p.statusScore === "score")
          .sort((a, b) => (b.scores.globalScore || 0) - (a.scores.globalScore || 0));

        let top3 = scored.slice(0, 3);

        // Fallback to most recent in reverse order if unscored
        if (top3.length < 3) {
          const remainingNeeded = 3 - top3.length;
          const scoredIds = new Set(top3.map((p) => p.id || p.name));
          const unscored = [...rawProjects]
            .reverse()
            .filter((p) => !scoredIds.has(p.id || p.name));
          top3 = [...top3, ...unscored.slice(0, remainingNeeded)];
        }

        selectedProjects = top3.map((p) => ({
          id: p.id || String(Math.random()),
          name: p.name || 'Project Name',
          description: p.description || 'Project description and highlights.',
          technologies: Array.isArray(p.languages) ? p.languages : ['TypeScript', 'React'],
          githubUrl: p.html_url || p.url || '',
          score: p.score
        }));
      }
    }
  } catch (error) {
    console.error('Failed to extract GitHub projects for default resume:', error);
  }

  const newId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const now = new Date().toISOString();

  return {
    id: newId,
    title: `Software Engineer CV ${new Date().toLocaleDateString()}`,
    description: 'Auto-populated template from profile & GitHub repository stats',
    createdAt: now,
    updatedAt: now,
    personalDetails: {
      fullName: userProfile?.fullName || 'Full Name',
      professionalTitle: userProfile?.professionalTitle || 'Software Engineer',
      email: userProfile?.email || 'engineer@example.com',
      phoneNumber: userProfile?.phoneNumber ? `${userProfile?.phonePrefix || ''} ${userProfile?.phoneNumber}`.trim() : '',
      location: [userProfile?.city, userProfile?.country].filter(Boolean).join(', ') || 'City, Country',
      linkedinUrl: userProfile?.linkedinUrl || '',
      githubUrl: userProfile?.githubUrl || '',
      websiteUrl: userProfile?.websiteUrl || '',
      avatarUrl: userProfile?.avatarUrl || ''
    },
    summary: userProfile?.context || 'Detail-oriented and results-driven Software Engineer with expertise in building scalable frontend applications and modular desktop/web platforms.',
    skills: [
      {
        category: 'Core Technologies',
        skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Electron', 'Tailwind CSS']
      },
      {
        category: 'Architecture & Tools',
        skills: ['Git', 'REST APIs', 'System Design', 'Agile Methodologies', 'Jest']
      }
    ],
    languages: ['English (Professional)', 'Spanish (Native)'],
    experience: Array.isArray(userProfile?.experience) && userProfile.experience.length > 0
      ? userProfile.experience.map((exp: any) => ({
        id: exp.id || String(Math.random()),
        jobTitle: exp.jobTitle || 'Role Title',
        companyName: exp.companyName || 'Company Name',
        startMonth: exp.startMonth || 'Jan',
        startYear: exp.startYear || '2022',
        endMonth: exp.endMonth,
        endYear: exp.endYear,
        isCurrentRole: !!exp.isCurrentRole,
        context: exp.context || '',
        highlights: Array.isArray(exp.highlights) && exp.highlights.length > 0
          ? exp.highlights
          : ['Led development of high-impact features and system optimizations.']
      }))
      : [
        {
          id: 'exp_1',
          jobTitle: 'Senior Full Stack Engineer',
          companyName: 'Tech Innovations Inc.',
          startMonth: 'Jan',
          startYear: '2023',
          isCurrentRole: true,
          context: 'Leading core web and desktop application development.',
          highlights: [
            'Architected modular React/Electron interfaces serving real-time user workflows.',
            'Improved performance metrics by 35% through query optimization and lazy loading.'
          ]
        }
      ],
    education: Array.isArray(userProfile?.education) && userProfile.education.length > 0
      ? userProfile.education.map((edu: any) => ({
        id: edu.id || String(Math.random()),
        degreeName: edu.degreeName || 'B.S. in Computer Science',
        institutionName: edu.institutionName || 'University',
        graduationYear: edu.graduationYear || '2022',
        currentStudy: !!edu.currentStudy
      }))
      : [
        {
          id: 'edu_1',
          degreeName: 'Bachelor of Science in Computer Science',
          institutionName: 'State University',
          graduationYear: '2022'
        }
      ],
    projects: selectedProjects.length > 0 ? selectedProjects : [
      {
        id: 'proj_1',
        name: 'Currynator Platform',
        description: 'Modular desktop application built with Electron, React, and TypeScript.',
        technologies: ['TypeScript', 'React', 'Electron', 'Tailwind CSS']
      }
    ],
    certifications: Array.isArray(userProfile?.certifications) && userProfile.certifications.length > 0
      ? userProfile.certifications.map((c: any) => ({
        id: c.id || String(Math.random()),
        certificationName: c.certificationName || 'Certification',
        issuingOrganization: c.issuingOrganization || 'Provider',
        grantedYear: c.grantedYear || '2023',
        currentStudy: !!c.currentStudy
      }))
      : [
        {
          id: 'cert_1',
          certificationName: 'AWS Certified Solutions Architect',
          issuingOrganization: 'Amazon Web Services',
          grantedYear: '2023'
        }
      ]
  };
}
