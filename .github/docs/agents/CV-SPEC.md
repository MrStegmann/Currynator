# Feature Specification: Studio Page

## Status

* **Status:** IMPLEMENTED
* **Target Module:** `src/renderer/src/features/studio/`

---

## 1. Overview

The **Studio Page** serves as a core workspace for resume management, AI interaction, and related document generation (such as active Study Guides linked to specific resumes). When entering the Studio Page, the primary navigation sidebar dynamically updates to a contextual navigation menu, replacing the main application menu with a **Back to Home** action placed at the bottom option of the sidebar.

All application data (resumes, study guides, and workspace state) is stored and persisted **locally**.

The layout utilizes a responsive three-column workspace:

1. **Left Sidebar:** Document navigation, resume selection, creation triggers, and home navigation.


2. **Main Canvas:** Active tab view (Resume Form/Preview/Diff vs. Study Guide View), sticky action bars, and document export controls.


3. **Right Sidebar:** Contextual AI tools and interactive AI chat agent.



---

## 2. Architecture & State Management

### 2.1 State Structure & Local Persistence

All items are saved locally using standard browser storage mechanisms or local file systems (`localStorage` / `IndexedDB`).

```typescript
interface InterviewQuestion {
  id: string;
  question: string;
  proposedAnswer: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface PracticalExercise {
  id: string;
  scenario: string;
  objective: string;
  hints: string[];
  solutionStrategy: string;
}

interface StudyGuideData {
  id: string;
  resumeId: string;
  createdAt: string;
  updatedAt: string;
  sections: {
    id: string;
    keyword: string;
    conceptSummary: string;
    keyTakeaways: string[];
    simulatedInterview: InterviewQuestion[];
    practicalExercises: PracticalExercise[];
    projectTips: string[];
  }[];
}

interface StudioState {
  activeResumeId: string | null;
  activeTab: 'resume' | 'study-guide';
  isDirty: boolean; // Tracks unsaved form edits on active resume
  viewMode: 'edit' | 'preview' | 'optimization-diff';
  diffData: {
    original: ResumeData | null;
    proposed: ResumeData | null;
  } | null;
  isAiProcessing: boolean;
  activeStudyGuide: StudyGuideData | null;
}

```

### 2.2 Unsaved Changes Guard

* Any action that changes `activeResumeId` or navigates away while `isDirty === true` triggers a **Warning Toast/Dialog**:


* **Action 1:** "Save & Continue" $\rightarrow$ Persists current changes to local storage, then completes navigation.


* **Action 2:** "Discard & Continue" $\rightarrow$ Resets `isDirty`, drops local changes, and completes navigation.


* **Action 3:** "Cancel" $\rightarrow$ Aborts navigation, keeping the user on the current form.





---

## 3. UI Component Breakdown

### 3.1 Left Sidebar (`src/renderer/src/features/studio/components/left-sidebar/`)

* **`ResumeList`**:
* Renders a scrollable list of `ResumeCard` items.




* **`ResumeCard`**:
* Displays: Title, description, last updated timestamp, and mini preview/badge.


* Actions: Delete button (triggers custom modal; removes locally stored resume and its associated study guide).


* On Click: Checks `isDirty` state before setting `activeResumeId`. Loads both the active resume and its associated local Study Guide (if it exists).




* **`CreateResumeButton`**:
* Triggers new resume instantiation.


* Auto-prepopulates defaults by merging data from:
1. `profile.service.ts` (local user profile info, including profile photo if available).


2. `localStorage.getItem('githubProfileData')` (defaults to the top 3 scored GitHub projects; if unscored, falls back to the 3 most recent projects in reverse order).




* Respects the `isDirty` unsaved changes check prior to resetting canvas state.




* **`StudioNavigationHeader` / Sidebar Navigation**:
* Displays the **"Back to Home"** navigation option, positioned strictly as the **last menu option** in the sidebar.





---

### 3.2 Main Canvas (`src/renderer/src/features/studio/components/canvas/`)

* **`CanvasTabSelector`** *(Top Header)*:
* Tab navigation to toggle between **Resume View** and **Study Guide View**.


* The **Study Guide** tab is disabled or hidden if no study guide has been generated yet for the active resume.


* When a Study Guide is generated, the canvas automatically switches to the Study Guide tab.




* **`CanvasHeaderBar`** *(Sticky Top Bar)*:
* **When on Resume Tab:** Actions for View Mode toggle (Form / Full Preview), Export Resume PDF, and Save Changes.


* **Save Resume Button:** Conditionally rendered; **hidden when `isDirty === false**`.


* **When on Study Guide Tab:** Action for **Export Study Guide to PDF**.




* **`ResumeContentContainer`** *(Active Tab: Resume)*:
* Renders `ResumeFormEditor`, Preview mode, or `OptimizationDiffView` (split-screen comparison with "Accept/Reject" controls).


* Renders an **ATS-Friendly, Professional Two-Column CV layout** optimized for IT/Software Engineers:


* **Monochrome Styling Rules:**
* **Text Color:** All text content across the resume must strictly use a single color (`#000000` / solid black).
* **Visual Hierarchy:** Hierarchy and visual differentiation between structural headers and paragraphs are established purely through variations in `font-size` and `font-weight`.
* **Header Consistency:** All headers of the same heading level (e.g., all `h2` elements, all `h3` elements) must share exact matching `font-size` and `font-weight` properties throughout the entire document.


* **Container & Text Containment:**
* Enforces strict bounding controls (`overflow: hidden`, `word-break: break-word`, `hyphens: auto`) ensuring text never overflows or bleeds outside its parent container bounds.


* **Semantic & Column Structure:**
* Standard semantic tags (`<header>`, `<section>`, `<article>`, `<ul>`, `<li>`) for headless Puppeteer PDF compilation and ATS parsing compatibility.


* **Left Column (30% width):** Personal details, Profile Photo (if present), Contact Info, Technical Skills, Languages, Certifications.


* **Right Column (70% width):** Professional Summary, Work Experience, Technical Projects. Structured in DOM order so key experience is prioritized for ATS text extraction.








* **`StudyGuideViewer`** *(Active Tab: Study Guide)*:
* **Lightweight Learning UI:** Clean, readable document view styled with comfortable typography to reduce cognitive fatigue during study sessions.


* **Core Sections:**
1. **Concept Explanations:** Core technical concepts derived from the resume broken down into key takeaways.


2. **Simulated Interview Questions:** Role-specific technical/behavioral questions accompanied by proposed answers.


3. **Practical Exercises:** Real-world interview scenario problems and guided solution strategies.


4. **Project Execution Tips:** Tactical talking points for articulating project architectural decisions.




* **Section Contextual Interaction:** Each section contains an **"Ask AI"** trigger that opens/focuses the AI Assistant panel with section context.





---

### 3.3 Right Sidebar & AI Assistant (`src/renderer/src/features/studio/components/right-sidebar/`)

#### Top Action Buttons

1. **Create Study Guide**:
* Extracts technologies, tools, and methodologies from the active resume.


* Generates a study guide document saved locally and linked to `activeResumeId`.


* Automatically switches the Main Canvas to the **Study Guide Tab**.




2. **AI Optimization**:
* Analyzes active resume for professional tone, clarity, metric impact, and technical accuracy.


* Switches Main Canvas to `OptimizationDiffView` with proposed inline updates.




3. **AI Specific Optimization**:
* Opens a modal/drawer prompting for Target Company Information:


* **Company Name** (Required)


* **Target Role/Position** (Required)


* **Requisites / Qualifications** (Required)


* **Responsibilities** (Optional)


* **Location** (Optional)




* **Strict Data Integrity Rule:** Tailors narrative tone and highlights relevant aspects of existing experience, but **must never hallucinate or invent new technologies, skills, or experience** not present in the user's base resume.


* Switches Main Canvas to `OptimizationDiffView`.





#### `AiChatPanel`

* Interactive AI chat contextually aware of the active resume and selected Study Guide sections.


* Accepts direct inputs triggered from "Ask AI" buttons on read-only Study Guide sections.



---

## 4. Workflows & Sequence Diagrams

### 4.1 Tab Switching & Study Guide View

```
[User] -> Selects Main Canvas Tab
   │
   ├── Tab = "Resume" ──────> Renders Resume Form / Preview / Diff View
   │                           Sticky Actions: [Save (if dirty)] [Preview] [Export Resume PDF]
   │
   └── Tab = "Study Guide" ──> Renders Read-Only StudyGuideViewer
                               Sticky Actions: [Export Study Guide PDF]
                               Section Action: [Ask AI] ──> Populates Right Sidebar AI Chat

```

### 4.2 Company-Specific AI Optimization Flow

```
[User] -> Clicks "AI Specific Optimization"
   │
   ├── [Modal] Prompts for Company Name, Role, Requisites, Responsibilities (Optional), Location (Optional)
   ├── [Validation] Verifies mandatory fields
   ├── [AI Processing] Reframes existing resume points to align with job requisites (Strictly NO invented skills)
   └── [Main Canvas] Switches to OptimizationDiffView with proposed changes

```

---

## 5. Acceptance Criteria Checklist

* [ ] **Modal Component:** Resume deletion uses a custom modal component with a clearly visible, solid-color "Confirm Deletion" button.


* [ ] **Sidebar Layout:** The Studio/Home navigation button is strictly the **last option** in the sidebar menu.


* [ ] **Profile Photo Integration:** The ATS resume preview and PDF render include the profile photo if one exists in the user profile data.


* [ ] **GitHub Project Defaults:** GitHub project selection defaults to the top 3 scored projects (or the first 3 projects in reverse order if unscored), while allowing manual user modification.


* [ ] **Save Button Visibility:** The "Save Resume" button in the canvas header bar is hidden when there are no unsaved changes (`isDirty === false`).


* [ ] **Job Input Modal:** AI Specific Optimization requires an input form for Company Name, Position, Requisites, and optional Responsibilities/Location.


* [ ] **Truthful AI Optimization:** AI optimization strictly re-aligns existing resume information and never adds unsupported technologies or experience.


* [ ] **Monochrome CV Typography:** All text strictly uses single `#000000` black color. Headers are differentiated solely by `font-size` and `font-weight`, and all headers of the same tier (e.g., `h2`) share identical dimensions/weights.
* [ ] **Content Containment:** All resume text is bound within parent boxes (`word-break`, `overflow` constraints) and never extends past container edges.
* [ ] **ATS Two-Column Layout:** Resume layout enforces a 2-column ratio (30% left column / 70% right column) structured for optimal ATS parsing priority and readability.