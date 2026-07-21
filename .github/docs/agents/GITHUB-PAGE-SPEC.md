# Feature Specification: Github Screen (User Github Portal)

## Status

* **Status:** IN PROGRESS
* **Target Module:** `src/renderer/src/features/github/`

---

## 1. Overview
The **GitHub Page** serves as the primary dashboard for users to review, manage, and optimize their GitHub account profile and repositories. The goal of this module is to analyze user profile metadata and individual project repositories, providing automated quality scoring, architectural evaluations, and actionable recommendations to improve portfolio quality and ATS / recruiter readiness.

This specification details two primary visual and functional boundaries:
1. **GitHub Dashboard Page (`GitHubPage`) & Profile Header**: Displays user profile README details (or empty state) and a list of analyzed project repositories.
2. **Project Card (`ProjectCard`) & Project Detail Screen (`ProjectDetailScreen`)**: Displays minimal project metadata on the list, expanding into a comprehensive analysis view with section-specific quality scores (0–100), structure analysis, language best practice audits, defect warnings, and actionable tips.

---

## 2. Component Hierarchy & Layout

```
├── Github/      # Github page
    ├── components/     # Github components
    │   ├── ProfileHeader.tsx
    │   ├── Card/
    │   │   ├── ProjectCard.tsx
    │   │   ├── ProjectDetailScreen.tsx
    │   │   ├── ProjectDescription.tsx
    │   │   ├── ProjectReadme.tsx
    │   │   ├── ProjectStructure.tsx
    │   │   └── ProjectLanguages.tsx
    ├── types/     # Github types
    │   ├── ProfileHeader.types.ts
    │   ├── ProjectCard.types.ts
    │   ├── ProjectDetailScreen.types.ts
    │   ├── ProjectDescription.types.ts
    │   ├── ProjectReadme.types.ts
    │   ├── ProjectStructure.types.ts
    │   └── ProjectLanguages.types.ts
    ├── utils/     # Utilities functions
    └── index.tsx     # Github core

```

---

## 3. Detailed Technical Requirements

### 3.1 GitHub Page (`GitHubPage`)

* **Purpose**: Main dashboard displaying profile summary and repository index.
* **Functional Requirements**:
  * **Profile README Section**:
    * Fetches and renders the user's account profile `README.md` (from the repository matching `username/username`).
    * If present: Render formatted Markdown along with profile stats.
    * If absent: Render an **Empty State** component featuring:
      * Illustration / Icon indicating missing profile README.
      * Explanation of why a profile README is valuable.
      * "Create Profile README" guidance CTA.
  * **Project List View**:
    * Renders a responsive grid or list of `ProjectCard` items.
    * Includes sorting and filtering controls (by overall score, star count, last updated, or warning severity).

---

### 3.2 Project Card (`ProjectCard`)

* **Purpose**: High-level repository entry point within the project list.
* **Component Specs**:
  * **Displayed Metadata**:
    * Repository Name.
    * Short Repository Description.
    * Primary Language tag(s).
    * Star Count ($\star$).
    * Last sync / commit date.
  * **Global Score Indicator**:
    * Prominently displays the calculated **Global Score** ($0 - 100$).
    * Visual color-coding:
      * $80 - 100$: High Quality (Green / Success)
      * $50 - 79$: Moderate / Needs Improvement (Amber / Warning)
      * $0 - 49$: Critical / Sub-standard (Red / Danger)
  * **Interaction**:
    * Clicking anywhere on the card opens the `ProjectDetailScreen`.

---

### 3.3 Project Detail Screen (`ProjectDetailScreen`)

The detailed view breaks down the project into four distinct evaluation sections. Each section includes an independent score ($0 - 100$) and a dedicated feedback block rendered directly beneath the section content.

#### A. Header Bar
* **Project Name**: Title and direct link to repository.
* **Star Count**: Indicator showing GitHub star count.
* **Short Description**: Subheading summary.
* **Global Score**: Prominently displayed aggregated score badge.

---

#### B. Evaluation Sections & Scoring Criteria

##### 1. Project Description Section
* **Content**: Displays the official repository description metadata.
* **Scoring Rules**:
  * If description is empty / missing: **Score = 0**.
  * If description exists: Evaluated on clarity, length, keyword richness, and clarity of purpose (Scale: 1–100).
* **Feedback Block (Below Section)**:
  * **Worse Parts / Defects**: E.g., *"Description is under 15 characters or uses generic terms."*
  * **Warnings**: E.g., *"Missing target audience or key technology stack references."*
  * **Improvement Tips**: E.g., *"Add a concise summary explaining what problem this project solves and the core stack used."*

---

##### 2. README.md Quality Section
* **Content**: Rendered preview/view of the root `README.md` file.
* **Scoring Rules**:
  * If `README.md` is missing: **Score = 0**.
  * If `README.md` exists: Evaluated on quality and professionality (Scale: 1–100) based on:
    * Presence of key sections (Installation, Usage, Features, Architecture, License, Contributing).
    * Formatting, badges, code block formatting, and visual assets (screenshots/diagrams).
* **Feedback Block (Below Section)**:
  * **Worse Parts / Defects**: E.g., *"No installation steps provided; missing license badge."*
  * **Warnings**: E.g., *"File lacks usage examples or visual screenshots."*
  * **Improvement Tips**: E.g., *"Include a 'Quick Start' code snippet and an architectural diagram."*

---

##### 3. Project Structure Section
* **Content**: Visual tree display of the project's folder layout and file architecture.
* **Scoring Rules**:
  * **Architecture Detection Logic**:
    * Step 1: Parse `README.md` or dedicated architecture documentation to detect if the user specified an explicit architecture (e.g., Clean Architecture, MVC, Feature-First, Monorepo, Microservices).
    * Step 2: If specified, evaluate the file structure against that specific pattern's standards.
    * Step 3: If unspecified, automatically infer structure pattern (e.g., standard Maven/Gradle layout, React standard `src/components`, `src/services`, Go standard project layout) and evaluate against general industry best practices.
  * Evaluated on directory organization, separation of concerns, test placement, and configuration isolation (Scale: 0–100).
* **Feedback Block (Below Section)**:
  * **Worse Parts / Defects**: E.g., *"Root directory contains 20+ loose files; business logic mixed with UI components."*
  * **Warnings**: E.g., *"Unit test directory (`/tests`) is missing or empty."*
  * **Improvement Tips**: E.g., *"Group files by feature module rather than flat file types."*

---

##### 4. Languages & Best Practices Section
* **Content**: Breakdown of language percentages (e.g., TypeScript 70%, HTML 20%, CSS 10%).
* **Scoring Rules**:
  * Evaluated against language-specific best practices, static analysis heuristics, dependency lockfile presence, and configuration hygiene (Scale: 0–100).
* **Feedback Block (Below Section)**:
  * **Worse Parts / Defects**: E.g., *"Missing `.gitignore` causing `.env` or `node_modules` tracking risks."*
  * **Warnings**: E.g., *"Outdated runtime target or missing strict type definitions."*
  * **Improvement Tips**: E.g., *"Enable strict null checks in `tsconfig.json` and add `ESLint`/`Prettier` config files."*

---

## 4. Data Models (TypeScript Interfaces)

```typescript
export interface FeedbackItem {
  id: string;
  type: 'worse_part' | 'warning' | 'tip';
  title: string;
  message: string;
  actionableSuggestion?: string;
}

export interface SectionAnalysis {
  sectionId: 'description' | 'readme' | 'structure' | 'languages';
  title: string;
  score: number; // Range 0 - 100
  hasContent: boolean;
  contentData: Record<string, any>;
  worseParts: FeedbackItem[];
  warnings: FeedbackItem[];
  tips: FeedbackItem[];
}

export interface ProjectScoreOverview {
  globalScore: number; // Aggregated score (0 - 100)
  descriptionScore: number;
  readmeScore: number;
  structureScore: number;
  languagesScore: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  stars: number;
  primaryLanguage: string;
  repoUrl: string;
  scores: ProjectScoreOverview;
  sections: {
    description: SectionAnalysis;
    readme: SectionAnalysis;
    structure: SectionAnalysis;
    languages: SectionAnalysis;
  };
}

export interface UserGitHubProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  profileReadme: {
    exists: boolean;
    contentRaw?: string;
    contentHtml?: string;
  };
  projects: ProjectItem[];
}

```

---

## 5. Global Score Calculation Logic

The **Global Score** ($S_{global}$) is a weighted average computed from the individual section scores:

$$S_{global} = (w_d \cdot S_{description}) + (w_r \cdot S_{readme}) + (w_s \cdot S_{structure}) + (w_l \cdot S_{languages})$$

### Default Weight Distribution:

* **Description Weight ($w_d$)**: $0.15$ (15%)
* **README Weight ($w_r$)**: $0.35$ (35%)
* **Structure Weight ($w_s$)**: $0.30$ (30%)
* **Languages Weight ($w_l$)**: $0.20$ (20%)

> **Note**: If `description` or `readme` is absent, its corresponding score ($S$) is set to $0$, significantly reducing the project's global score and highlighting the need for immediate optimization.

---

## 6. Feedback Rendering Component Layout (UI Pattern)

Every analysis section in `ProjectDetailScreen` must adhere to the following visual structure:

```
+-----------------------------------------------------------------------+
| [Section Icon] SECTION TITLE                              SCORE: 85/100|
+-----------------------------------------------------------------------+
| Main Section Content (Rendered README / Directory Tree / Bar Chart)   |
|                                                                       |
+-----------------------------------------------------------------------+
| 🚨 Worse Parts & Defects                                              |
|  - [Icon] High severity issue description                              |
|                                                                       |
| ⚠️ Warnings                                                           |
|  - [Icon] Moderate potential code/documentation debt                  |
|                                                                       |
| 💡 Improvement Tips                                                   |
|  - [Icon] Clear, actionable advice on how to raise this section score |
+-----------------------------------------------------------------------+
```

---

### Key Specification Highlights

1. **GitHub Page (`GitHubPage`) Dashboard**:
* **Profile README Section**: Supports rendered Markdown display from `username/username` or an interactive **Empty State** fallback when absent.
* **Project List View**: Grid/list of `ProjectCard` items with filtering and navigation handlers.


2. **Project Card (`ProjectCard`)**:
* Compact overview showing project name, stars, description snippet, primary language, and the calculated **Global Score Badge** (0–100).
* Direct click handler to launch `ProjectDetailScreen`.


3. **Project Detail Screen (`ProjectDetailScreen`)**:
* **Header Bar**: Project name, description, stars, and global score badge.
* **Section-by-Section Score Breakdown (0–100)**:
* **Description**: Evaluated on presence, clarity, and stack references (0 if missing).
* **README.md**: Evaluated on completeness, quality, formatting, and professionality (0 if missing).
* **Project Structure**: Architecture detection mechanism (parses explicit architecture stated in README/docs first, falls back to standard framework pattern detection) and structure compliance evaluation.
* **Languages**: Code distribution and language-specific best practices / hygiene checks.

4. **Section Feedback System**:
* Directly beneath each section content, dedicated sub-components highlight **Worse Parts / Defects**, **Warnings**, and **Actionable Improvement Tips**.


5. **Data Architecture & Scoring Engine**:
* Complete TypeScript interfaces (`ProjectItem`, `SectionAnalysis`, `FeedbackItem`, `ProjectScoreOverview`).
* Weighted Global Score formula: $S_{global} = 0.15 \cdot S_{desc} + 0.35 \cdot S_{readme} + 0.30 \cdot S_{struct} + 0.20 \cdot S_{lang}$.
---