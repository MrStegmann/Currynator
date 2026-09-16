# Quickstart Validation Guide: Sticky Header & Granular LinkedIn Import

## Overview

This document provides runnable validation procedures to verify all functionality introduced in Feature 010.

---

## Scenario 1: Sticky Header Verification

### Goal
Verify that the top application header remains 100% visible at the top of the viewport when scrolling through long resume content.

### Steps
1. Launch dev environment (`npm run dev`).
2. Navigate to the main Home screen with filled resume content (ensuring vertical scrolling is required).
3. Scroll down to the bottom of the page.
4. **Expected Result**: The header containing the menu toggle icon and view title stays fixed at the top edge (`top: 0`) without scrolling out of view. Content scrolls underneath the header.

---

## Scenario 2: Granular Section LinkedIn Import

### Goal
Verify that importing a LinkedIn ZIP file when existing data is present allows individual section choices (Replace, Keep Original, Merge) with clear descriptions.

### Steps
1. Ensure existing resume data is present in multiple sections (e.g., Work and Education).
2. Click the LinkedIn Import button.
3. Select or drop a valid LinkedIn export ZIP archive.
4. Verify the **Granular Section Import Modal** appears.
5. Inspect each section row (Basic, Work, Education, Certificates, etc.):
   - Confirm three options are available: **Replace**, **Keep Original**, and **Merge**.
   - Confirm each option displays its detailed explanatory description.
6. Select **Replace** for Work Experience and **Keep Original** for Education.
7. Click **Confirm Import**.
8. **Expected Result**: Work experience entries are replaced with imported LinkedIn work data, while existing Education entries remain completely unchanged.

---

## Scenario 3: First-Time Onboarding LinkedIn ZIP Import

### Goal
Verify that launching the app for the first time without stored data displays an alternative "Import LinkedIn ZIP" option in onboarding.

### Steps
1. Clear local storage / reset application data store.
2. Launch the application to trigger the Onboarding screen.
3. Verify the Onboarding screen presents both "Manual Setup" and "Import LinkedIn ZIP" options.
4. Select "Import LinkedIn ZIP" and upload a valid LinkedIn ZIP archive.
5. **Expected Result**: Data is extracted, stored into the resume store, and the app transitions directly to the main Home view with imported profile data loaded.

---

## Automated Verification Tests

Run Jest test suite for header layout, import resolution logic, and onboarding:
```bash
npm test -- tests/unit/linkedin-import/
```
