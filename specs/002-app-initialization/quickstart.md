# Quickstart Validation

## Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)

## Scenario 1: Initial load without data
1. Ensure the local storage file managed by the backend is empty or doesn't exist.
2. Run the application: `npm run start`
3. Verify the "Greetings" loading screen appears briefly.
4. Verify the application transitions to the "basics" multi-step form.
5. Fill out at least the Name, Email, and Label fields.
6. Submit the form and verify the application transitions to the Home dashboard.

## Scenario 2: Initial load with existing data
1. Seed the local storage file with valid JSON Resume data.
2. Run the application: `npm run start`
3. Verify the "Greetings" loading screen appears briefly.
4. Verify the application transitions directly to the Home dashboard.

## Scenario 3: IPC Failure
1. Simulate an IPC failure by modifying the backend `check-saved-data` handler to throw an error or delay infinitely.
2. Run the application.
3. Verify the error screen appears with a "Retry" button.

## Scenario 4: Corrupted Data
1. Seed the local storage file with invalid JSON data (e.g., missing mandatory `name` field).
2. Run the application: `npm run start`
3. Verify the error screen appears offering a modal to rewrite the corrupted data.
