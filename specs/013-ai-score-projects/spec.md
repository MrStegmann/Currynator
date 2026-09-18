# Feature Specification: AI Score Projects

**Feature Branch**: `013-ai-score-projects`

**Created**: 2026-09-18

**Status**: Draft

**Input**: User description: "Make each Project Card Item selectable and a floating button beside to the refresh button that send the projects to a new Groq API Service via GroqController.ts where the AI MUST score the projects selected. Update Spec 013: To the JSON score output from Groq Service add an improvement key that contain a list of bullet point of improvement suggestions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select and Score Specific Projects (Priority: P1)

As a user viewing project cards, I want to select specific project items using a checkbox/toggle on each card and trigger AI scoring via a floating action button so that I can evaluate selected repositories on demand.

**Why this priority**: Core workflow allowing targeted AI analysis on individual or multiple selected project repositories.

**Independent Test**: Select one or more project cards, click the AI score floating action button, verify that only the selected projects are sent for scoring and their score breakdowns, improvement suggestions, and total scores (1-100) are rendered on the cards.

**Acceptance Scenarios**:

1. **Given** a list of project cards, **When** the user clicks the selection checkbox on one or multiple cards, **Then** the cards enter a selected state and display visual selection indicators.
2. **Given** one or more project cards are selected, **When** the user clicks the AI score FAB beside the refresh button, **Then** the system sends the selected projects to the AI service for evaluation without opening a confirmation modal.
3. **Given** selected projects sent to the AI service, **When** scoring completes, **Then** each evaluated project card displays its total score (1–100), structured log breakdown, and bullet-point improvement suggestions for each evaluation criterion.

---

### User Story 2 - Score All Projects with Confirmation Modal (Priority: P2)

As a user viewing project cards with no items explicitly selected, I want clicking the AI score floating action button to prompt me with a confirmation modal informing me about project count and potential AI rate limits before scoring all available projects one-by-one.

**Why this priority**: Prevents accidental batch invocation of AI scoring across all repositories while informing users of AI rate limits and providing a convenient way to evaluate the entire project list.

**Independent Test**: Deselect all projects, click the AI score FAB, verify confirmation modal displays containing `${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.`. Confirming modal parses and scores all projects sequentially.

**Acceptance Scenarios**:

1. **Given** no project cards are selected (0 selected), **When** the user clicks the AI score FAB, **Then** a modal dialog appears stating `${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.` where `${n}` is the total number of projects.
2. **Given** the confirmation modal is open, **When** the user clicks "Cancel", **Then** the modal closes and no AI scoring is initiated.
3. **Given** the confirmation modal is open, **When** the user clicks "Confirm", **Then** the modal closes and all projects are processed sequentially (one-by-one) through the AI scoring service.

---

### User Story 3 - Detailed AI Scoring Criteria, Breakdown & Improvement Suggestions Display (Priority: P3)

As a user, I want to see a detailed score log breakdown and actionable improvement suggestions for each evaluated project so that I understand how the total 1-100 score was derived and what specific actions I can take to improve the repository quality.

**Why this priority**: Gives full transparency into the evaluation metrics and provides actionable, bulleted guidance for improving codebase, documentation, and test quality.

**Independent Test**: Inspect an evaluated project card, expand or view the AI score section, and confirm logs and bulleted improvement suggestions for all 7 evaluation criteria are displayed alongside the overall score.

**Acceptance Scenarios**:

1. **Given** AI scoring completion for a project, **When** reviewing the project details/card, **Then** breakdown logs and bullet point improvement suggestions (`improvements`: string[]) for all criteria (README structure, demo link, clean commit log, codebase structure/pattern, best practices & naming, absence of console.log/debug code, presence of unit/integration tests) are formatted clearly.
2. **Given** the total score returned by AI, **When** rendered, **Then** it is constrained between 1 (poor) and 100 (perfect) with appropriate visual indicator or badge.

---

### Edge Cases

- What happens if Groq API key is missing or API call fails due to rate limits? The card displays an error state for scoring with clear rate limit / error feedback and option to retry, without crashing the application.
- What happens if a repository has no README or no commit history? The AI handles missing elements gracefully, scoring 1 for missing required criteria, logging the reason, and providing specific bullet-point improvement suggestions.
- What happens if user selects/deselects items while scoring is in progress? UI controls for initiating new scoring runs are disabled during active processing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a checkbox or toggle selection control on each Project Card Item.
- **FR-002**: System MUST render a Floating Action Button (FAB) positioned directly beside the existing refresh button in the Projects view header/toolbar.
- **FR-003**: Clicking the FAB when >0 items are selected MUST directly submit the selected project payloads to `GroqController.ts` for AI evaluation.
- **FR-004**: Clicking the FAB when 0 items are selected MUST open a confirmation modal with the message `${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.` where `${n}` is the total number of projects.
- **FR-005**: Confirming the modal MUST parse and score all project repositories sequentially (one-by-one) via `GroqController.ts`.
- **FR-006**: `GroqController.ts` MUST communicate with Groq API using a structured system prompt evaluating:
  1. `README.md` file structure
  2. Presence of a real demo
  3. Clean commit log history
  4. Codebase structure and pattern consistency
  5. Programming language best practices and naming conventions
  6. Absence of `console.log()` or debug artifacts
  7. Presence of unit or integration tests
- **FR-007**: `GroqController.ts` MUST enforce AI output in strict JSON format containing breakdown logs for each evaluated section, bulleted improvement suggestions (`improvements`: `string[]`), and an overall numerical score ranging from 1 to 100.
- **FR-008**: System MUST parse the JSON response from `GroqController.ts` and render total score, detailed breakdown logs, and bulleted improvement suggestions on each evaluated Project Card Item.
- **FR-009**: System MUST persist the returned score breakdown, improvement suggestions, and total score in the project data state.

### Key Entities *(include if feature involves data)*

- **Project Selection State**: Tracks selected project identifiers in renderer state (array of selected project IDs or indices).
- **AI Project Score Result**:
  - `totalScore`: Number (1 to 100)
  - `logs`: Breakdown map or array of objects containing `category` (string), `title` (string), `score` (number), `log` (detailed evaluation text string), and `improvements` (array of bullet point improvement suggestions strings).
- **Groq Score Request Payload**: Project repository metadata, file tree structure, README content, commit log history, sample source code files, test files detection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select one or more projects and initiate AI scoring in under 2 clicks.
- **SC-002**: 100% of successful AI scoring responses return a valid JSON payload containing total score (1-100), breakdown logs, and bullet-point improvement suggestions for all 7 evaluation criteria.
- **SC-003**: Confirmation modal accurately displays project count `${n}` and the rate limit warning message, handling cancel/confirm actions reliably.
- **SC-004**: Evaluated score breakdowns and improvement lists are rendered cleanly on project cards with zero unhandled errors when API calls or rate limits occur.

## Assumptions

- Groq API credentials are configured in environment / application settings (via existing Groq SDK integration specified in project constitution).
- Repository metadata (commit logs, file tree, README content) can be retrieved or passed from local repository inspect logic prior to sending prompt to Groq API.
- Sequential one-by-one processing for all projects prevents API rate limit issues where possible, while modal explicitly warns about potential rate limits.
