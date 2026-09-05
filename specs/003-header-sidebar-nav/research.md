# Research & Decisions

## Technical Context Unknowns

1. **Form State Management**: 
   - **Decision**: Use `react-hook-form` with `@hookform/resolvers/zod`.
   - **Rationale**: The specification requires robust validation of mandatory fields and custom date logic ("Currently"). `react-hook-form` combined with Zod provides a highly optimized, standard way to handle complex form states and validation in React without excessive boilerplate.
   - **Alternatives**: Plain React state (rejected due to complexity of managing validation errors for 7 different sections).

2. **Icons**:
   - **Decision**: Use `lucide-react`.
   - **Rationale**: We need a hamburger menu and pencil icons. Lucide is a modern, clean, and lightweight icon library for React.
   - **Alternatives**: Custom SVGs (rejected as it's time-consuming and less maintainable), Heroicons (good alternative, but Lucide has a wider set).

## Best Practices

- **Feature-Based Architecture**: Store components related to the Home page and Resume Editor within `src/renderer/src/features/home/`.
- **Zustand Store**: The global state for the resume data should be managed by a Zustand store that communicates with the Electron main process via IPC to load and save to Local Storage.
- **TailwindCSS**: Leverage Tailwind for all styling, especially for the modal overlays, transitions for the sidebar, and responsive layout adjustments.
