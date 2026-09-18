# Quickstart Validation Guide: AI Score Projects

## Prerequisites
- Application built and running (`npm run dev`).
- GitHub token configured in the Projects view to sync repository list.
- `GROQ_API_KEY` set in environment or `.env` file.

---

## Runnable Test & Verification Scenarios

### Scenario 1: Select Specific Projects & Initiate Scoring
1. Navigate to the **GitHub Projects** view.
2. Check the selection checkbox on 2 project cards.
3. Click the AI Score Floating Action Button (FAB) positioned beside the refresh button.
4. **Expected Outcome**:
   - No modal appears.
   - Selected project cards transition to loading/scoring state.
   - Upon completion, each evaluated project displays total score (1-100) and section breakdown logs.

---

### Scenario 2: Zero Selected Items & Confirmation Modal
1. Deselect all project cards (0 selected).
2. Click the AI Score FAB.
3. **Expected Outcome**:
   - Confirmation modal pops up stating: `${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.` (where `${n}` matches the total number of projects).
4. Click **Cancel**: Modal closes without triggering scoring.
5. Click FAB again, click **Confirm**: Modal closes and all projects are scored sequentially one-by-one.

---

### Scenario 3: Score Persistence & Breakdown View
1. After scoring completes, reload the application (`Ctrl+R` or restart).
2. Navigate back to **GitHub Projects**.
3. **Expected Outcome**: Scores and breakdown logs remain visible on cards (loaded from LocalStorage).

---

## Automated Test Command
Run Jest unit tests covering `GroqController.ts`, `IpcController.ts`, and `ProjectCard.tsx` selection state:
```bash
npm test -- --testPathPattern=projects
```
