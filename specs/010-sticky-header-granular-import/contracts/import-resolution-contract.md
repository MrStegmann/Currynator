# Contract: Granular Import Section Resolution

## Interface Definition

```typescript
import { ResumeData } from '../../../shared/types/resume';

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

export interface ResolveSectionImportParams {
  existingData: Partial<ResumeData>;
  importedData: Partial<ResumeData>;
  resolutionMap: SectionResolutionMap;
}

/**
 * Merges or replaces imported resume data into existing resume data according to
 * the per-section resolution choices in `resolutionMap`.
 */
export function applyGranularImportResolution(
  params: ResolveSectionImportParams
): ResumeData;
```

## Contract Guarantee

1. **Section Isolation**: Applying resolution strategy X to section A MUST NOT modify section B.
2. **Deterministic Merge**: Given identical inputs for `existingData`, `importedData`, and `resolutionMap`, `applyGranularImportResolution` MUST yield deterministic results.
3. **No Loss on Keep**: When `resolutionMap[section] === 'keep'`, `output[section]` MUST equal `existingData[section]`.
4. **Complete Overwrite on Replace**: When `resolutionMap[section] === 'replace'`, `output[section]` MUST equal `importedData[section]`.
