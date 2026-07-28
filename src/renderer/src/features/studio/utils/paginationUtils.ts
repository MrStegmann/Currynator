import type { ResumeData, WorkExperienceItem, ProjectItem, EducationItem, CertificationItem } from '../types/resume.types';

/**
 * Height constants for A4 paper calculations at standard 96 DPI.
 */
export const A4_CONSTANTS = {
  PAGE_WIDTH_MM: 210,
  PAGE_HEIGHT_MM: 297,
  PAGE_HEIGHT_PX: 1123, // 297mm at 96 DPI
  PADDING_PX: 90,       // 12mm top + 12mm bottom padding
  PRINTABLE_HEIGHT_PX: 1033 // PAGE_HEIGHT_PX - PADDING_PX
};

export interface RightColumnItem {
  type: 'summary' | 'experience' | 'project';
  id: string;
  data: string | WorkExperienceItem | ProjectItem;
}

export interface LeftColumnItem {
  type: 'contact' | 'skills' | 'languages' | 'education' | 'certifications';
  id: string;
  data: unknown;
}

export interface A4PageContent {
  pageNumber: number;
  showMainHeader: boolean;
  leftItems: LeftColumnItem[];
  rightItems: RightColumnItem[];
}

/**
 * Estimates the pixel height of a right-column section item based on content length.
 * @param item - Summary, WorkExperience, or TechnicalProject item.
 * @returns Estimated DOM height in pixels.
 */
export function estimateRightItemHeight(item: RightColumnItem): number {
  if (item.type === 'summary') {
    const text = item.data as string;
    return 60 + Math.ceil(text.length / 90) * 18;
  }
  if (item.type === 'experience') {
    const exp = item.data as WorkExperienceItem;
    const highlightsCount = exp.highlights ? exp.highlights.length : 0;
    const contextHeight = exp.context ? 20 : 0;
    return 55 + contextHeight + highlightsCount * 22;
  }
  if (item.type === 'project') {
    const proj = item.data as ProjectItem;
    const descLen = proj.description ? proj.description.length : 0;
    return 45 + Math.ceil(descLen / 80) * 18;
  }
  return 50;
}

/**
 * Estimates the pixel height of a left-column section item.
 * @param item - Left column section item.
 * @returns Estimated DOM height in pixels.
 */
export function estimateLeftItemHeight(item: LeftColumnItem): number {
  if (item.type === 'contact') return 120;
  if (item.type === 'skills') {
    const skills = item.data as ResumeData['skills'];
    return 40 + skills.length * 35;
  }
  if (item.type === 'languages') {
    const langs = item.data as string[];
    return 35 + langs.length * 20;
  }
  if (item.type === 'education') {
    const edus = item.data as EducationItem[];
    return 40 + edus.length * 45;
  }
  if (item.type === 'certifications') {
    const certs = item.data as CertificationItem[];
    return 40 + certs.length * 45;
  }
  return 60;
}

/**
 * Builds ordered list of left column items from resume data.
 * @param resume - Complete resume data object.
 * @returns Array of typed left column items.
 */
export function buildLeftColumnItems(resume: ResumeData): LeftColumnItem[] {
  const items: LeftColumnItem[] = [
    { type: 'contact', id: 'contact', data: resume.personalDetails }
  ];

  if (resume.skills && resume.skills.length > 0) {
    items.push({ type: 'skills', id: 'skills', data: resume.skills });
  }
  if (resume.languages && resume.languages.length > 0) {
    items.push({ type: 'languages', id: 'languages', data: resume.languages });
  }
  if (resume.education && resume.education.length > 0) {
    items.push({ type: 'education', id: 'education', data: resume.education });
  }
  if (resume.certifications && resume.certifications.length > 0) {
    items.push({ type: 'certifications', id: 'certifications', data: resume.certifications });
  }

  return items;
}

/**
 * Builds ordered list of right column items from resume data.
 * @param resume - Complete resume data object.
 * @returns Array of typed right column items.
 */
export function buildRightColumnItems(resume: ResumeData): RightColumnItem[] {
  const items: RightColumnItem[] = [];

  if (resume.summary && resume.summary.trim() !== '') {
    items.push({ type: 'summary', id: 'summary', data: resume.summary });
  }
  if (resume.experience && resume.experience.length > 0) {
    resume.experience.forEach((exp) => {
      items.push({ type: 'experience', id: `exp-${exp.id}`, data: exp });
    });
  }
  if (resume.projects && resume.projects.length > 0) {
    resume.projects.forEach((proj) => {
      items.push({ type: 'project', id: `proj-${proj.id}`, data: proj });
    });
  }

  return items;
}

/**
 * Partitions resume sections into A4 pages based on printable height limits.
 * @param resume - Resume data object to partition.
 * @param customPageHeightPx - Optional override for printable page height.
 * @returns Array of A4PageContent objects.
 */
export function partitionResumeIntoA4Pages(
  resume: ResumeData,
  customPageHeightPx: number = A4_CONSTANTS.PRINTABLE_HEIGHT_PX
): A4PageContent[] {
  const leftItems = buildLeftColumnItems(resume);
  const rightItems = buildRightColumnItems(resume);

  const headerHeight = 100;
  let currentPageNumber = 1;

  let currentLeftHeight = headerHeight;
  let currentRightHeight = headerHeight;

  let currentPageLeftItems: LeftColumnItem[] = [];
  let currentPageRightItems: RightColumnItem[] = [];

  const pages: A4PageContent[] = [];

  // Helper to commit current page
  const commitPage = (showMainHeader: boolean) => {
    pages.push({
      pageNumber: currentPageNumber,
      showMainHeader,
      leftItems: currentPageLeftItems,
      rightItems: currentPageRightItems
    });
    currentPageNumber++;
    currentPageLeftItems = [];
    currentPageRightItems = [];
    currentLeftHeight = 0;
    currentRightHeight = 0;
  };

  // Distribute right items (which drive main height)
  for (const rItem of rightItems) {
    const itemHeight = estimateRightItemHeight(rItem);
    if (currentRightHeight + itemHeight > customPageHeightPx && currentPageRightItems.length > 0) {
      // Allocate left items that fit
      while (leftItems.length > 0) {
        const lItem = leftItems[0];
        const lHeight = estimateLeftItemHeight(lItem);
        if (currentLeftHeight + lHeight <= customPageHeightPx) {
          currentPageLeftItems.push(leftItems.shift()!);
          currentLeftHeight += lHeight;
        } else {
          break;
        }
      }
      commitPage(pages.length === 0);
    }

    currentPageRightItems.push(rItem);
    currentRightHeight += itemHeight;
  }

  // Push remaining left items to final active page
  while (leftItems.length > 0) {
    currentPageLeftItems.push(leftItems.shift()!);
  }

  // Push final page
  if (currentPageRightItems.length > 0 || currentPageLeftItems.length > 0 || pages.length === 0) {
    commitPage(pages.length === 0);
  }

  return pages;
}
