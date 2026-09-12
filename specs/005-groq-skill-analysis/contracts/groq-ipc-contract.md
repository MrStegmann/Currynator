# Interface Contract: Groq Skill Analysis IPC Channel

## Overview
Defines the IPC bridge contract between Electron Main process (`GroqSkillController`) and Renderer process (`useResumeStore` / UI components).

---

## IPC Channel: `groq:analyze-skills`

- **Direction**: Renderer -> Main -> Renderer (Invoke / Handle)
- **Method**: `ipcRenderer.invoke('groq:analyze-skills', payload)`

### Request Payload (`GroqAnalysisRequest`)

```json
{
  "skills": [
    "React.js",
    "Node.js",
    "PostgreSQL",
    "Front-End",
    "jQuery 1.4"
  ]
}
```

### Success Response Payload (`GroqAnalysisResponse`)

```json
{
  "success": true,
  "data": [
    {
      "name": "Frontend & Web Development",
      "keywords": ["React.js"]
    },
    {
      "name": "Backend, Frameworks & Libraries",
      "keywords": ["Node.js"]
    },
    {
      "name": "Databases & Storage",
      "keywords": ["PostgreSQL"]
    },
    {
      "name": "Non-Elemental",
      "keywords": ["Front-End", "jQuery 1.4"]
    }
  ]
}
```

### Error Response Payload

```json
{
  "success": false,
  "error": "Failed to analyze skills: GROQ_API_KEY environment variable is missing."
}
```

---

## Predefined Groq Prompt Contract

```text
You are an expert Software Developer and Technical Recruiter.

**Task:**
Given a `Skills.csv` file (where the first row contains table headers and must be ignored), process and categorize every skill according to the following guidelines:
1. **Filter & Evaluate:** Select only skills that are useful and impactful for a professional Curriculum Vitae (CV).
2. **Categorize by Tech Stack:** Group valid skills into their appropriate primary tech stack category.
3. **Flag Inefficiencies:** Group redundant, outdated, or bad-practice skills under the category `Non-Elemental`.
4. **Fallback:** If a useful skill does not match any defined tech stack, place it under `Non-grouped`.

**Allowed Categories:**
* Programming Languages
* Backend, Frameworks & Libraries
* Frontend & Web Development
* Databases & Storage
* Tools & Environments
* Cloud, DevOps & Infrastructure
* Version Control & Workflows
* Testing & Quality Assurance
* Architecture & Patterns
* Methodologies & Management
* Non-Elemental
* Non-grouped

**Output Requirements:**
You MUST return **ONLY** a valid JSON array matching the structure below. Do not include any conversational preamble, postscript, or explanations.

[
  {
    "name": "Frontend & Web Development",
    "keywords": [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  }
]
```
