# Quickstart: Header, Sidebar, and Dynamic Toolbar Validation

## Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)

## Validation Scenarios

### Scenario 1: Launch Maximized & Permanent Sidebar
1. Run `npm run dev` to start the Electron desktop application.
2. Verify that the application window launches in maximized mode on the screen.
3. Verify that the left sidebar is pinned open by default without any burger toggle icon in the header.
4. Verify navigation links are ordered:
   - 1. Home
   - 2. Projects
   - 3. CV Dashboard

### Scenario 2: Dynamic Toolbar on Home View
1. Ensure the active view is `Home`.
2. Inspect the right side of the header/toolbar.
3. Verify the `Import LinkedIn CSV` button is displayed.
4. Click the button; verify it opens the LinkedIn CSV import flow.

### Scenario 3: Dynamic Toolbar on Projects View
1. Click `Projects` in the left sidebar.
2. Verify the active view changes to `Projects`.
3. Inspect the right toolbar; verify it displays `Sync Projects` and `Score Projects` buttons.
4. Click `Sync Projects`; verify repository syncing begins.
5. Click `Score Projects`; verify scoring action starts or opens score modal.

### Scenario 4: Dynamic Toolbar on CV Dashboard View
1. Click `CV Dashboard` in the left sidebar.
2. Verify the active view changes to `CV Dashboard`.
3. Inspect the right toolbar; verify it displays `New Apply` button.
4. Click `New Apply`; verify the job application creation form opens.

## Automated Test Verification
Run the test suite:
```bash
npm test -- src/renderer/tests/
```
