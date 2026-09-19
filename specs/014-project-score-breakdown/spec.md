# Feature Specification: Project Score Visual & Improvement Tips

**Feature Branch**: `014-project-score-breakdown`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Add visual feedback regarding the total score achieved to the Project Cards aligned with the top-right corner as an interactive element; clicking it opens a modal displaying score breakdown by section and recommended improvements for the repository."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Score Badge on Project Card Top-Right Corner (Priority: P1)

As a user viewing project cards, I want to see the total project score clearly displayed as a prominent badge in the top-right corner of each card and be able to click or tap it so that I can immediately gauge project quality and trigger detailed analysis.

**Why this priority**: Core visual layout update making project scores immediately visible and establishing the primary user interaction point on each project card.

**Independent Test**: View any project card that has been evaluated, confirm the score badge appears anchored in the top-right corner with distinct visual state (including hover/active styling), and clicking/tapping it fires the score details trigger.

**Acceptance Scenarios**:

1. **Given** a project card with an assigned total score, **When** rendered in the Projects view, **Then** the total score badge is positioned in the top-right corner of the card.
2. **Given** a project card score badge, **When** hovered or focused, **Then** visual feedback (such as color shift, shadow elevation, or cursor change) clearly indicates interactivity.
3. **Given** a project card score badge, **When** clicked or activated via touch, **Then** the score details modal/drawer opens populated with that project's score data.

---

### User Story 2 - Score Breakdown & Improvement Tips Modal/Drawer (Priority: P2)

As a user reviewing a project's evaluation, I want to view a dedicated modal or drawer containing the section-by-section score breakdown and actionable repository improvement recommendations so that I understand where the repository excels and how to raise its score.

**Why this priority**: Delivers deep transparency into scoring metrics and actionable guidance for project improvement.

**Independent Test**: Click the score badge on a scored project, verify the modal opens displaying section breakdowns (with scores/logs for criteria like README structure, tests, clean code, etc.) and a distinct list of bulleted repository improvement recommendations.

**Acceptance Scenarios**:

1. **Given** a project card with score data, **When** the user clicks the score badge, **Then** a modal dialog or drawer overlay opens with the project name and total score header.
2. **Given** the open score modal, **When** inspecting the section breakdown area, **Then** individual criterion evaluation scores and log details are listed by section.
3. **Given** the open score modal, **When** inspecting the improvement tips area, **Then** actionable bullet point recommendations for improving the repository are displayed clearly.
4. **Given** the open score modal, **When** the user clicks a close button, backdrop mask, or presses `Escape`, **Then** the modal closes and focus returns to the triggering score badge.

---

### User Story 3 - Full Keyboard Accessibility & Screen Reader Navigation (Priority: P3)

As a user using keyboard navigation or assistive technology, I want to operate the score badge and modal seamlessly using standard keyboard controls (`Tab`, `Space`, `Enter`, `Escape`) with focus trapping so that the interface is fully accessible.

**Why this priority**: Ensures accessibility compliance, keyboard navigability, and smooth focus management.

**Independent Test**: Navigate to the score badge using `Tab`, press `Enter` or `Space` to open the modal, verify focus moves inside the modal, confirm focus trap prevents tabbing outside while open, and press `Escape` to close modal and return focus to the score badge.

**Acceptance Scenarios**:

1. **Given** a project card score badge, **When** navigating with `Tab`, **Then** the badge receives visible keyboard focus and can be triggered with `Enter` or `Space`.
2. **Given** an open score modal, **When** active, **Then** appropriate ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`) are present and initial focus is set inside the dialog.
3. **Given** an open score modal, **When** tabbing forward/backward, **Then** focus remains trapped within interactive elements of the modal until dismissed.
4. **Given** an open score modal, **When** pressing `Escape`, **Then** the modal dismisses immediately and returns keyboard focus to the triggering element.

---

### Edge Cases

- **Unscored Project Card**: If a project card has not been scored yet, a default "Not Scored" or neutral placeholder badge is rendered in the top-right corner; clicking it prompts the user to run AI scoring or explains that evaluation is pending.
- **Empty Breakdown or Improvement List**: If a project score contains zero improvement recommendations (e.g., perfect 100 score), the modal displays a positive completion state ("No further improvements required! Repository meets all standards.") rather than an empty blank section.
- **Long Content / Overflow**: If section logs or improvement recommendations are lengthy, the modal body provides smooth vertical scroll capability without overflowing the view window boundaries.
- **Theme Switching**: The badge and modal maintain compliant color contrast and visual consistency across both dark and light UI modes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the total project score badge/element aligned to the top-right corner of each Project Card.
- **FR-002**: System MUST bind click and keydown (`Enter`/`Space`) event handlers to the score badge to make it an interactive control.
- **FR-003**: System MUST open a modal or drawer overlay upon score badge activation.
- **FR-004**: The score modal MUST render a header displaying the target project name, overall score, and a clear dismiss/close action button.
- **FR-005**: The score modal MUST render a section breakdown displaying category scores and detailed evaluation logs for each scored criterion.
- **FR-006**: The score modal MUST render a dedicated recommendations section listing actionable repository improvement suggestions as bullet points.
- **FR-007**: System MUST enforce full keyboard accessibility for the modal, including visible focus rings, focus trapping while open, and `Escape` key dismissal.
- **FR-008**: System MUST apply semantic accessibility attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) to the modal element.
- **FR-009**: System MUST ensure badge and modal visuals remain consistent with design tokens across light and dark display modes.

### Key Entities *(include if feature involves data)*

- **Project Score Badge State**:
  - `projectScore`: Number (1 to 100) or null/undefined if unscored.
  - `badgeLabel`: Formatted score string (e.g., "85/100" or "N/A").
  - `statusVariant`: Color indicator variant based on score range (e.g., green for 80+, yellow for 50-79, red for <50, neutral for unscored).
- **Score Detail Modal View Payload**:
  - `projectName`: String name of the project repository.
  - `totalScore`: Number (1 to 100).
  - `sectionBreakdown`: Array of section objects `{ category: string, score: number, maxScore: number, log: string }`.
  - `improvementTips`: Array of strings representing recommended repository enhancements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of project cards display the score badge in the top-right corner without overlapping existing card elements.
- **SC-002**: Clicking or keyboard-activating (`Enter`/`Space`) the score badge opens the score breakdown modal in under 100ms.
- **SC-003**: 100% of modal dialog interactions pass keyboard focus trap, `Escape` key close, and return focus to the triggering element upon closure.
- **SC-004**: All section score breakdowns and improvement bullet points for the selected project are rendered completely without layout truncation or overflow bugs.

## Assumptions

- Project score data (total score, breakdown by section, and improvement suggestions) is stored in project state (populated via AI scoring service from feature 013 or placeholder defaults for unscored projects).
- UI component styling follows TailwindCSS and design guidelines outlined in `DESIGN.md`.
