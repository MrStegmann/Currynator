# Quickstart & Validation Guide: Work Section AI Optimization

## Overview
This guide provides step-by-step instructions to validate the end-to-end functionality of the Work Section AI Optimization feature.

## Prerequisites
1. Valid `.env` file containing `GROQ_API_KEY=gsk_...` in project root.
2. Dependencies installed (`npm install`).

## Automated Tests Execution

Run unit tests for GroqController work analysis and WorkArticle UI interaction:

```bash
npm test tests/main/controllers/GroqController.test.ts
npm test
```

Run TypeScript compilation check:

```bash
npx tsc -b tsconfig.json
```

## Manual End-to-End Validation Steps

1. Launch application in development mode: `npm run dev`
2. Navigate to Home View -> Work section.
3. Ensure at least one work experience entry exists with summary text and highlights.
4. Verify the **"Analyze with AI"** button appears inside the section header immediately to the **left** of the Edit button.
5. Click **"Analyze with AI"**.
6. Observe loading state: button displays loading spinner and is disabled.
7. Upon completion:
   - Work section items render refined summaries and bullet points.
   - Company names, dates, URLs, and numeric figures remain unchanged.
8. Reload the app (`Ctrl+R`) and confirm the AI-refined Work data persists.
