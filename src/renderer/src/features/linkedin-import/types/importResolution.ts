export type ResumeSectionKey =
  | 'basics'
  | 'work'
  | 'education'
  | 'certificates'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'references';

export type ImportResolutionStrategy = 'replace' | 'keep' | 'merge';

export type SectionResolutionMap = Record<ResumeSectionKey, ImportResolutionStrategy>;

export interface SectionOptionDescriptor {
  strategy: ImportResolutionStrategy;
  title: string;
  description: string;
  badgeColor: string;
}

export const RESOLUTION_OPTION_DESCRIPTORS: Record<ImportResolutionStrategy, SectionOptionDescriptor> = {
  replace: {
    strategy: 'replace',
    title: 'Replace',
    description: 'Overwrite existing section data completely with the imported LinkedIn data.',
    badgeColor: 'bg-error/10 text-error border-error/30'
  },
  keep: {
    strategy: 'keep',
    title: 'Keep Original',
    description: 'Retain your current section data and ignore the imported LinkedIn data.',
    badgeColor: 'bg-surface-container-high text-on-surface border-outline-variant'
  },
  merge: {
    strategy: 'merge',
    title: 'Merge',
    description: 'Combine existing section items with imported LinkedIn items without deleting original records.',
    badgeColor: 'bg-primary-container text-on-primary-container border-primary/20'
  }
};

export interface SectionConflictInfo {
  sectionKey: ResumeSectionKey;
  label: string;
  hasExistingData: boolean;
  hasImportedData: boolean;
  existingCount: number;
  importedCount: number;
}
