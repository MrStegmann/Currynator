# Data Model: Sticky Header and Granular LinkedIn Import

## Entities & Type Definitions

### 1. Resume Section Key (`ResumeSectionKey`)
Supported sections corresponding to standard JSON Resume schema keys:
```typescript
export type ResumeSectionKey = 
  | 'basics'
  | 'work'
  | 'education'
  | 'certificates'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'references';
```

### 2. Import Resolution Strategy (`ImportResolutionStrategy`)
The resolution choice for a given section:
```typescript
export type ImportResolutionStrategy = 'replace' | 'keep' | 'merge';
```

### 3. Section Option Description (`SectionOptionDescription`)
Descriptor for rendering choices with user-facing explanations:
```typescript
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
```

### 4. Per-Section Resolution Map (`SectionResolutionMap`)
State structure mapping each section key to its selected resolution strategy:
```typescript
export type SectionResolutionMap = Record<ResumeSectionKey, ImportResolutionStrategy>;
```

### 5. Section Conflict Status (`SectionConflictInfo`)
Summary of section data state used by the resolution UI:
```typescript
export interface SectionConflictInfo {
  sectionKey: ResumeSectionKey;
  label: string;
  hasExistingData: boolean;
  hasImportedData: boolean;
  existingCount: number;
  importedCount: number;
}
```

## Section Merge Logic Rules

When `merge` strategy is selected for a section:
- **`basics`**: Keep existing non-empty fields; set imported non-empty fields if existing field is empty. For `profiles` array within basics, deduplicate by `network` + `url`.
- **`work`**: Merge array items, deduplicating by `name` (company) + `position`.
- **`education`**: Merge array items, deduplicating by `institution` + `area`.
- **`certificates`**: Merge array items, deduplicating by `name` + `issuer`.
- **`skills`**: Merge array items, deduplicating by skill `name`; combine unique `keywords`.
- **`languages`**: Merge array items, deduplicating by `language`.
- **`projects`**: Merge array items, deduplicating by project `name`.
- **`references`**: Merge array items, deduplicating by `name`.
