# Project Context & Architecture Map

## 1. Technical Stack

* **Desktop Runtime:** Electron (Process-Based & Modular Architecture)
* **Frontend:** React (TypeScript)
* **Styling:** Tailwind CSS (Latest Version)
* **Backend / Runtime environment:** Node.js (via Electron Main Process)
* **Data Persistence:** Local Storage (for UI preferences/non-sensitive data) & Electron Secure Storage (for API tokens and credentials)

---

## 2. Authentication & Integrations

The application manages two primary entry flows for profile data generation:

* **Google OAuth Single Sign-On:** Used to securely retrieve the user's `firstname`, `lastname`, and `email`.
* **Manual Form Input:** A fallback form letting users manually enter or edit their personal details text fields.
* **GitHub Integration:** Fetches an `Access Token` to communicate with the GitHub API, importing the user's public/private repositories, contribution metrics, and code history metadata.

---

## 3. Core Architectural Patterns

### Electron: Modular Process-Based Architecture

The system relies on strict process isolation and a modular backend structure. The `main/` directory must never contain complex business logic in a single file. Instead, features must be isolated into specialized controllers/services:

* **Main Entry (`/src/main/index.ts`):** Only handles application initialization, lifecycle events, and window creation.
* **IPC Handlers (`/src/main/ipc/`):** Dedicated files that listen for specific frontend requests (e.g., `authIpc.ts`, `storageIpc.ts`) and forward them to the correct service.
* **Services (`/src/main/services/`):** Pure Node.js files executing heavy background logic (e.g., handling crypto token storage, making secure GitHub network calls).
* **Renderer Process (`/src/renderer`):** Executes the React application UI. It has **zero** direct access to Node.js built-ins or native operating system APIs.
* **Preload Scripts (`/src/preload`):** Acts as the secure bridge using `contextBridge` and `ipcRenderer` to safely pass explicit IPC messages between the Renderer and Main processes.

### React Frontend: Feature-Based Architecture

The frontend code inside the renderer process is organized around distinct domain modules (features) rather than generic technical types.

```text
src/
├── main/                       # Electron Main Process (Modular Backend)
│   ├── ipc/                    # Channel listeners & message routers
│   │   ├── auth.ipc.ts
│   │   ├── terminal.ipc.ts
│   │   ├── github.ipc.ts
│   │   └── secure.ipc.ts
│   ├── services/               # Heavy backend business logic controllers
│   │   ├── auth.service.ts     # Handles Google OAuth redirect loops
│   │   ├── terminal.service.ts # Handles terminal commands
│   │   ├── github.service.ts   # Secure API calls to GitHub
│   │   └── secure.service.ts   # Encrypted key storage operations
│   └── index.ts                # App initialization ONLY
├── preload/                    # Secure IPC bridge scripts
│   └── index.ts
└── renderer/                   # React Frontend App
    ├── src/
    │   ├── components/         # Shared global UI (Buttons, Inputs, Modals)
    │   ├── features/           # Domain-driven feature modules
    │   │   ├── InstallerWizard/           # Login buttons & token connection hooks
    │   │   │   ├── components/     # Installer Wizard components
    │   │   │   │   ├── StepOne.tsx
    │   │   │   │   ├── StepTwo.tsx
    │   │   │   │   └── StepThree.tsx
    │   │   │   ├── services/     # Installer Wizard services
    │   │   │   │   ├── StepOne.service.ts
    │   │   │   │   ├── StepTwo.service.ts
    │   │   │   │   └── StepThree.service.ts
    │   │   │   ├── types/     # Installer Wizard types
    │   │   │   │   ├── StepOne.types.ts
    │   │   │   │   ├── StepTwo.types.ts
    │   │   │   │   └── StepThree.types.ts
    │   │   │   ├── utils/     # Utilities functions
    │   │   │   └── index.tsx     # Installer Wizard core
    │   │   ├── Home/      # Home page
    │   │   │   ├── components/     # Home components
    │   │   │   │   ├── BasicInformation.tsx
    │   │   │   │   └── GithubMetrics.tsx
    │   │   │   ├── services/     # Home services
    │   │   │   │   ├── BasicInformation.service.ts
    │   │   │   │   └── GithubMetrics.service.ts
    │   │   │   ├── types/     # Home types
    │   │   │   │   ├── BasicInformation.types.ts
    │   │   │   │   └── GithubMetrics.types.ts
    │   │   │   ├── utils/     # Utilities functions
    │   │   │   └── index.tsx     # Home core
    │   │   ├── Terminal/      # Terminal page
    │   │   │   ├── components/     # Terminal components
    │   │   │   ├── services/     # Terminal services
    │   │   │   │   ├── Terminal.service.ts
    │   │   │   ├── types/     # Terminal types
    │   │   │   │   ├── Terminal.types.ts
    │   │   │   ├── utils/     # Utilities functions
    │   │   │   └── index.tsx     # Terminal core
    │   ├── hooks/              # Shared global custom React hooks
    │   └── App.tsx
    └── index.html

```

---

## 4. Development Constraints & Global Rules

1. **Security Isolation:** Never enable `nodeIntegration: true` or disable `contextIsolation` in the Electron BrowserWindow settings. All native capabilities must traverse the `preload` layer.
2. **Main File Cleanliness:** Do not write native IPC business logic inside `main/index.ts`. If you build a new backend capability, register it under `main/ipc/` and implement the logic inside `main/services/`.
3. **Sensitive Data Storage:** Never store the GitHub Access Token or Google OAuth tokens in standard browser `LocalStorage`. They must be funneled to the Main process to be encrypted and decrypted via the operating system's secure keychain.
4. **Tailwind Design Standards:** Use clean utility classes. Avoid writing custom raw CSS files unless adding specialized typography printing layouts for the final PDF export.