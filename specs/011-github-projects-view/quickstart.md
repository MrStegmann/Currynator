# Quickstart Validation Guide: GitHub Projects View Page

## Overview

This document outlines runnable validation procedures to verify all functionality introduced in Feature 011.

---

## Scenario 1: First-Time GitHub Token Setup

### Goal
Verify that entering the Projects page without a configured token displays the 2-column setup view, toggleable password field, and successful token saving.

### Steps
1. Launch dev environment (`npm run dev`).
2. Open the navigation drawer and click **Projects**.
3. Confirm the screen displays a 2-column layout:
   - Left column: Step-by-step GitHub Personal Access Token creation guide.
   - Right column: Token field with password masking, show/hide toggle icon, and "Save Token" button.
4. Type a token, click the show/hide eye icon, and verify the input switches between masked (`password`) and readable (`text`).
5. Click **Save Token**.
6. **Expected Result**: The token is saved securely, the view transitions to the Projects repository grid, and repositories are loaded.

---

## Scenario 2: Projects Grid View & Pagination

### Goal
Verify that loaded repositories render in a 5-column grid layout (max 10 items per page) with functioning pagination controls.

### Steps
1. View the Projects page with loaded repositories.
2. Confirm cards display repository titles, descriptions, stargazers, and primary languages.
3. On a 1080p / 1440p desktop viewport, confirm cards are arranged in a 5-column row (`xl:grid-cols-5`).
4. Confirm maximum 10 items render on Page 1.
5. Click **Next** on the pagination bar at the bottom.
6. **Expected Result**: Page 2 displays the next set of repositories seamlessly.

---

## Scenario 3: Floating Refresh Button Action

### Goal
Verify that clicking the top-right floating action button triggers a live re-fetch from GitHub and updates local storage cache.

### Steps
1. On the Projects page, locate the floating action button fixed to the top-right of the viewport.
2. Click the floating refresh button.
3. Observe the loading spinner state on the floating button.
4. **Expected Result**: Repositories are re-fetched from GitHub API, local storage cache is updated, and the project card list updates smoothly.

---

## Automated Verification Tests

Run Jest unit test suite:
```bash
npm test -- tests/unit/projects/
```
