# Feature Specification: 3-Step Setup Wizard Installer

## Status

* **Status:** IMPLEMENTED
* **Target Module:** `src/renderer/src/features/installer`
* **Dependencies:** `main/services/auth.service.ts`, `main/services/secure.service.ts`

---

## 1. Wizard Workflow Overview

The wizard orchestrates the initial application provisioning flow. Users cannot bypass steps without satisfying validation criteria. The layout must display a progress tracker highlighting the active step at the top of the interface.

---

## 2. Step-by-Step Specifications

### Step 1: User Identity & Account Linkage

* **UI Components:**
* Manual input text fields: `First Name`, `Last Name`, and `Email`.
* Action Buttons: `Sign in with Google` and `Connect GitHub Account`.

* **Behavioral Rules:**
* **Manual Entry:** If the user elects to type manually, the fields must pass basic validation format checks (e.g., non-empty strings, valid email structure) before enabling the standard "Next" navigational action.
* **OAuth Integration Flow:** Clicking either OAuth button triggers an asynchronous IPC message routing through the Main process (`auth.ipc.ts`) to launch the external system browser authentication loop. Client ID and Secret are provided in .env file.
* **Automated Progression Rule:** Upon a successful Google or GitHub callback returning user profile metadata, the system must immediately auto-populate the respective input fields and **automatically transition the interface to Step 2 within 300ms**, bypass-clicking the manual "Next" button.

### Step 2: GitHub API Provisioning

* **UI Components:**
* Secure input field: `GitHub Access Token` (character masking enabled).
* Information Panel: Chronological step-by-step text guide detailing how to generate a Personal Access Token (PAT) on GitHub.


* **Behavioral Rules:**
* **Conditional Bypass:** If the user linked their GitHub profile via OAuth in Step 1, this input field comes pre-populated with the token string, and the wizard allows immediate manual progression.
* **Manual Token Token Input:** If the token is not present, the user must input a valid token string manually. The wizard's next button remains disabled until the input length satisfies standard GitHub token format guidelines.
* **Security Injection Rule:** When submitted, the token must be securely piped via IPC directly to the Main process `secure.service.ts` to be encrypted inside the OS native keychain. It must never be saved locally in plain text format inside browser storage.

### Step 3: Target Output Directory Configuration

* **UI Components:**
* Read-only text bar displaying the currently active absolute folder path.
* Action Button: `Browse Directory`.
* Terminal Action Button: `Complete Setup`.


* **Behavioral Rules:**
* **Native Dialog Launch:** Clicking `Browse Directory` fires an IPC call triggering the Main process to launch the native operating system folder selection dialog box.
* **Default Safe Fallback:** On initial mount, the input path defaults to the user's system documents folder (e.g., `~/Documents/Currynator`).
* **Finalization:** Clicking `Complete Setup` persists the configuration paths, triggers a success state animation transition, and flags the application state as fully initialized, redirecting the user to the core application Dashboard feature space.

---

## 3. Data Schema Model (Contract)

The UI component wizard must gather and match the following structured TypeScript interface model upon final pipeline execution:

```typescript
export interface InstallerWizardState {
  step1: {
    firstName: string;
    lastName: string;
    email: string;
    authProviderUsed: 'manual' | 'google' | 'github';
  };
  step2: {
    tokenProvided: boolean;
    // Note: The actual string payload is safely sent to the secure OS keychain
  };
  step3: {
    outputDirectoryPath: string;
  };
}

```