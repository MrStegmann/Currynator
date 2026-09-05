# Quickstart Validation Guide

Follow these steps to manually validate that the Header, Sidebar Navigation, and Home Page Resume Editor feature works end-to-end.

## Setup
1. Ensure the development server is running: `npm run dev`
2. Open the Electron application.

## Validation Scenarios

### 1. Header and Sidebar Toggle
- **Action**: Click the hamburger menu icon in the top-left of the Header.
- **Expected**: The sidebar (RightNavBar) should slide in from the left.
- **Action**: Click the hamburger menu icon again.
- **Expected**: The sidebar should hide.
- **Action**: Open the sidebar and observe the "Home" link.
- **Expected**: The "Home" link should be bold/highlighted since you are on the Home view. The header title should read "Home".

### 2. Home Page Layout
- **Action**: Look at the main content area.
- **Expected**: You should see 7 distinct sections (Basics, Work, Education, Certificates, Skills, Languages, References), each with an `h2` heading and a pencil icon next to it.

### 3. Basics Section Editing
- **Action**: Click the pencil icon on the Basics section.
- **Expected**: The section changes to edit mode with input fields and a "Save" button.
- **Action**: Clear the "Name" field and click "Save".
- **Expected**: An error message "Name is required" should appear, and the section should remain in edit mode.
- **Action**: Fill in valid data and click "Save".
- **Expected**: The section returns to read-only mode and the updated data is displayed.

### 4. Array Section (Work) Editing
- **Action**: Click the pencil icon on the Work section.
- **Expected**: The section shows an "Add Work" button.
- **Action**: Click "Add Work".
- **Expected**: A modal form appears.
- **Action**: Fill in Name, Position, and Start Date. Check the "I currently work here" checkbox. Click Save.
- **Expected**: The modal closes, and the new work entry appears in the list.
- **Action**: Click "Edit" on the newly added work entry, change the title, and save.
- **Expected**: The updated title is displayed.
- **Action**: Click "Delete" on the entry.
- **Expected**: The entry is removed from the list.

### 5. Data Persistence
- **Action**: Close the Electron app and restart it (`npm run dev`).
- **Expected**: All the edits you made in the previous steps should still be visible, confirming that the IPC calls to save/load from Local Storage are working correctly.
