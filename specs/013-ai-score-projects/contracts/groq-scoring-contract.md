# Contract: Groq AI Project Scoring Service

## 1. Main Process IPC Handler (`IpcController.ts`)

### Channel: `groq:score-projects`

**Payload Interface**:
```typescript
export interface ScoreProjectsIPCRequest {
  projects: {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
    readmeContent?: string;
    commitLogs?: string[];
    fileTree?: string[];
  }[];
}
```

**Response Interface**:
```typescript
export interface ScoreProjectsIPCResponse {
  success: boolean;
  results?: {
    repoId: number;
    repoName: string;
    totalScore: number;
    evaluatedAt: string;
    logs: {
      category: string;
      title: string;
      score: number;
      log: string;
      improvements: string[];
    }[];
  }[];
  error?: string;
}
```

---

## 2. Groq Controller Method (`GroqController.ts`)

```typescript
public async scoreProject(project: ScoreProjectsIPCRequest['projects'][0]): Promise<{
  success: boolean;
  data?: AIScoreResult;
  error?: string;
}>
```

---

## 3. Strict Groq AI System Prompt Contract

**System Prompt**:
```text
You are an expert Principal Code Auditor and Technical Evaluator.
Evaluate the provided project repository payload against 7 core criteria:
1. README.md file structure
2. Presence of a real demo
3. Clean commit log history
4. Codebase structure and pattern consistency
5. Programming language best practices and naming conventions
6. Absence of console.log() or debug artifacts
7. Presence of unit or integration tests

Respond strictly with a JSON object matching this schema:
{
  "totalScore": <number between 1 and 100>,
  "logs": [
    {
      "category": "readme_structure",
      "title": "README.md Structure",
      "score": <number 1-100>,
      "log": "<detailed audit note>",
      "improvements" : "<list of improvements>"
    },
    ...
  ]
}
```
