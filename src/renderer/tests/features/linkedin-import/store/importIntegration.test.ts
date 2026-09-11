import { useImportStore } from '../../../../src/features/linkedin-import/store/useImportStore';
import { mapLinkedInDataToResume, LinkedInRawCsvData } from '../../../../../../src/main/models/LinkedinCsvParser';

describe('LinkedIn Import Integration', () => {
  beforeEach(() => {
    useImportStore.getState().reset();
  });

  it('correctly maps raw LinkedIn CSV bundle into valid Resume object', () => {
    const rawBundle: LinkedInRawCsvData = {
      profileCsv: 'First Name,Last Name,Headline,Summary,Geo Location\nJane,Doe,Senior Engineer,Passionate builder,"San Francisco, CA, USA"',
      emailCsv: 'Email Address,Primary,Confirmed\njane@example.com,Yes,Yes',
      positionsCsv: 'Company Name,Title,Started On,Finished On,Description\nAcme Corp,Staff Dev,Jan 2020,,Building cool products',
      skillsCsv: 'Name\nTypeScript\nReact\nNode.js'
    };

    const resume = mapLinkedInDataToResume(rawBundle);

    expect(resume.basics.name).toBe('Jane Doe');
    expect(resume.basics.label).toBe('Senior Engineer');
    expect(resume.basics.email).toBe('jane@example.com');
    expect(resume.basics.location?.city).toBe('San Francisco');
    expect(resume.work).toHaveLength(1);
    expect(resume.work[0].name).toBe('Acme Corp');
    expect(resume.skills).toHaveLength(3);
    expect(resume.skills.map(s => s.name)).toEqual(['TypeScript', 'React', 'Node.js']);
  });

  it('updates store state on parse completion with skipped files report', () => {
    const store = useImportStore.getState();
    store.startImport();
    
    expect(useImportStore.getState().status).toBe('parsing');

    const mockResume = {
      basics: { name: 'Jane Doe', label: 'Engineer', email: 'jane@example.com' }
    };
    const skipped = ['Certifications.csv', 'Projects.csv'];

    store.setParsedData(mockResume, true, skipped);

    const currentState = useImportStore.getState();
    expect(currentState.status).toBe('prompting');
    expect(currentState.parsedResume).toEqual(mockResume);
    expect(currentState.hasExistingData).toBe(true);
    expect(currentState.skippedOptionalFiles).toEqual(skipped);
  });
});
