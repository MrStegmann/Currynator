# Feature Specification: Github Project Evaluation

## Status

* **Status:** IN PROGRESS
* **Target Module:** `src/renderer/src/features/home/components/GithubMetrics.tsx`
* **Dependencies:** `main/services/github.service.ts`,

---

## 1. Overview

To achieve this, you need to build a pipeline that fetches the repository data, cleans it to avoid hitting Gemini's context limits with useless noise (like raw binary files or giant package locks), and uses a structured prompt to let the AI score and select the best ones.

Since you are evaluating code quality, standards, and practices, sending just the repository metadata (names, stars, descriptions) isn't enough—Gemini needs to see the actual code.

Here is the step-by-step strategy and implementation to build this filtering agent. 

### The Architecture
**Fetch & Filter Metadata:** Use the GitHub API to get all repositories, filtering out forks or archived projects early.
 - Skip any projects that are forks or archived.
 - Skip any projects that are empty.
 - Skip GitHub Account project used for UI theme.
 - Skip any projects that haven't a src folder with at least 1 file.

**Code Sampling:** For each repository, fetch the README.md and a few core source files (e.g., src/index.ts, App.js, or main controllers) to give the AI actual code to evaluate. Should get languages used.

**Payload Construction:** Format this into a clean JSON structure. 

**AI Evaluation:** Pass the JSON to Gemini using Structured Outputs (JSON Schema) so it returns a predictable array of the top 5 projects with scores and justifications. Rating criteria:
 - Code quality
 - Documentation quality
 - Project structure
 - Code style
 - Code organization
 - Code maintainability
 - Code scalability
 - Code testability
 - Code readability
 - Description (all projects must have one)
 - Readme.md (E.g. of good Readme.md, but don't copy it)
 ```markdown
 # Project Title

A concise, one-sentence description of what this project does and the primary problem it solves. 

<!-- Optional: Place your screenshots/GIFs here -->
<!-- ![Application Preview](path/to/screenshot.png) -->

## ✨ Features

- **Blazing Fast:** Describe the performance or architectural benefit.
- **Developer First:** Built with clean configurations and modular design.
- **Extensible:** Easily plug in custom workflows.

## 🚀 Getting Started

### Prerequisites

List any software, languages, or tools required before installing:
* Node.js >= 18.0.0
* npm >= 9.0.0

### Installation

Step-by-step guide to get your local development environment running:

```bash
# Clone the repository
git clone [https://github.com/username/project-name.git](https://github.com/username/project-name.git)

# Navigate into the directory
cd project-name

# Install dependencies
npm install
```

---

## Step 1: Define the Input JSON Structure

### Description

Instead of dumping the entire raw GitHub API response (which contains hundreds of lines of URL metadata per repo), map it to a clean, minimized JSON format.
```json
{
  "repositories": [
    {
      "name": "project-alpha",
      "description": "A full-stack tracking app built with React and Node.",
      "languages": ["TypeScript", "CSS"],
      "readme_content": "# Project Alpha...",
      "code_samples": [
        {
          "file_path": "src/server.ts",
          "content": "import express from 'express'; ..."
        }
      ]
    }
  ]
}
```

---

## Step 2: The Gemini Agent Prompt & Schema

### Description

To get reliable results, you should leverage Gemini's structured output capability. This forces the model to reply only in valid JSON matching your exact schema.

### The System Instruction
`You are an expert senior code reviewer and technical architect. Your task is to analyze a JSON payload of a developer's GitHub repositories. Evaluate the projects based on software engineering best practices, design patterns, clean code principles (SOLID, DRY), proper architecture, robust error handling, and documentation thoroughness. Select the top 5 distinct projects. If there are fewer than 5 valid development projects, return all of them. Ignore empty repositories, boilerplate template forks, or projects consisting solely of a default README.`

### The Expected Output Schema (TypeScript/JSON target)

Configure the Gemini API call to return this structure:

```json
{
  "top_projects": [
    {
      "repository_name": "string",
      "score": "number (1-100)",
      "strengths": ["string"],
      "areas_for_improvement": ["string"],
      "justification": "string"
    }
  ]
}
```

## Step 3: Implementation (Node.js / TypeScript)
### Description
Here is a complete script using the official @google/genai SDK and @octokit/rest (GitHub client) to wire this up.

```typescript
import { GoogleGenAI, Type } from '@google/genai';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getTopProjects() {
  // 1. Fetch user repositories
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 50,
  });

  const processedRepos = [];

  for (const repo of repos) {
    // Skip forks or completely empty repos up front
    if (repo.fork || repo.size === 0) continue;

    try {
      // Fetch README if it exists
      let readme = '';
      try {
        const { data: readmeData } = await octokit.repos.getReadme({
          owner: repo.owner.login,
          repo: repo.name,
          mediaType: { format: 'raw' },
        });
        readme = readmeData as unknown as string;
      } catch (e) { /* no readme */ }

      // Look for main source files to give Gemini a taste of the code quality
      const { data: treeData } = await octokit.git.getTree({
        owner: repo.owner.login,
        repo: repo.name,
        tree_sha: repo.default_branch,
        recursive: 'true',
      });

      // Filter for a couple of core code files (avoiding node_modules, lockfiles, images)
      const coreFiles = treeData.tree
        .filter(f => f.type === 'blob' && /\.(ts|js|jsx|tsx|java|py|go)$/.test(f.path || ''))
        .filter(f => !f.path?.includes('node_modules') && !f.path?.includes('dist'))
        .slice(0, 3); // Take up to 3 files for context efficiency

      const codeSamples = [];
      for (const file of coreFiles) {
        if (!file.path) continue;
        const { data: fileContent } = await octokit.repos.getContent({
          owner: repo.owner.login,
          repo: repo.name,
          path: file.path,
          mediaType: { format: 'raw' },
        });
        codeSamples.push({
          file_path: file.path,
          content: (fileContent as unknown as string).substring(0, 5000), // Cap file size
        });
      }

      processedRepos.push({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        readme_content: readme.substring(0, 3000),
        code_samples: codeSamples,
      });
    } catch (error) {
      console.error(`Skipping ${repo.name} due to processing error:`, error);
    }
  }

  // 2. Pass to Gemini with Structured JSON Output
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro', // Pro is recommended for deep code logic/pattern analysis
    contents: `Analyze these repositories and select the top 5 best ones based on code quality, architecture, and standards:\n\n${JSON.stringify(processedRepos, null, 2)}`,
    config: {
      systemInstruction: 'You are an expert technical architect. Evaluate the projects based on architecture, design patterns, clean code principles, and documentation. Select the top 5 best repositories. If there are fewer than 5 valid engineering projects, return all available.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          top_projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                repository_name: { type: Type.STRING },
                score: { type: Type.INTEGER },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                areas_for_improvement: { type: Type.ARRAY, items: { type: Type.STRING } },
                justification: { type: Type.STRING },
              },
              required: ['repository_name', 'score', 'justification'],
            },
          },
        },
        required: ['top_projects'],
      },
    },
  });

  return JSON.parse(response.text);
}
```