# Data Model & Schema Contracts: Work Section AI Optimization

## Entity Definitions

### `Work` (Work Experience Item)
Represents a single work experience entry within the resume data model.

```typescript
export interface Work {
  name: string;        // Company / Organization name
  position: string;    // Job title / Role
  url?: string;        // Company or project URL
  startDate: string;   // Start date string (YYYY-MM)
  endDate: string;     // End date or 'Currently'
  summary?: string;    // Role description / summary
  highlights?: string[]; // Bullet-point achievements
}
```

## Validation Rules & Schema Contracts

1. **Schema Preservation**: The output JSON array returned by the Groq API model MUST preserve key names, types, and array length corresponding 1:1 with input items.
2. **Field Sanitization**:
   - `name`: Must remain identical to original.
   - `position`: Polished phrasing string.
   - `url`: Must remain unchanged.
   - `startDate`: Must remain unchanged.
   - `endDate`: Must remain unchanged.
   - `summary`: Improved professional phrasing string.
   - `highlights`: Array of polished achievement bullet strings.
3. **Zod Validation**: Input and output must parse cleanly against `WorkSchema` (and array of `WorkSchema`).
