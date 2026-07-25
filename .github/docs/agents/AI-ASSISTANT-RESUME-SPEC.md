# Feature Specification: Studio Page AI Assistant

## Status

* **Status:** WIP
* **Target Module:** `src/renderer/src/features/studio/`

---

## 1. Overview

Implements the AI Assistant prompting for Study Guide Documents, AI Optimization and Specific Optimization buttons.
Study Guide document must be generated from the Resume Data. AI Assistant must read the resume data to ensure he got the must important part of the resume and generated a study guide line with links to documentation of the stack, language, frameworks, tools, etc. Also must provide a simulated interview to help user prepare for a real interview.
AI Optimization must be generated from the Resume Data. AI Assistant must read the resume data to ensure he got the must important part of the resume and generated a optimized resume with focus on ATS (Applicant Tracking System). Is mandatory to NOT add new skills or words thats isn't in the resume. AI must ONLY modify verbs and sentence structure to improve the ATS score.
Specific Optimization must be generated from the Resume Data. AI Assistant must read the resume data to ensure he got the must important part of the resume and generated a optimized resume with focus on a specific job description. Is mandatory to NOT add new skills or words thats isn't in the resume. AI must ONLY modify verbs and sentence structure to improve the ATS score.

---