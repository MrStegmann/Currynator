# Quickstart & Validation Guide: Groq API Skill Analysis & Categorization

This guide provides steps for validating the Groq API Skill Analysis and Categorization feature.

## Prerequisites

1. Ensure Node.js (v20+) and dependencies are installed: `npm install`.
2. Configure `.env` with a valid `GROQ_API_KEY`:
   ```bash
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

---

## 1. Unit & Integration Testing (TDD Validation)

Run Jest tests for the Groq Controller and Non-Elemental UI component:

```bash
npm test -- tests/main/controllers/GroqSkillController.test.ts
npm test -- tests/renderer/components/NonElementalLabel.test.tsx
```

---

## 2. End-to-End Validation Scenario

1. Launch application in development mode:
   ```bash
   npm run dev
   ```
2. Import a LinkedIn `Skills.csv` file containing skills such as `React.js`, `Python`, `HTML`, `Front-End`, and `jQuery 1.4`.
3. Verify that:
   - Skills are processed by `GroqSkillController` via `groq:analyze-skills` IPC channel.
   - Skills appear in Home View organized by tech stack categories.
   - The category `Non-Elemental` displays an adjacent floating label with text: `Skills no necesarias/prescindibles`.
   - Hovering over the floating label displays a tooltip with the definition: *"Non-Elemental se refiere a habilidades que son redundantes, excesivamente genéricas, obsoletas, ambiguas o consideradas malas prácticas cuando se incluyen en un currículum profesional."*
   - Moving cursor away hides the tooltip cleanly.
