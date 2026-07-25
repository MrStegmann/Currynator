import type { ResumeData } from '../types/resume.types';
import type { StudyGuideData } from '../types/studio.types';

const RESUMES_KEY = 'currynator_studio_resumes';
const STUDY_GUIDE_PREFIX = 'currynator_study_guide_';

/**
 * Retrieves all stored resumes from local storage.
 * @returns Array of saved ResumeData objects.
 */
export function getStoredResumes(): ResumeData[] {
  try {
    const raw = localStorage.getItem(RESUMES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read resumes from local storage:', error);
    return [];
  }
}

/**
 * Saves a single resume into local storage array (insert or update).
 * @param resume - The target ResumeData to persist.
 */
export function saveStoredResume(resume: ResumeData): void {
  try {
    const list = getStoredResumes();
    const index = list.findIndex((r) => r.id === resume.id);
    const updatedResume = {
      ...resume,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      list[index] = updatedResume;
    } else {
      list.unshift(updatedResume);
    }

    localStorage.setItem(RESUMES_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save resume to local storage:', error);
  }
}

/**
 * Deletes a resume and its associated study guide from local storage.
 * @param id - The ID of the resume to delete.
 */
export function deleteStoredResume(id: string): void {
  try {
    const list = getStoredResumes().filter((r) => r.id !== id);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(list));
    localStorage.removeItem(`${STUDY_GUIDE_PREFIX}${id}`);
  } catch (error) {
    console.error('Failed to delete resume from local storage:', error);
  }
}

/**
 * Retrieves the associated study guide for a given resume ID.
 * @param resumeId - Target resume identifier.
 * @returns Linked StudyGuideData or null.
 */
export function getStoredStudyGuide(resumeId: string): StudyGuideData | null {
  try {
    const raw = localStorage.getItem(`${STUDY_GUIDE_PREFIX}${resumeId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read study guide from local storage:', error);
    return null;
  }
}

/**
 * Persists a study guide into local storage associated with a resume.
 * @param guide - Target StudyGuideData object.
 */
export function saveStoredStudyGuide(guide: StudyGuideData): void {
  try {
    localStorage.setItem(`${STUDY_GUIDE_PREFIX}${guide.resumeId}`, JSON.stringify(guide));
  } catch (error) {
    console.error('Failed to save study guide to local storage:', error);
  }
}
