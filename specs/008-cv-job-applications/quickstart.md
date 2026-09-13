# Quickstart & Verification Guide: CV Job Application Management

## Prerequisites

- Node.js installed on system
- Currynator repository dependencies installed (`npm install`)

## Automated Tests Execution

Run unit and integration tests using Jest:

```bash
# Run backend storage and controller tests
npm test -- src/main/tests/JobApplicationStorage.test.ts
npm test -- src/main/tests/JobApplicationController.test.ts

# Run frontend component tests
npm test -- src/renderer/src/features/cv-dashboard/tests/CvDashboardView.test.tsx
npm test -- src/renderer/src/features/cv-dashboard/tests/CvItemCard.test.tsx
```

## Manual End-to-End Verification Flow

1. **Launch Development Application**:
   ```bash
   npm run dev
   ```

2. **Navigate to CV Dashboard**:
   - Open app and navigate to **CV Dashboard**.

3. **Verify Floating Action Button (FAB)**:
   - Ensure a floating action button is rendered in the **top-right corner**.
   - Click the FAB button to open the **CV Job Application Form** in creation mode.

4. **Test Job Application Creation**:
   - Enter `title`: "Senior Frontend Developer".
   - Enter `jobDescription`: "React, TypeScript, Electron developer position."
   - Enter `jobRequirement`: "5+ years frontend development experience."
   - Enter optional `companyWebsiteUrl`: "https://example.com/jobs/123".
   - Click **Save**.
   - Verify modal closes and a new card appears on the CV Dashboard with status badge `applied` at the top-left corner.

5. **Test Fast-Status Progression**:
   - On the newly created card, locate the fast-status progression button.
   - Click the button once ➔ status badge updates from `applied` to `called`.
   - Click again ➔ status updates to `interview`, then `techTest`, `rejected`, `gotTheJob`.

6. **Test Edit Mode**:
   - Click the **Edit** (Pencil) button on the card.
   - Verify all fields (`title`, `jobDescription`, `jobRequirement`, etc.) are pre-hydrated.
   - Change `title` to "Lead Frontend Developer".
   - Click **Save**.
   - Verify card updates with the edited title.

7. **Test Deletion**:
   - Click the **Delete** (Trash) button on the card.
   - Confirm deletion in the prompt.
   - Verify card is removed from dashboard and stored data in `job_applications.json` is updated.

8. **Verify Persistence Across App Restart**:
   - Restart the app (`npm run dev`).
   - Navigate back to CV Dashboard.
   - Confirm created/updated items persist accurately.
