# IPC Contract Specification: `groq:analyze-work`

## Channel Name
`groq:analyze-work`

## Communication Direction
Renderer (React) -> Main (Electron) via `window.electron.ipcRenderer.invoke('groq:analyze-work', workArray)`

## Payload & Parameters

### Request Parameter
- `workArray`: Array of `Work` objects (`Work[]`).

```json
[
  {
    "name": "Acme Corp",
    "position": "Software Dev",
    "url": "https://acme.com",
    "startDate": "2021-01",
    "endDate": "Currently",
    "summary": "Built backend APIs.",
    "highlights": ["Improved performance by 20%"]
  }
]
```

### Response Object

```typescript
export interface GroqWorkAnalysisResponse {
  success: boolean;
  data?: Work[];
  error?: string;
}
```

#### Success Example:
```json
{
  "success": true,
  "data": [
    {
      "name": "Acme Corp",
      "position": "Software Engineer",
      "url": "https://acme.com",
      "startDate": "2021-01",
      "endDate": "Currently",
      "summary": "Engineered scalable backend RESTful microservices and system components.",
      "highlights": ["Optimized application execution performance by 20%"]
    }
  ]
}
```

#### Error Example:
```json
{
  "success": false,
  "error": "GROQ_API_KEY environment variable is missing."
}
```
## Predefined Groq Prompt Contract
```text
You are an expert Software Developer and Technical Recruiter.

**Task:**
You will receive a JSON schema containing professional work experience data for a curriculum vitae. Your task is to refine and polish the text within each work experience entry to make it professional and impactful.

**Strict Constraints:**
1. Zero Hallucination: Do NOT modify, add, invent, or extrapolate any factual data, metrics, technologies, or responsibilities. 
2. Scope of Edits: You MUST ONLY correct spelling, fix grammatical errors, improve professional phrasing, and ensure proper vocabulary.
3. Bullet Point Formatting: Split long or dense highlights into clear, concise bullet points as necessary for readability.
4. Output Format: You must return valid raw JSON matching the exact same schema structure, keys, and array length as the input, with only the text values updated according to the rules above. Do not include markdown code block wrappers if returning raw JSON, or ensure the parser handles them safely.
```