# Quickstart: Validation Guide

## Prerequisites
- Node.js environment
- Project dependencies installed (`npm install`)
- A clean testing state (no existing local storage data)

## Validation Scenario 1: Initial Launch (No Data)

1. Start the application:
   ```bash
   npm run dev
   ```
2. **Observe**: The "Greetings" loading screen appears momentarily.
3. **Observe**: The application transitions to the Onboarding Form.
4. **Action**: Fill in the mandatory fields (`Name`, `Email`, `Label`) and proceed through the steps.
5. **Action**: Submit the form.
6. **Observe**: The application displays a blank screen showing the entered data formatted as raw JSON text.

## Validation Scenario 2: Launch with Existing Data

1. Assuming you completed Scenario 1 and the data is saved in Local Storage.
2. Restart the application:
   ```bash
   # Close the app, then run:
   npm run dev
   ```
3. **Observe**: The "Greetings" loading screen appears momentarily.
4. **Observe**: The application automatically bypasses the form and directly displays the blank screen with the raw JSON text from Local Storage.

## Validation Scenario 3: Missing Mandatory Fields

1. Clear the local storage (to simulate a fresh start).
2. Start the application:
   ```bash
   npm run dev
   ```
3. **Action**: In the Onboarding Form, try to proceed or submit without entering a `Name`, `Email`, or `Label`.
4. **Observe**: The Zod validation prevents submission and displays appropriate UI error states (red borders, helper text).
