# Component Contract: ProjectScoreModal

## Component Signature

```tsx
import React from 'react';
import { AIScoreResult } from '../types/projects';

export interface ProjectScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryName: string;
  scoreResult?: AIScoreResult;
  triggerRef?: React.RefObject<HTMLElement>;
}

export const ProjectScoreModal: React.FC<ProjectScoreModalProps> = ({
  isOpen,
  onClose,
  repositoryName,
  scoreResult,
  triggerRef
}) => {
  // Implementation details
};
```

## Behavior & Interaction Contract

1. **Rendering**:
   - When `isOpen` is `false`, component renders `null`.
   - When `isOpen` is `true`, component renders a fixed backdrop overlay with centered modal dialog card.

2. **Header**:
   - Displays project repository name (`repositoryName`).
   - Displays total score badge (`scoreResult.totalScore/100`) or "Not Scored" badge if undefined.
   - Includes accessible close button (`aria-label="Close modal"`).

3. **Content Sections**:
   - **Section 1: Score Breakdown by Category**: Iterates over `scoreResult.logs`, rendering category title, numerical score badge (`score/100`), and detailed log explanation.
   - **Section 2: Recommended Improvements**: Consolidates all `improvements` strings from `scoreResult.logs` (or displays specific log improvement lists per section) into a highlighted recommendations section with bullet points. If no improvements exist, renders a positive completion state message.

4. **Accessibility Contract**:
   - Modal root element MUST have `role="dialog"`, `aria-modal="true"`, `aria-labelledby="score-modal-title"`.
   - Listens to `keydown` event: `Escape` key fires `onClose()`.
   - Clicking backdrop fires `onClose()`.
   - Traps tab navigation within interactive elements inside modal while open.
   - Focus returns to `triggerRef` or active trigger element upon dismissal.
