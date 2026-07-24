# `SPEC.md` — AI GitHub Evaluation Engine

## Status

* **Status:** PROPOSED
* **Target Module:** `src/renderer/src/features/home/components/GithubMetrics.tsx`
* **Dependencies:** `groq-sdk`, `main/services/github.service.ts`

---

## 1. Overview

This feature processes and evaluates a developer's GitHub repositories and profile metadata to generate an AI-driven quality score (1–100) along with targeted recommendations for continuous improvement.

The architecture isolates relevant code assets (avoiding vendor/build folders and huge lock files), constructs a lean JSON payload, and streams analysis via the **Groq SDK** using the `llama-3.1-8b-instant` model.

---

## 2. Filtering & Data Collection Strategy

### 2.1 Repository Pre-Filtering

Before querying the LLM, filter out repositories meeting any of these criteria:

* Repositories where `fork == true` or `archived == true`
* Repositories with `size == 0` (empty)
* Profile utility/theme repos matching the username
* Repositories missing a `src/` directory containing at least 1 valid source file

### 2.2 Data Extraction Pipeline

For each valid repository:

1. **Metadata:** Extract name, description, primary languages, star count, and updated date.
2. **Documentation:** Fetch `README.md` content (capped at 3,000 characters).
3. **Source Code Sampling:** Fetch up to 3 core source files (e.g., `*.ts`, `*.js`, `*.py`) outside `node_modules`, `dist`, or `build` (capped at 4,000 characters per file).

---

## 3. Evaluation Criteria & Scoring System

The AI evaluates projects across **10 key pillars**:

1. **Code Quality & Readability** (DRY, SOLID principles)
2. **Architecture & Project Structure**
3. **Error Handling & Resilience**
4. **Code Maintainability & Scalability**
5. **Code Testability**
6. **Code Style & Formatting Standards**
7. **Code Organization**
8. **Description Completeness** (Mandatory across all repos)
9. **Documentation Quality** (`README.md` thoroughness following standard structure: *Title, Features, Prerequisites, Installation, Usage*)
10. **Overall Repository Health**

---

## 4. Input & Output Contracts

### 4.1 AI Input Payload (`PayloadFormat`)

```json
{
  "profile": {
    "username": "octocat",
    "bio": "Full-Stack Developer"
  },
  "repositories": [
    {
      "name": "project-alpha",
      "description": "Full-stack application built with React and Node.",
      "languages": ["TypeScript", "CSS"],
      "readme_content": "# Project Alpha\n...",
      "code_samples": [
        {
          "file_path": "src/index.ts",
          "content": "import express from 'express'..."
        }
      ]
    }
  ]
}

```

### 4.2 AI Output Structure

The AI must yield valid JSON with the following structure:

```json
{
  "overall_profile_score": 85,
  "overall_feedback": "Strong architecture and consistent structure across projects.",
  "top_projects": [
    {
      "repository_name": "project-alpha",
      "score": 92,
      "strengths": [
        "Modular folder architecture",
        "Clear setup instructions in README"
      ],
      "areas_for_improvement": [
        "Add unit tests for API controllers",
        "Implement explicit type validation on inputs"
      ],
      "justification": "Demonstrates clear separation of concerns and robust typing."
    }
  ]
}

```

---

## 5. Implementation Specification

### 5.1 System Prompt

```text
You are an expert technical architect and senior code reviewer. 
Analyze the provided JSON payload containing GitHub project details and code samples.

Evaluate each project based on:
1. Code quality, readability, and design patterns (SOLID, DRY).
2. Architecture, error handling, maintainability, and testability.
3. Documentation quality (Presence of concise description, clear README features, prerequisites, setup instructions).

Requirements:
- Return ONLY valid raw JSON matching the required schema. No markdown formatting wrapper around the JSON.
- Select up to 5 top distinct projects.
- Score each project and the profile from 1 to 100 with professional, actionable improvement suggestions.

```

### 5.2 Groq Service Implementation (`groq.service.ts`)

```javascript
import { Groq } from 'groq-sdk';

const groq = new Groq();

export async function generateGithubScore(payload) {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "system",
        "content": `You are an expert technical architect and senior code reviewer. 
Analyze the provided JSON payload containing GitHub project details and code samples.

Evaluate projects on architecture, clean code principles (SOLID, DRY), error handling, maintainability, testability, and documentation quality.

CRITICAL: Return ONLY valid JSON matching this schema without markdown codeblocks:
{
  "overall_profile_score": number,
  "overall_feedback": "string",
  "top_projects": [
    {
      "repository_name": "string",
      "score": number,
      "strengths": ["string"],
      "areas_for_improvement": ["string"],
      "justification": "string"
    }
  ]
}`
      },
      {
        "role": "user",
        "content": JSON.stringify(payload)
      }
    ],
    "model": "llama-3.1-8b-instant",
    "temperature": 0.2,
    "max_completion_tokens": 2048,
    "top_p": 1,
    "stream": true,
    "stop": null
  });

  let fullResponse = '';

  for await (const chunk of chatCompletion) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
    fullResponse += content;
  }

  return JSON.parse(fullResponse);
}

```