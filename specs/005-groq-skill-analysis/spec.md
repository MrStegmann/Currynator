# Feature Specification: Groq API Skill Analysis & Categorization

**Feature Branch**: `005-groq-skill-analysis`

**Created**: 2026-09-12

**Status**: Draft

**Input**: User description: "Groq API Skill Analysis & Categorization - Import LinkedIn Skills CSV, send skill data to Groq API using a dedicated controller and structured system prompt to filter, evaluate, and categorize skills into allowed tech stacks (including Non-Elemental and Non-grouped). Render categorized skills in the Home View, displaying an adjacent floating label 'Skills no necesarias/prescindibles' for Non-Elemental skills with an interactive hover tooltip."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Skill Categorization via Groq API (Priority: P1)

As a candidate uploading my resume data, after importing my LinkedIn Skills CSV file, I want the system to automatically analyze, filter, and categorize my skills using AI so that they are organized into professional tech stack categories for my CV.

**Why this priority**: Core value proposition of the feature — transforming raw imported skill strings into structured, resume-ready skill categories.

**Independent Test**: Can be tested by providing raw CSV skill entries and verifying that the system successfully returns structured skill categories matching the JSON Resume schema without conversational text or invalid formatting.

**Acceptance Scenarios**:

1. **Given** a user has imported a LinkedIn `Skills.csv` file, **When** the skill analysis process is triggered, **Then** the system sends the raw skills to the Groq service with the mandatory system prompt and headers ignored.
2. **Given** the Groq service processes the skill list, **When** the response is returned, **Then** the system parses the JSON array containing category names (`name`) and lists of skills (`keywords`) matching the allowed categories.
3. **Given** useful skills do not match a specific primary tech stack, **When** categorized, **Then** they are assigned to the `Non-grouped` category.
4. **Given** skills are identified as redundant, outdated, ambiguous, or bad practice, **When** categorized, **Then** they are grouped under the `Non-Elemental` category.

---

### User Story 2 - Non-Elemental Category Visual Indicator & Tooltip (Priority: P2)

As a user reviewing my categorized skills in the Home View, I want to see a distinct indicator next to skills grouped under "Non-Elemental" so that I understand why certain skills are flagged as unnecessary or dispensable.

**Why this priority**: Enhances transparency and guides the user on resume optimization choices.

**Independent Test**: Can be tested by rendering a categorized skills view containing a "Non-Elemental" category and checking for the presence of the floating label and hover tooltip interaction.

**Acceptance Scenarios**:

1. **Given** the Home View renders the categorized skills list, **When** a `Non-Elemental` category block or skill item is displayed, **Then** an adjacent floating label is shown anchored to the right with the exact text `Skills no necesarias/prescindibles`.
2. **Given** the user views the floating label `Skills no necesarias/prescindibles`, **When** the user hovers over the label and holds the cursor steady, **Then** a tooltip appears displaying the definition: *"Non-Elemental se refiere a habilidades que son redundantes, excesivamente genéricas, obsoletas, ambiguas o consideradas malas prácticas cuando se incluyen en un currículum profesional."*
3. **Given** the tooltip is visible, **When** the user moves the cursor away from the label, **Then** the tooltip smoothly hides.

---

### User Story 3 - Secure API Configuration & Graceful Error Handling (Priority: P3)

As a system administrator or developer, I want the Groq API integration to securely utilize environment variables and gracefully handle network timeouts or malformed responses so that the application remains secure and stable.

**Why this priority**: Critical for security compliance and software reliability during API outages or credential misconfigurations.

**Independent Test**: Can be tested by invoking the skill categorization service with missing credentials or simulated network failures to verify error handling and key isolation.

**Acceptance Scenarios**:

1. **Given** the application environment is initialized, **When** configuring API credentials, **Then** the system reads `GROQ_API_KEY` exclusively from environment variables (with `.env.example` updated) and never exposes secrets in source code.
2. **Given** an API call to Groq fails due to invalid key, timeout, or network disconnect, **When** the controller detects the error, **Then** a clear user-facing notification is displayed and system state is preserved without crashing.
3. **Given** Groq returns output wrapped in unexpected text or invalid markdown formatting, **When** the controller parses the response, **Then** the parsing mechanism extracts strictly valid JSON or triggers a retry/error fallback handler.

---

### Edge Cases

- What happens when `Skills.csv` is empty or only contains header rows? The system notifies the user that no skills were found to evaluate before sending API requests.
- How does the system handle Groq API rate limits (HTTP 429) or extended timeouts? The service catches the exception, logs a standard warning, and presents a retry option to the user without losing local state.
- What happens if all skills in a CSV are categorized as `Non-Elemental`? The Home View renders the category with the floating label and tooltip, allowing the user to review or re-evaluate their skills.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST process imported `Skills.csv` data by stripping table headers (first row) before processing skill items.
- **FR-002**: System MUST communicate with the Groq service via a dedicated controller managing SDK calls, request timeouts, and error handling.
- **FR-003**: System MUST execute Groq API requests using a structured prompt containing task guidelines, evaluation criteria, allowed categories list, and strict JSON output requirements.
- **FR-004**: System MUST constrain skill categorization to the following allowed categories:
  - `Programming Languages`
  - `Backend, Frameworks & Libraries`
  - `Frontend & Web Development`
  - `Databases & Storage`
  - `Tools & Environments`
  - `Cloud, DevOps & Infrastructure`
  - `Version Control & Workflows`
  - `Testing & Quality Assurance`
  - `Architecture & Patterns`
  - `Methodologies & Management`
  - `Non-Elemental`
  - `Non-grouped`
- **FR-005**: System MUST enforce that API responses consist strictly of valid JSON arrays containing objects with `name` (string category) and `keywords` (array of string skill names) attributes.
- **FR-006**: System MUST load `GROQ_API_KEY` exclusively from process environment variables and document key usage in `.env.example` without hardcoding production secrets.
- **FR-007**: Home View MUST display a floating text label anchored to the right of `Non-Elemental` category headers/items with the text `Skills no necesarias/prescindibles`.
- **FR-008**: Home View MUST display a hover tooltip when the user pauses their cursor over the `Skills no necesarias/prescindibles` label with the text: *"Non-Elemental se refiere a habilidades que son redundantes, excesivamente genéricas, obsoletas, ambiguas o consideradas malas prácticas cuando se incluyen en un currículum profesional."*
- **FR-009**: System MUST update and persist the user's categorized skills in accordance with the JSON Resume data model.

### Key Entities

- **Raw Skill Input**: Array of skill strings extracted from the imported `Skills.csv` file (excluding header row).
- **Categorized Skill Group**: Object containing a category `name` (matching allowed categories) and a list of `keywords` (string skill names).
- **Groq Controller Configuration**: Service parameters specifying API endpoint settings, environment variable bindings (`GROQ_API_KEY`), timeout thresholds, and retry policy.
- **Floating Indicator & Tooltip State**: UI component state representing label visibility, hover interaction state, and localized explanation text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of imported skills from valid CSV files are parsed and assigned to an allowed category or fallback category (`Non-grouped`).
- **SC-002**: 100% of successful Groq API responses are correctly parsed into valid category-keyword JSON arrays without syntax errors.
- **SC-003**: Zero production secrets or API keys are committed to source control; `GROQ_API_KEY` is completely isolated in environment configuration.
- **SC-004**: The `Skills no necesarias/prescindibles` floating label and interactive tooltip render within 100ms of category display in the Home View.
- **SC-005**: In the event of network or API timeouts, error feedback is presented to the user within 5 seconds with zero unhandled application crashes.

## Assumptions

- The user has already completed or can access the LinkedIn CSV import flow to supply raw skill entries.
- The `GROQ_API_KEY` is configured in `.env` for local execution or runtime environment parameters.
- Category names strictly adhere to Spanish/English UI conventions as defined in the system prompt and JSON Resume specifications.
- Network connectivity to Groq API endpoints is available during skill analysis operations.
