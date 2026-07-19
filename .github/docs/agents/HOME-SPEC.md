# Feature Specification: Home Dashboard & Developer Metrics

## Status

* **Status:** IMPLEMENTED
* **Target Module:** `src/renderer/src/features/home`
* **Dependencies:** `main/services/github.service.ts`, `main/services/secure.service.ts`

---

## 1. UI Layout Overview

The Home feature UI must be styled as a **single-column vertical layout** containing two distinct stacked sections. It must fit seamlessly within the React feature-based renderer module (`src/renderer/src/features/home/`).

---

## 2. Section One: Basic Information (Profile Identity) `src/renderer/src/features/home/components/BasicInformation.tsx`

### Description

Displays the core user identity fields originally captured by the 3-Step Setup Wizard. It allows for quick, friction-free profile updates.

### Behavioral & UI Rules

1. **Input Architecture:** Contains three text fields: `First Name`, `Last Name`, and `Email`.
2. **Visual Styling:** The input fields must be minimalist. They must have **no borders** except for a visible **bottom border** (underline style).
3. **State Management (Dirty State):**
* The UI must track if the current input values differ from the saved baseline data.
* If a user types or alters any data, a minimalist action row containing **"Save"** and **"Cancel"** buttons must instantly transition into view.
* **Placement:** This button row must be aligned cleanly at the very bottom of Section One.


4. **Action Logic:**
* *Cancel:* Reverts all text inputs back to their original saved states and hides the button row.
* *Save:* Persists the new data updates to storage, resets the dirty baseline state, and cleanly hides the action button row.



---

## 3. Section Two: GitHub Professional Metrics & Scoring `src/renderer/src/features/home/components/GithubMetrics.tsx`

### Description

A comprehensive analytical suite processing the user's software engineering footprint via the secure GitHub token connection.

### Core Metrics Modules

#### A. Profile README.md Evaluator

The engine must fetch and parse the user's primary GitHub profile `README.md` file.

* **Scoring (0 to 100):** Rates the README based on technical profile industry standards (e.g., presence of clear summary, tech stack badges, contact info, call-to-actions).
* **Actionable Feedback:** Always display a list of context-aware "Tips to Improve README.md" if the score sits below 100.
* **Fallback State (Missing README):** If the profile repository or `README.md` file does not exist:
* Assign an immediate score of `0`.
* Render a clear, step-by-step interactive guide helping the user initialize and deploy a successful profile README repository on GitHub.



#### B. Polyglot Language Distribution

* **UI Component:** A multi-segmented or stacked linear **Progress Bar** component.
* **Data Aggregation:** Calculates total code byte ratios combined across all public repository data fetched from the API.
* **Visual Output:** Renders code language segments proportionally, color-coded precisely by native GitHub color definitions (e.g., TypeScript as blue, JavaScript as yellow).

#### C. Top 5 Projects Quality Valuation

An algorithmic review score scanning the user's top 5 best/most active public repositories.

* **Scoring (0 to 100):** Rates repositories based on:
1. Language best practices & syntax consistency.
2. File structure organization soundness.
3. Clean coding standards (e.g., absence of massive monolithic code files).


* **Actionable Feedback Panel:** Generates dynamic technical suggestions highlighting concrete optimizations to clean up file layouts, write missing project `README.md` files, or expand repository short descriptions.

---

## 4. Data Schema Model (Contract)

The React state engine must strictly enforce the following interface contract for the Home module:

```typescript
export interface HomeFeatureState {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
  metrics: {
    profileReadme: {
      score: number; // 0 to 100
      exists: boolean;
      improvementTips: string[];
    };
    languages: Array<{
      name: string;
      percentage: number;
      color: string;
    }>;
    topProjects: Array<{
      projectName: string;
      repoScore: number; // 0 to 100
      structuralFeedback: string[];
      missingReadme: boolean;
      descriptionTip: string | null;
    }>;
  };
}

```