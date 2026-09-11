import AdmZip from 'adm-zip';
import { ResumeStorage } from '../models/ResumeStorage.js';
import { mapLinkedInDataToResume, LinkedInRawCsvData } from '../models/LinkedinCsvParser.js';
import { Resume } from '../shared/schema/resumeSchema.js';

export interface ProgressCallbackPayload {
  stage: 'extracting' | 'parsing' | 'prompting' | 'saving' | 'complete' | 'error';
  percentage: number;
  message: string;
  skippedOptionalFiles: string[];
}

/**
 * Controller responsible for extracting, parsing, combining, and persisting
 * LinkedIn export ZIP archives into standard JSON Resume models.
 */
export class LinkedinImportController {
  constructor(private storage: ResumeStorage) {}

  /**
   * Checks whether saved resume data already exists in storage.
   */
  public checkHasExistingData(): boolean {
    const check = this.storage.checkSavedData();
    return check.exists && check.data !== null;
  }

  /**
   * Extracts a LinkedIn ZIP archive, parses available CSV files, maps them to JSON Resume,
   * and invokes the progress callback with step-by-step updates.
   */
  public parseZipFile(
    zipFilePath: string,
    onProgress?: (progress: ProgressCallbackPayload) => void
  ): { success: boolean; data?: Resume; skippedOptionalFiles: string[]; hasExistingData: boolean; error?: string } {
    const skippedOptionalFiles: string[] = [];

    try {
      if (onProgress) {
        onProgress({
          stage: 'extracting',
          percentage: 10,
          message: 'Extracting LinkedIn ZIP archive...',
          skippedOptionalFiles
        });
      }

      const zip = new AdmZip(zipFilePath);
      const zipEntries = zip.getEntries();

      if (onProgress) {
        onProgress({
          stage: 'parsing',
          percentage: 30,
          message: 'Searching for LinkedIn CSV data files...',
          skippedOptionalFiles
        });
      }

      const csvData: LinkedInRawCsvData = {};

      const readEntryText = (entryName: string, isRequired: boolean): string | undefined => {
        const entry = zipEntries.find(e => e.entryName.toLowerCase().endsWith(entryName.toLowerCase()));
        if (entry) {
          return entry.getData().toString('utf8');
        } else if (!isRequired) {
          skippedOptionalFiles.push(entryName);
        }
        return undefined;
      };

      csvData.profileCsv = readEntryText('Profile.csv', true);
      csvData.emailCsv = readEntryText('Email Addresses.csv', false);
      csvData.phoneCsv = readEntryText('PhoneNumbers.csv', false);

      if (onProgress) {
        onProgress({
          stage: 'parsing',
          percentage: 50,
          message: 'Parsing Positions and Work Experience...',
          skippedOptionalFiles
        });
      }
      csvData.positionsCsv = readEntryText('Positions.csv', true);

      if (onProgress) {
        onProgress({
          stage: 'parsing',
          percentage: 70,
          message: 'Parsing Education, Skills, and Languages...',
          skippedOptionalFiles
        });
      }
      csvData.educationCsv = readEntryText('Education.csv', false);
      csvData.skillsCsv = readEntryText('Skills.csv', false);
      csvData.languagesCsv = readEntryText('Languages.csv', false);
      csvData.projectsCsv = readEntryText('Projects.csv', false);
      csvData.certificationsCsv = readEntryText('Certifications.csv', false);

      if (onProgress) {
        onProgress({
          stage: 'parsing',
          percentage: 90,
          message: 'Mapping extracted records to JSON Resume schema...',
          skippedOptionalFiles
        });
      }

      const resumeData = mapLinkedInDataToResume(csvData);
      const hasExistingData = this.checkHasExistingData();

      if (onProgress) {
        onProgress({
          stage: 'complete',
          percentage: 100,
          message: 'LinkedIn archive parsed successfully.',
          skippedOptionalFiles
        });
      }

      return {
        success: true,
        data: resumeData,
        skippedOptionalFiles,
        hasExistingData
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to process ZIP archive';
      if (onProgress) {
        onProgress({
          stage: 'error',
          percentage: 0,
          message: errorMsg,
          skippedOptionalFiles
        });
      }
      return {
        success: false,
        skippedOptionalFiles,
        hasExistingData: false,
        error: errorMsg
      };
    }
  }

  public combineImportedData(
    importedResume: Resume,
    strategy: 'replace' | 'keep'
  ): Resume {
    if (strategy === 'replace') {
      return importedResume;
    }

    const check = this.storage.checkSavedData();
    const existing = check.data;

    if (!existing) {
      return importedResume;
    }

    return {
      basics: {
        ...importedResume.basics,
        name: existing.basics?.name || importedResume.basics?.name || 'User',
        email: existing.basics?.email || importedResume.basics?.email || 'user@example.com',
        phone: existing.basics?.phone || importedResume.basics?.phone || '',
        label: existing.basics?.label || importedResume.basics?.label || 'Professional',
        summary: existing.basics?.summary || importedResume.basics?.summary || '',
        url: existing.basics?.url || importedResume.basics?.url || '',
        location: existing.basics?.location || importedResume.basics?.location,
        profiles: [...(existing.basics?.profiles || []), ...(importedResume.basics?.profiles || [])]
      },
      work: [...(existing.work || []), ...(importedResume.work || [])],
      education: [...(existing.education || []), ...(importedResume.education || [])],
      certificates: [...(existing.certificates || []), ...(importedResume.certificates || [])],
      skills: [...(existing.skills || []), ...(importedResume.skills || [])],
      languages: [...(existing.languages || []), ...(importedResume.languages || [])],
      projects: [...(existing.projects || []), ...(importedResume.projects || [])],
      references: [...(existing.references || []), ...(importedResume.references || [])]
    };
  }

  public saveImportedResume(
    importedResume: Resume,
    strategy: 'replace' | 'keep'
  ): { success: boolean; error?: string } {
    try {
      const finalResume = this.combineImportedData(importedResume, strategy);
      this.storage.saveResumeData(finalResume);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save imported resume data' };
    }
  }
}
