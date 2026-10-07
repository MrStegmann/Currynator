# Contract: Date Sorting Utility (`dateSorting.ts`)

## Module Signature

```typescript
export interface ChronologicalItem {
  startDate?: string | null;
  endDate?: string | null;
  date?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

/**
 * Universal comparator that orders items from newest (most recent) to oldest.
 * Ongoing/current items are prioritized at the top.
 */
export function compareDatesDescending<T extends ChronologicalItem>(a: T, b: T): number;

/**
 * Returns a new array sorted from newest to oldest.
 * Does not mutate the source array.
 */
export function sortChronologicalDescending<T extends ChronologicalItem>(items: T[] | undefined | null): T[];
```

## Behavior Contract

1. **Ongoing Roles & Present Items**:
   - If `endDate` is empty/falsy or matches `/(current|present|actual|actualmente|hoy)/i` while `startDate` exists, effective end date is treated as ongoing (`+Infinity`).
   - If both items are ongoing, they are sorted descending by `startDate`.

2. **Standard Date Parsing**:
   - Parses ISO strings (`2024-03-15T12:00:00Z`), standard dates (`2024-03-15`), year-month (`2024-03`), and year only (`2024`).
   - Single date properties (`date` in Certificates, `updated_at` in GitHub Projects) are evaluated as the primary date.

3. **Missing & Invalid Dates**:
   - Items with invalid or missing date strings are placed at the end of the array with stable relative ordering.
   - Null or undefined inputs safely return empty arrays `[]`.
