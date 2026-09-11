# Data Model: LinkedIn CSV Import

## Feature: 004-linkedin-csv-import

### Entities & Data Structures

#### 1. `LinkedInImportPackage`
Represents the uncompressed contents extracted from the LinkedIn data export ZIP.

```typescript
export interface LinkedInImportPackage {
  profile?: LinkedInProfileRow;
  emails?: LinkedInEmailRow[];
  phones?: LinkedInPhoneRow[];
  positions?: LinkedInPositionRow[];
  education?: LinkedInEducationRow[];
  skills?: LinkedInSkillRow[];
  languages?: LinkedInLanguageRow[];
  projects?: LinkedInProjectRow[];
  certifications?: LinkedInCertificationRow[];
  skippedOptionalFiles: string[];
}
```

#### 2. Raw LinkedIn CSV Row Models

- **`LinkedInProfileRow`**:
  - `First Name`: string
  - `Last Name`: string
  - `Headline`: string
  - `Summary`: string
  - `Address`: string
  - `Zip Code`: string
  - `Geo Location`: string (e.g. `"Fuengirola, Andalusia, Spain"`)
  - `Websites`: string (e.g. `"[PERSONAL:https://patrickjs.vercel.app/]"` or raw URL)

- **`LinkedInEmailRow`**:
  - `Email Address`: string
  - `Confirmed`: `"Yes"` | `"No"`
  - `Primary`: `"Yes"` | `"No"`

- **`LinkedInPhoneRow`**:
  - `Number`: string
  - `Extension`: string

- **`LinkedInPositionRow`**:
  - `Company Name`: string
  - `Title`: string
  - `Started On`: string (e.g. `"Aug 2025"`)
  - `Finished On`: string (e.g. `"Sep 2025"` or empty for current)
  - `Description`: string

- **`LinkedInEducationRow`**:
  - `School Name`: string
  - `Degree Name`: string
  - `Activities`: string
  - `Start Date`: string
  - `End Date`: string

- **`LinkedInSkillRow`**:
  - `Name`: string

- **`LinkedInLanguageRow`**:
  - `Name`: string
  - `Proficiency`: string

- **`LinkedInProjectRow`**:
  - `Title`: string
  - `Description`: string
  - `Url`: string
  - `Started On`: string
  - `Finished On`: string

- **`LinkedInCertificationRow`**:
  - `Name`: string
  - `Authority`: string
  - `Started On`: string
  - `Url`: string

#### 3. `ImportProgressState`
Represents the dynamic status payload communicated to the renderer during import execution.

```typescript
export type ImportStage = 'idle' | 'extracting' | 'parsing' | 'prompting' | 'saving' | 'complete' | 'error';

export interface ImportProgressState {
  stage: ImportStage;
  percentage: number; // 0 to 100
  message: string; // e.g. "Extracting Profile.csv..."
  skippedOptionalFiles: string[]; // List of optional files that were skipped
  error?: string;
}
```

#### 4. Import Mode Option
```typescript
export type ImportMode = 'replace' | 'merge';
```

### Schema Field Transformations (Mapping Rules)

| Source LinkedIn CSV Field | Target Schema Property (`src/main/shared/schema/resumeSchema.ts`) | Transformation Logic |
| :--- | :--- | :--- |
| `Profile.csv` (`First Name` + `Last Name`) | `basics.name` | `${FirstName} ${LastName}`.trim() |
| `Profile.csv` (`Headline`) | `basics.label` | Direct string copy |
| `Profile.csv` (`Summary`) | `basics.summary` | Direct string copy |
| `Profile.csv` (`Address`, `Zip Code`, `Geo Location`) | `basics.location` | Parse `Geo Location` into `city`, `region`, `countryCode` |
| `Profile.csv` (`Websites`) | `basics.url` & `basics.profiles` | Regex extract URL and network label |
| `Email Addresses.csv` (`Email Address`) | `basics.email` | Pick row where `Primary === 'Yes'` or `Confirmed === 'Yes'` |
| `PhoneNumbers.csv` (`Number`, `Extension`) | `basics.phone` | `${Number} ${Extension}`.trim() |
| `Positions.csv` | `work[]` | `name`: Company Name<br>`position`: Title<br>`startDate`: Started On<br>`endDate`: Finished On \|\| `"Currently"`<br>`summary`: Description |
| `Education.csv` | `education[]` | `institution`: School Name<br>`area`: Degree Name \|\| Activities<br>`startDate`: Start Date<br>`endDate`: End Date \|\| `"Currently"` |
| `Skills.csv` | `skills[]` | `name`: Name<br>`keywords`: `[Name]` |
| `Languages.csv` | `languages[]` | `language`: Name<br>`fluency`: Proficiency |
| `Projects.csv` | `projects[]` | `title`: Title<br>`description`: Description<br>`url`: Url<br>`startDate`: Started On<br>`endDate`: Finished On |
| `Certifications.csv` | `certificates[]` | `name`: Name<br>`issuer`: Authority<br>`date`: Started On<br>`url`: Url |
