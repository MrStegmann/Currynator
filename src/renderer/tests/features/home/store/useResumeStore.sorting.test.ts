import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useResumeStore } from '../../../../src/store/useResumeStore';
import { Resume } from '../../../../../shared/schema/resumeSchema';

describe('useResumeStore - Chronological Auto-Sorting', () => {
  beforeEach(() => {
    (window as any).electron = {
      ipcRenderer: {
        invoke: jest.fn<any>().mockResolvedValue(true)
      }
    };
  });

  it('automatically sorts work, education, and certificates newest first on loadResume', async () => {
    const rawData: Resume = {
      basics: { name: 'Jane Doe', label: 'Engineer', email: 'jane@example.com' },
      work: [
        { name: 'Old Job', position: 'Junior', startDate: '2018-01', endDate: '2020-01' },
        { name: 'Current Job', position: 'Lead', startDate: '2023-01', endDate: 'Currently' },
        { name: 'Mid Job', position: 'Senior', startDate: '2020-02', endDate: '2022-12' }
      ],
      education: [
        { institution: 'Bachelor Univ', startDate: '2014-09', endDate: '2018-06' },
        { institution: 'Master Univ', startDate: '2018-09', endDate: '2020-06' }
      ],
      certificates: [
        { name: 'Cert 2021', issuer: 'Issuer A', date: '2021-05-01' },
        { name: 'Cert 2024', issuer: 'Issuer B', date: '2024-02-15' }
      ]
    };

    (window.electron.ipcRenderer.invoke as jest.Mock).mockResolvedValueOnce(rawData);

    await useResumeStore.getState().loadResume();

    const state = useResumeStore.getState().data;
    expect(state?.work?.map(w => w.name)).toEqual(['Current Job', 'Mid Job', 'Old Job']);
    expect(state?.education?.map(e => e.institution)).toEqual(['Master Univ', 'Bachelor Univ']);
    expect(state?.certificates?.map(c => c.name)).toEqual(['Cert 2024', 'Cert 2021']);
  });

  it('automatically sorts section newest first when adding array item', async () => {
    useResumeStore.setState({
      data: {
        basics: { name: 'User', label: '', email: '' },
        work: [
          { name: 'Job 2021', position: 'Dev', startDate: '2020-01', endDate: '2021-01' }
        ]
      },
      isLoading: false,
      error: null
    });

    await useResumeStore.getState().addArrayItem('work', {
      name: 'Job 2023',
      position: 'Senior Dev',
      startDate: '2022-01',
      endDate: '2023-01'
    });

    const work = useResumeStore.getState().data?.work;
    expect(work?.map(w => w.name)).toEqual(['Job 2023', 'Job 2021']);
  });

  it('automatically re-sorts section when updating an item with new dates', async () => {
    useResumeStore.setState({
      data: {
        basics: { name: 'User', label: '', email: '' },
        education: [
          { institution: 'Degree Modern', startDate: '2020-01', endDate: '2022-01' },
          { institution: 'Degree Past', startDate: '2016-01', endDate: '2019-01' }
        ]
      },
      isLoading: false,
      error: null
    });

    // Update Degree Past to be the newest degree (e.g. 2024)
    await useResumeStore.getState().updateArrayItem('education', 1, {
      institution: 'Degree PhD',
      startDate: '2022-09',
      endDate: '2024-06'
    });

    const edu = useResumeStore.getState().data?.education;
    expect(edu?.map(e => e.institution)).toEqual(['Degree PhD', 'Degree Modern']);
  });

  it('sorts resume data when setResumeData is called', () => {
    const rawData: Resume = {
      basics: { name: 'User', label: '', email: '' },
      work: [
        { name: 'Older', startDate: '2019-01', endDate: '2020-01' },
        { name: 'Newer', startDate: '2022-01', endDate: '2023-01' }
      ]
    };

    useResumeStore.getState().setResumeData(rawData);
    expect(useResumeStore.getState().data?.work?.map(w => w.name)).toEqual(['Newer', 'Older']);
  });
});
