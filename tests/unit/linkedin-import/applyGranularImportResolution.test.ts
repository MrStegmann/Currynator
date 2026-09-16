import { applyGranularImportResolution } from '../../../src/renderer/src/features/linkedin-import/utils/applyGranularImportResolution';
import { SectionResolutionMap } from '../../../src/renderer/src/features/linkedin-import/types/importResolution';
import { Resume } from '../../../src/shared/schema/resumeSchema';

describe('applyGranularImportResolution', () => {
  const sampleExistingData: Resume = {
    basics: {
      name: 'John Original',
      email: 'john.original@example.com',
      label: 'Software Engineer',
      phone: '123-456-7890',
      profiles: [{ network: 'GitHub', username: 'johnorig', url: 'https://github.com/johnorig' }]
    },
    work: [
      {
        name: 'TechCorp',
        position: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
        summary: 'Existing work'
      }
    ],
    education: [
      {
        institution: 'State University',
        area: 'Computer Science',
        degree: 'Bachelor',
        startDate: '2016-01-01',
        endDate: '2020-01-01'
      } as any
    ],
    certificates: [
      {
        name: 'AWS Solutions Architect',
        issuer: 'Amazon',
        date: '2021-05-01'
      }
    ],
    skills: [
      {
        name: 'TypeScript',
        keywords: ['Frontend', 'Node']
      }
    ],
    languages: [
      {
        language: 'English',
        fluency: 'Native'
      }
    ],
    references: [],
    projects: []
  };

  const sampleImportedData: Partial<Resume> = {
    basics: {
      name: 'John LinkedIn',
      email: 'john.linkedin@example.com',
      label: 'Staff Engineer',
      summary: 'Imported summary from LinkedIn',
      profiles: [{ network: 'LinkedIn', username: 'johnlinkedin', url: 'https://linkedin.com/in/john' }]
    },
    work: [
      {
        name: 'TechCorp',
        position: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
        summary: 'Updated work summary'
      },
      {
        name: 'New Startup',
        position: 'Lead Engineer',
        startDate: '2022-02-01',
        summary: 'New imported job'
      }
    ],
    education: [
      {
        institution: 'Tech Institute',
        area: 'Data Science',
        startDate: '2022-01-01',
        endDate: '2023-01-01'
      }
    ],
    certificates: [
      {
        name: 'GCP Cloud Engineer',
        issuer: 'Google',
        date: '2023-01-01'
      }
    ],
    skills: [
      {
        name: 'TypeScript',
        keywords: ['React', 'Backend']
      },
      {
        name: 'Python',
        keywords: ['Data Science']
      }
    ],
    languages: [
      {
        language: 'Spanish',
        fluency: 'Intermediate'
      }
    ]
  };

  const defaultKeepAllMap: SectionResolutionMap = {
    basics: 'keep',
    work: 'keep',
    education: 'keep',
    certificates: 'keep',
    skills: 'keep',
    languages: 'keep',
    projects: 'keep',
    references: 'keep'
  };

  it('retains all existing data when strategy is keep for all sections', () => {
    const result = applyGranularImportResolution({
      existingData: sampleExistingData,
      importedData: sampleImportedData,
      resolutionMap: defaultKeepAllMap
    });

    expect(result.basics.name).toBe('John Original');
    expect(result.work).toHaveLength(1);
    expect(result.work?.[0].name).toBe('TechCorp');
    expect(result.education).toHaveLength(1);
    expect(result.certificates).toHaveLength(1);
    expect(result.certificates?.[0].name).toBe('AWS Solutions Architect');
  });

  it('replaces section data completely when strategy is replace for specific sections', () => {
    const map: SectionResolutionMap = {
      ...defaultKeepAllMap,
      work: 'replace',
      certificates: 'replace'
    };

    const result = applyGranularImportResolution({
      existingData: sampleExistingData,
      importedData: sampleImportedData,
      resolutionMap: map
    });

    // Work should be replaced with imported work (2 items)
    expect(result.work).toHaveLength(2);
    expect(result.work?.[0].name).toBe('TechCorp');
    expect(result.work?.[1].name).toBe('New Startup');

    // Certificates replaced with imported certificates (1 new item)
    expect(result.certificates).toHaveLength(1);
    expect(result.certificates?.[0].name).toBe('GCP Cloud Engineer');

    // Basics and education should stay original
    expect(result.basics.name).toBe('John Original');
    expect(result.education).toHaveLength(1);
  });

  it('merges sections correctly when strategy is merge', () => {
    const map: SectionResolutionMap = {
      ...defaultKeepAllMap,
      basics: 'merge',
      work: 'merge',
      skills: 'merge',
      languages: 'merge'
    };

    const result = applyGranularImportResolution({
      existingData: sampleExistingData,
      importedData: sampleImportedData,
      resolutionMap: map
    });

    // Basics: keeps original name but fills missing summary
    expect(result.basics.name).toBe('John Original');
    expect(result.basics.summary).toBe('Imported summary from LinkedIn');
    expect(result.basics.profiles).toHaveLength(2);

    // Work: deduplicates TechCorp Senior Developer and adds New Startup
    expect(result.work).toHaveLength(2);
    expect(result.work?.map(w => w.name)).toContain('TechCorp');
    expect(result.work?.map(w => w.name)).toContain('New Startup');

    // Skills: merges TypeScript keywords (Frontend, Node, React, Backend) and adds Python
    expect(result.skills).toHaveLength(2);
    const tsSkill = result.skills?.find(s => s.name === 'TypeScript');
    expect(tsSkill?.keywords).toEqual(expect.arrayContaining(['Frontend', 'Node', 'React', 'Backend']));

    // Languages: retains English and adds Spanish
    expect(result.languages).toHaveLength(2);
    expect(result.languages?.map(l => l.language)).toContain('English');
    expect(result.languages?.map(l => l.language)).toContain('Spanish');
  });
});
