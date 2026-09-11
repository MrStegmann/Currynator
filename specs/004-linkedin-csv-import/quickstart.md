# Quickstart & Verification Guide: LinkedIn CSV Import

## Feature: 004-linkedin-csv-import

### Prerequisites
- Active Electron development server (`npm run dev`).
- Sample LinkedIn data export `.zip` file (e.g. `Complete_LinkedInDataExport_09-09-2026.zip.zip`).

### Verification Steps

#### Scenario 1: Navigate to LinkedIn Import View
1. Launch app with `npm run dev`.
2. Observe the Home page top-right corner for the floating action button labeled `"Import LinkedIn CSV"`.
3. Click `"Import LinkedIn CSV"`.
4. **Expected Result**: View transitions smoothly to the Import View featuring:
   - Top header with a working "Back button".
   - Left column containing step-by-step instructions for exporting data from LinkedIn.
   - Right column displaying a file dropzone and "Select ZIP file" button.

#### Scenario 2: Upload LinkedIn Export ZIP & View Dynamic Progress
1. Drag and drop `Complete_LinkedInDataExport_09-09-2026.zip.zip` onto the dropzone (or select via file dialog).
2. **Expected Result**: 
   - Progress bar appears with dynamic feedback messages ("Extracting files...", "Parsing Positions.csv...", etc.).
   - Percentage updates smoothly from 0% to 100%.

#### Scenario 3: Pre-Existing Data Prompt (FR-009)
1. If pre-existing resume data exists in the application store when uploading, a modal prompt appears asking:
   - `"Choose how to apply your LinkedIn data: Replace existing resume or Merge with current resume?"`
2. Select **Replace** (or **Merge**).
3. **Expected Result**: Importer executes selected strategy and displays success state.

#### Scenario 4: Completion & Skipped Files Report
1. Upon reaching 100% completion:
   - A success alert is displayed.
   - If any optional CSV files (e.g., `Certifications.csv`) were not found in the ZIP, a notice lists the skipped optional files.
   - A `"Return to Home"` button is displayed.
2. Click `"Return to Home"`.
3. **Expected Result**: Home page displays the imported profile (Work, Education, Skills, Languages, Projects).
