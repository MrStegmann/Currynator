# Quickstart & Validation Guide: Project Score Visual & Improvement Tips

## Prerequisites
- Application dependencies installed (`npm install`).
- Dev server running (`npm run dev`) or test suite passing (`npm test`).

## Automated Verification

Run Jest unit tests targeting the project score components:

```bash
npm test -- src/renderer/src/features/projects/tests/ProjectCard.test.tsx
npm test -- src/renderer/src/features/projects/tests/ProjectScoreModal.test.tsx
```

## Manual Verification Scenarios

### Scenario 1: Top-Right Score Badge Positioning & Interactivity
1. Launch app (`npm run dev`) and navigate to the **Projects** view.
2. Observe any evaluated Project Card in the grid.
3. Verify the score badge (e.g. `85/100`) is positioned in the **top-right corner** of the card header.
4. Hover over the badge to confirm pointer cursor and visual hover effect (background highlight / border glow).
5. Click the score badge.

### Scenario 2: Score Breakdown & Improvement Tips Modal
1. Upon clicking the score badge, verify the **Project Score Details Modal** opens smoothly.
2. Verify the modal title displays the repository name and overall score badge.
3. Inspect the **Score Breakdown by Section**:
   - Each evaluated section (e.g. README structure, test coverage, commit history) displays its category title, score, and explanation log.
4. Inspect the **Recommended Improvements**:
   - Verify bullet-point improvement recommendations are listed under a dedicated tips section.
5. Click the **Close** (X) button or click outside on the backdrop to dismiss the modal.

### Scenario 3: Accessibility & Keyboard Navigation
1. Press `Tab` repeatedly to focus the top-right score badge on a Project Card.
2. Verify visual focus outline ring appears on the badge.
3. Press `Enter` or `Space` to activate the badge.
4. Verify the modal opens and focus is placed inside the modal dialog.
5. Press `Tab` and `Shift+Tab` to verify focus remains trapped within modal interactive controls.
6. Press `Escape` key.
7. Verify modal closes immediately and focus is restored to the triggering score badge.
