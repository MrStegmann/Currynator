# Feature Specification: Home Screen (User CV Profile)

## Status

* **Status:** IN PROGRESS
* **Target Module:** `src/renderer/src/features/home/`

---

## 1. Overview
The Home view serves as the primary landing page and dashboard for the application. It aggregates all the structural information required to generate a professional CV. The page architecture is split into four distinct sections, managed through localized state or a reactive store.

## 2. Architecture & Layout
Home is one column w-full, p-5, composed by 4 sections:
- **Section 1:** Have a header with h2 text-left and text "Información Básica". Must have a border-bottom-2, mb-3. A body is a form grid with 2 columns w-1/2 with gap-3 between fields. Left column with inputs firstName (text input), lastName (text input), email (email input), country (Dropdown List), City (Dinamic dropdown List). Right column with input professional title (text input), professional summary (Big TextArea), GitHub profile (Url text input), and LinkedIn profile (Url text input) and website/portfolio url (Url text input). Have a footer with a button to save all the info change.
- **Section 2:** Have a header with flex-row space-between, h2 text-left and text "Experiencia Laboral" and button [Add Role] (button with icon +) text "Añadir". Must have a border-bottom-2, mb-3. A body is a container that holds the experience cards. Button "+ Añadir" opens a Modal Dialogue with experience card form.
    - **WorkCard:** Header with two rows and 2 columns: First row is flex-row justify-between with h2 with Title Job / Role, and Start Date and End Date as mm/yyyy. End Date also can be a text "Actually" if checkbox currenInJob is true. Second row has a h3 with company name. Body has two rows 2-full. First row must be context. Second row  must be a ul>li hightlighted achievements. Footer with buttons Edit and Delete.
    - **WorkFormModal:** A modal dialog that opens when the user clicks "+ Añadir". It must have a form with the following fields: Title Job / Role (text input), Company name (text input), Start Date (date input), End Date (date input), currentInJob (checkbox), context (textarea), highlighted achievements (dinamicaly input). Footer with buttons Save and Cancel.
- **Section 3:** Have a header with flex-row space-between, h2 text-left and text "Educación" and button [Add Education] (button with icon +) text "Añadir". Must have a border-bottom-2, mb-3. A body is a container that holds the education cards. Button "+ Añadir" opens a Modal Dialogue with education card form.
    - **EducationCard:** Header with two rows and 2 columns: First row is flex-row justify-between with h2 with degreeName, and Gradutation year yyyy. Graduation year can also be "Currently" if checkbox CurrentStudy is true. Second row has a h3 with Institution name. Footer with buttons Edit and Delete.
    - **EducationFormModal:** A modal dialog that opens when the user clicks "+ Añadir". It must have a form with the following fields: degreeName (text input), Institution name (text input), Graduation year (date input), CurrentStudy (checkbox). Footer with buttons Save and Cancel.
- **Section 4:** Have a header with flex-row space-between, h2 text-left and text "Certificados" and button [Add Certificate] (button with icon +) text "Añadir". Must have a border-bottom-2, mb-3. A body is a container that holds the certification cards. Button "+ Añadir" opens a Modal Dialogue with certification card form.
    - **CertificationCard:** Header with two rows and 2 columns: First row is flex-row justify-between with h2 with Certificate name, and Issuer year yyyy. Issuer can be a text, and Year can also be "Currently" if checkbox CurrentStudy is true. Second row has a h3 with issuingOrganization name. Footer with buttons Edit and Delete.
    - **CertificationFormModal:** A modal dialog that opens when the user clicks "+ Añadir". It must have a form with the following fields: certificationName (text input), issuingOrganizationNname (text input), grantedYear (date input), CurrentStudy (checkbox). Footer with buttons Save and Cancel.
## 3. Data Models (TypeScript Schemas)
```typescript
export interface UserProfile {
  // Section 1: Core Details
  firstName: string;
  lastName: string;
  email: string;
  professionalTitle: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  phonePrefix: string;
  phoneNumber: string;
  city: string;
  country: string;

  // Arrays for Sections 2, 3, and 4
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
}

export interface WorkExperience {
  id: string; // UUID for tracking UI iterations & mutations
  jobTitle: string;
  companyName: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrentRole: boolean;
  context: string;
  highlights: string[]; // Arrays mapping to resume bullets
}

export interface Education {
  id: string;
  degreeName: string;
  institutionName: string;
  graduationYear: string;
}

export interface Certification {
  id: string;
  certificationName: string;
  issuingOrganization: string;
  grantedYear: string;
}
```
## 4. UI/UX & Functional Requirements
### Modal Behaviors
**Context Safety:** Clicking outside a modal or pressing ESC must not close it.

**Validation Rules:**
**URL fields** must perform basic format validation (https://...).

If **isCurrentRole** is ticked, the **end date** selectors must clear and **disable**.
If **currentStudy** is ticked, the **graduationYear** and **grantedYear** input must clear and **disable**.

Date checks must prevent an endYear/endMonth chronologically prior to the start parameters.

### Data Mutation Flow
**Add Operations:** Generates a unique id via crypto API, appends the new entity object to its respective data array, and updates storage.

**Edit Operations:** Loads the object matching the card id into form modal local states. Saving modifications maps changes onto the array index without modifying order parameters.

**Delete Operations:** Filters out the selected item id from the array. The deletion must trigger a soft verification dialog to prevent accidental button layout execution.

## 5. Github Metrics
Github Metrics will be refactor to own page. You must delete this section from Home page.

## 6. File structure
├── Home/      # Home page
│   ├── components/     # Home components
│   │   ├── BasicInformation.tsx
│   │   ├── work/
│   │   │   ├── WorkExperienceCard.tsx
│   │   │   └── WorkExperienceFormModal.tsx
│   │   ├── education/
│   │   │   ├── EducationCard.tsx
│   │   │   └── EducationFormModal.tsx
│   │   └── certification/
│   │       ├── CertificationCard.tsx
│   │       └── CertificationFormModal.tsx
│   ├── services/     # Home services
│   │   ├── BasicInformation.service.ts
│   │   ├── WorkExperience.service.ts
│   │   ├── Education.service.ts
│   │   └── Certification.service.ts
│   ├── types/     # Home types
│   │   ├── BasicInformation.types.ts
│   │   ├── WorkExperience.types.ts
│   │   ├── Education.types.ts
│   │   └── Certification.types.ts
│   ├── utils/     # Utilities functions
│   │   ├── BasicInformation.utils.ts
│   │   ├── WorkExperience.utils.ts
│   │   ├── Education.utils.ts
│   │   └── Certification.utils.ts
│   └── index.tsx     # Home core


## 7. Persistant Storage
Save data must be saved persistantly using ipcMain. Actually, firstName, lastName and email is saved by using handler `save-settings`. This will be a deprecated behavior.
For this new feature, we need a new handler with centraliced handlers: `save-profile` and `get-profile`.

- Handlers must be in src\main\ipc
- Services must be in src\main\services

Wizard Installer must be refactored in order to use `save-profile` and `get-profile` insted `save-settings`. Home must use `get-profile` to load data and `save-profile` to save data.