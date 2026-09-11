import { describe, it, expect } from '@jest/globals';
import { parseCsvString, mapLinkedInDataToResume } from '../../models/LinkedinCsvParser.js';

describe('LinkedinCsvParser', () => {
  describe('parseCsvString', () => {
    it('should parse standard CSV header and data rows', () => {
      const csv = 'Name,Title,Company\nAlice,Developer,Acme Corp\nBob,Manager,Beta LLC';
      const result = parseCsvString(csv);
      expect(result).toEqual([
        { Name: 'Alice', Title: 'Developer', Company: 'Acme Corp' },
        { Name: 'Bob', Title: 'Manager', Company: 'Beta LLC' }
      ]);
    });

    it('should handle quoted fields with commas and line breaks', () => {
      const csv = 'Company Name,Title,Description\nAcme Corp,Developer,"Role with, comma and\nmultiline description"';
      const result = parseCsvString(csv);
      expect(result).toHaveLength(1);
      expect(result[0]['Company Name']).toBe('Acme Corp');
      expect(result[0]['Description']).toBe('Role with, comma and\nmultiline description');
    });

    it('should handle escaped double quotes within quoted fields', () => {
      const csv = 'Title,Commentary\nPost,"He said ""Hello World"""';
      const result = parseCsvString(csv);
      expect(result[0]['Commentary']).toBe('He said "Hello World"');
    });

    it('should return empty array for empty or whitespace CSV strings', () => {
      expect(parseCsvString('')).toEqual([]);
      expect(parseCsvString('   \n  ')).toEqual([]);
    });
  });

  describe('mapLinkedInDataToResume', () => {
    it('should correctly map extracted LinkedIn CSV objects to JSON Resume schema', () => {
      const profileCsv = 'First Name,Last Name,Headline,Summary,Address,Zip Code,Geo Location,Websites\nFrancisco,Jiménez,Software Engineer,Experienced full-stack dev,Calle Main 12,29640,"Fuengirola, Malaga, Spain",[PERSONAL:https://example.com]';
      const emailCsv = 'Email Address,Confirmed,Primary\ntest@example.com,Yes,Yes';
      const phoneCsv = 'Number,Extension\n664827238,';
      const positionsCsv = 'Company Name,Title,Description,Location,Started On,Finished On\nAcme Inc,Frontend Dev,Built UI apps,,Aug 2023,Sep 2025';
      const educationCsv = 'School Name,Degree Name,Start Date,End Date\nUniversity of Science,Computer Science,Sep 2018,Jun 2022';
      const skillsCsv = 'Name\nTypeScript\nReact';
      const languagesCsv = 'Name,Proficiency\nEnglish,Professional working proficiency';
      const projectsCsv = 'Title,Description,Url,Started On,Finished On\nMy Project,Cool app,https://project.com,Jan 2024,Feb 2024';

      const resume = mapLinkedInDataToResume({
        profileCsv,
        emailCsv,
        phoneCsv,
        positionsCsv,
        educationCsv,
        skillsCsv,
        languagesCsv,
        projectsCsv
      });

      expect(resume.basics.name).toBe('Francisco Jiménez');
      expect(resume.basics.label).toBe('Software Engineer');
      expect(resume.basics.email).toBe('test@example.com');
      expect(resume.basics.phone).toBe('664827238');
      expect(resume.basics.summary).toBe('Experienced full-stack dev');
      expect(resume.basics.location?.city).toBe('Fuengirola');
      expect(resume.basics.url).toBe('https://example.com');

      expect(resume.work).toHaveLength(1);
      expect(resume.work?.[0]).toEqual({
        name: 'Acme Inc',
        position: 'Frontend Dev',
        url: '',
        startDate: 'Aug 2023',
        endDate: 'Sep 2025',
        summary: 'Built UI apps',
        highlights: ['Built UI apps']
      });

      expect(resume.education).toHaveLength(1);
      expect(resume.education?.[0]).toEqual({
        institution: 'University of Science',
        area: 'Computer Science',
        studyType: 'Computer Science',
        startDate: 'Sep 2018',
        endDate: 'Jun 2022'
      });

      expect(resume.skills).toHaveLength(2);
      expect(resume.skills?.[0]).toEqual({
        name: 'TypeScript',
        keywords: ['TypeScript']
      });

      expect(resume.languages).toHaveLength(1);
      expect(resume.languages?.[0]).toEqual({
        language: 'English',
        fluency: 'Professional working proficiency'
      });

      expect(resume.projects).toHaveLength(1);
      expect(resume.projects?.[0]).toEqual({
        title: 'My Project',
        description: 'Cool app',
        url: 'https://project.com',
        startDate: 'Jan 2024',
        endDate: 'Feb 2024'
      });
    });

    it('should default finished date to "Currently" if Finished On is empty', () => {
      const positionsCsv = 'Company Name,Title,Description,Location,Started On,Finished On\nTech Corp,Lead Engineer,Managing team,,Jan 2025,';
      const resume = mapLinkedInDataToResume({ positionsCsv });

      expect(resume.work?.[0].endDate).toBe('Currently');
    });
  });
});
