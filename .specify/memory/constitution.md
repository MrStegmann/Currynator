<!-- Sync Impact Report
Version: 1.2.0 -> 1.3.0
Updated Principles: Styling Constraints (added requirement to follow DESIGN.md guidelines).
-->
# Currynator Constitution

## Core Principles

### I. Architecture & Frameworks
- MUST use Electron with TypeScript for both main and renderer processes.
- MUST use React with TypeScript for the renderer interface.
- MUST use a Feature-Based architecture pattern for the renderer.
- MUST use an MVC (Model-View-Controller) architecture pattern for the Electron backend.
- MUST use SOLID principles for code organization and structure.

### II. Main Process Constraints
- The Electron `main.ts` file MUST be strictly kept below 100 lines of code.

### III. State & Data Management
- MUST use Zustand for global state management.
- MUST use Local Storage for data persistence.
- MUST adhere to the JSON Resume format for user data storage. Example schema:
  ```json
  {
    "basics": {
      "name": "John Doe",
      "label": "Programmer",
      "image": "",
      "email": "john@gmail.com",
      "phone": "(912) 555-4321",
      "url": "https://johndoe.com",
      "summary": "A summary of John Doe…",
      "location": {
        "address": "2712 Broadway St",
        "postalCode": "CA 94115",
        "city": "San Francisco",
        "countryCode": "US",
        "region": "California"
      },
      "profiles": [{
        "network": "Twitter",
        "username": "john",
        "url": "https://twitter.com/john"
      }]
    },
    "work": [{
      "name": "Company",
      "position": "President",
      "url": "https://company.com",
      "startDate": "2013-01-01",
      "endDate": "2014-01-01",
      "summary": "Description…",
      "highlights": [
        "Started the company"
      ]
    }],
    "education": [{
      "institution": "University",
      "area": "Software Development",
      "studyType": "Bachelor",
      "startDate": "2011-01-01",
      "endDate": "2013-01-01"
    }],
    "certificates": [{
      "name": "Certificate",
      "date": "2021-11-07",
      "issuer": "Company",
      "url": "https://certificate.com"
    }],
    "skills": [{
      "name": "Web Development",
      "keywords": [
        "HTML",
        "CSS",
        "JavaScript"
      ]
    }],
    "languages": [{
      "language": "English",
      "fluency": "Native speaker"
    }],
    "references": [{
      "name": "Jane Doe",
      "reference": "Reference…"
    }],
    "projects": [{
      "name": "Project",
      "description": "Description...",
      "highlights": [
        "Won award at AIHacks 2016"
      ],
      "url": "https://project.com/"
    }]
  }
  ```
- MUST use Zod for all data validation.

### IV. Testing Standards
- Test-Driven Development (TDD) is MANDATORY. Tests must be written before implementation.
- MUST use Jest as the primary testing framework.

### V. Styling Constraints
- MUST follow the design system and aesthetic guidelines defined in `DESIGN.md`.
- MUST use TailwindCSS exclusively for all styling.
- Custom CSS files are strictly PROHIBITED.

### VI. Integrations & Tooling
- MUST integrate the Groq SDK.
- MUST use Playwright for PDF generation tasks.

## Governance
This constitution dictates the technical stack and architectural boundaries for the project.
Amendments require discussion and updates to this document. All code contributions MUST comply with these rules.

**Version**: 1.3.0 | **Ratified**: 2026-09-04 | **Last Amended**: 2026-09-05
