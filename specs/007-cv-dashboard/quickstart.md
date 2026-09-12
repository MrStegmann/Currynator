# Quickstart Validation Guide: CV Dashboard View

## Prerequisites

- Node.js & npm installed.
- Repository dependencies installed (`npm install`).

## Setup & Running Dev Server

```bash
# Run application in development mode
npm run dev
```

## Validation Scenarios

### Scenario 1: Navbar Integration & View Switching

1. Launch application (`npm run dev`).
2. Open the navigation sidebar by clicking the hamburger menu icon.
3. Verify that a link labeled **`CV Dashboard`** is present in the navigation bar.
4. Click **`CV Dashboard`**.
5. **Expected Outcome**: Main content view switches to the CV Dashboard, header title displays "CV Dashboard".

---

### Scenario 2: Empty Dashboard State

1. Clear/mock CV store state to 0 CV items.
2. Navigate to the CV Dashboard.
3. **Expected Outcome**:
   - Centered empty-state container is displayed.
   - Text reads: *"No has creado todavía ningún curriculum personalizado para ninguna vacante. Empieza ahora pulsando en el botón de abajo."*
   - Button labeled *"Crear nuevo CV"* is visible.
4. Click *"Crear nuevo CV"*.
5. **Expected Outcome**: Click handler executes gracefully without error.

---

### Scenario 3: Populated CV Grid & Responsive Breakpoints

1. Populate CV store state with mock CV items (e.g. 3-4 items).
2. Open CV Dashboard on a viewport width **> 675px** (e.g., 1024px desktop view).
   - **Expected Outcome**: CV cards are arranged in a **3-column grid layout**. Each card shows vacancy title, description snippet, creation date, updated date, and action icons (Eye, Pencil, Trash).
3. Resize the window or inspect element and set viewport width **<= 675px** (e.g., 500px mobile view).
   - **Expected Outcome**: Layout dynamically switches to a **1-column stacked layout**.

---

### Scenario 4: Delete Confirmation Modal Flow

1. On a populated CV card, click the **Trash icon** (Delete).
2. **Expected Outcome**:
   - A custom confirmation modal pops up.
   - No native browser dialog (`window.alert` / `window.confirm`) appears.
3. Click "Cancel".
   - **Expected Outcome**: Modal closes, CV item remains in the grid.
4. Click Trash icon again, then click "Confirm Delete".
   - **Expected Outcome**: Selected CV item is removed from the grid. If it was the last item, dashboard view automatically transitions to the empty state.

---

### Scenario 5: Automated Unit Tests

Run unit tests via Jest:

```bash
npm test -- src/renderer/src/features/cv-dashboard
```
