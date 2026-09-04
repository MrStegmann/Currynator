# Quickstart Validation Guide

## Prerequisites
- Node.js (v18+)
- npm or yarn

## Setup Commands
```bash
npm install
```

## Run Commands
```bash
npm run dev
```

## Expected Outcomes
1. The development server (Vite) starts successfully.
2. An Electron window opens within 3 seconds.
3. The window displays the text: "Hello, World, I'm Currynator" in the center of the screen.
4. Below the greeting, an IPC success message (e.g., "pong from main") is rendered, proving the bridge works.
5. The developer console (terminal) shows 0 errors or warnings, verifying all Constitution dependencies (Tailwind, Zustand, Zod, Groq, Playwright) installed correctly without conflict.
