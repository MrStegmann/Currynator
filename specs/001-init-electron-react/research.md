# Research: Project Initialization

## Decision: Vite as Build Tool
- **Rationale**: Vite provides extremely fast HMR and out-of-the-box support for React + TypeScript. It is significantly faster and simpler to configure than Webpack. It has strong community plugins for Electron integration (e.g., `vite-plugin-electron`), making it the optimal choice for a modern Electron+React stack.
- **Alternatives considered**: Webpack (slower, more complex config), Electron Forge (good but sometimes opaque build process).

## Decision: MVC Pattern in Electron
- **Rationale**: The constitution mandates MVC for the Electron backend. The `main.ts` will act primarily as the application entry point and bootstrap, strictly keeping it under 100 lines. Controllers will handle IPC events, Models will handle data access (Local Storage) and validation (Zod), and Views will be responsible for BrowserWindow management.
- **Alternatives considered**: Flat architecture or monolithic main file (rejected by constitution).

## Decision: Feature-Based Architecture in React
- **Rationale**: The constitution mandates a Feature-Based architecture for the renderer. We will organize the `renderer/src/features` directory with self-contained feature slices. The initial greeting screen will be implemented as a `greeting` feature module.
- **Alternatives considered**: Classic layer-based architecture (components, hooks, utils grouped globally) (rejected by constitution).
