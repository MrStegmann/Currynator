import { Resume } from '../../../../../shared/schema/resumeSchema';
import { SectionResolutionMap, ResumeSectionKey } from '../types/importResolution';

export interface ResolveSectionImportParams {
  existingData: Partial<Resume>;
  importedData: Partial<Resume>;
  resolutionMap: SectionResolutionMap;
}

export function applyGranularImportResolution({
  existingData,
  importedData,
  resolutionMap
}: ResolveSectionImportParams): Resume {
  const result: Resume = {
    basics: {
      name: existingData.basics?.name || importedData.basics?.name || '',
      label: existingData.basics?.label || importedData.basics?.label || '',
      image: existingData.basics?.image || importedData.basics?.image || '',
      email: existingData.basics?.email || importedData.basics?.email || '',
      phone: existingData.basics?.phone || importedData.basics?.phone || '',
      url: existingData.basics?.url || importedData.basics?.url || '',
      summary: existingData.basics?.summary || importedData.basics?.summary || '',
      location: { ...(existingData.basics?.location || {}), ...(importedData.basics?.location || {}) },
      profiles: existingData.basics?.profiles || []
    },
    work: existingData.work || [],
    education: existingData.education || [],
    certificates: existingData.certificates || [],
    skills: existingData.skills || [],
    languages: existingData.languages || [],
    references: existingData.references || [],
    projects: existingData.projects || []
  };

  // 1. Basics Section
  const basicsStrategy = resolutionMap.basics;
  if (basicsStrategy === 'replace') {
    if (importedData.basics) {
      result.basics = { ...importedData.basics };
    }
  } else if (basicsStrategy === 'merge' && importedData.basics) {
    const origBasics = existingData.basics || {};
    const impBasics = importedData.basics;

    result.basics = {
      name: origBasics.name || impBasics.name || '',
      label: origBasics.label || impBasics.label || '',
      image: origBasics.image || impBasics.image || '',
      email: origBasics.email || impBasics.email || '',
      phone: origBasics.phone || impBasics.phone || '',
      url: origBasics.url || impBasics.url || '',
      summary: origBasics.summary || impBasics.summary || '',
      location: {
        address: origBasics.location?.address || impBasics.location?.address,
        postalCode: origBasics.location?.postalCode || impBasics.location?.postalCode,
        city: origBasics.location?.city || impBasics.location?.city,
        countryCode: origBasics.location?.countryCode || impBasics.location?.countryCode,
        region: origBasics.location?.region || impBasics.location?.region
      },
      profiles: mergeProfiles(origBasics.profiles || [], impBasics.profiles || [])
    };
  } else {
    // Keep
    if (existingData.basics) {
      result.basics = { ...existingData.basics };
    }
  }

  // Helper for array section handling
  const resolveArraySection = <T>(
    key: ResumeSectionKey,
    existingItems: T[] | undefined,
    importedItems: T[] | undefined,
    dedupFn: (existingList: T[], importedList: T[]) => T[]
  ): T[] => {
    const strategy = resolutionMap[key];
    const orig = existingItems || [];
    const imp = importedItems || [];

    if (strategy === 'replace') {
      return imp.length > 0 ? imp : orig;
    }
    if (strategy === 'merge') {
      return dedupFn(orig, imp);
    }
    // keep
    return orig;
  };

  // 2. Work
  result.work = resolveArraySection(
    'work',
    existingData.work,
    importedData.work,
    (orig, imp) => {
      const merged = [...orig];
      imp.forEach(item => {
        const isDup = orig.some(
          o => (o.name || '').toLowerCase() === (item.name || '').toLowerCase() &&
               (o.position || '').toLowerCase() === (item.position || '').toLowerCase()
        );
        if (!isDup) {
          merged.push(item);
        }
      });
      return merged;
    }
  );

  // 3. Education
  result.education = resolveArraySection(
    'education',
    existingData.education,
    importedData.education,
    (orig, imp) => {
      const merged = [...orig];
      imp.forEach(item => {
        const isDup = orig.some(
          o => (o.institution || '').toLowerCase() === (item.institution || '').toLowerCase() &&
               (o.area || '').toLowerCase() === (item.area || '').toLowerCase()
        );
        if (!isDup) {
          merged.push(item);
        }
      });
      return merged;
    }
  );

  // 4. Certificates
  result.certificates = resolveArraySection(
    'certificates',
    existingData.certificates,
    importedData.certificates,
    (orig, imp) => {
      const merged = [...orig];
      imp.forEach(item => {
        const isDup = orig.some(
          o => (o.name || '').toLowerCase() === (item.name || '').toLowerCase() &&
               (o.issuer || '').toLowerCase() === (item.issuer || '').toLowerCase()
        );
        if (!isDup) {
          merged.push(item);
        }
      });
      return merged;
    }
  );

  // 5. Skills
  result.skills = resolveArraySection(
    'skills',
    existingData.skills,
    importedData.skills,
    (orig, imp) => {
      const skillMap = new Map<string, { name: string; keywords: string[] }>();
      orig.forEach(s => {
        if (s.name) {
          skillMap.set(s.name.toLowerCase(), {
            name: s.name,
            keywords: [...(s.keywords || [])]
          });
        }
      });

      imp.forEach(s => {
        if (!s.name) return;
        const key = s.name.toLowerCase();
        if (skillMap.has(key)) {
          const existingSkill = skillMap.get(key)!;
          const combinedKw = Array.from(new Set([...existingSkill.keywords, ...(s.keywords || [])]));
          skillMap.set(key, { name: existingSkill.name, keywords: combinedKw });
        } else {
          skillMap.set(key, { name: s.name, keywords: [...(s.keywords || [])] });
        }
      });

      return Array.from(skillMap.values());
    }
  );

  // 6. Languages
  result.languages = resolveArraySection(
    'languages',
    existingData.languages,
    importedData.languages,
    (orig, imp) => {
      const merged = [...orig];
      imp.forEach(item => {
        const isDup = orig.some(
          o => (o.language || '').toLowerCase() === (item.language || '').toLowerCase()
        );
        if (!isDup) {
          merged.push(item);
        }
      });
      return merged;
    }
  );

  // 7. References
  result.references = resolveArraySection(
    'references',
    existingData.references,
    importedData.references,
    (orig, imp) => {
      const merged = [...orig];
      imp.forEach(item => {
        const isDup = orig.some(
          o => (o.name || '').toLowerCase() === (item.name || '').toLowerCase()
        );
        if (!isDup) {
          merged.push(item);
        }
      });
      return merged;
    }
  );

  // 8. Projects
  result.projects = resolveArraySection(
    'projects',
    existingData.projects,
    importedData.projects,
    (orig, imp) => {
      const merged = [...orig];
      imp.forEach(item => {
        const isDup = orig.some(
          o => (o.name || '').toLowerCase() === (item.name || '').toLowerCase()
        );
        if (!isDup) {
          merged.push(item);
        }
      });
      return merged;
    }
  );

  return result;
}

function mergeProfiles(
  existingProfiles: { network?: string; username?: string; url?: string }[],
  importedProfiles: { network?: string; username?: string; url?: string }[]
) {
  const merged = [...existingProfiles];
  importedProfiles.forEach(imp => {
    const isDup = existingProfiles.some(
      ex => (ex.network || '').toLowerCase() === (imp.network || '').toLowerCase() ||
            (ex.url && imp.url && ex.url === imp.url)
    );
    if (!isDup) {
      merged.push(imp);
    }
  });
  return merged;
}
