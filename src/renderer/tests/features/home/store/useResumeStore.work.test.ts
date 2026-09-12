import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useResumeStore } from '../../../../src/store/useResumeStore';

describe('useResumeStore - analyzeWork action', () => {
  beforeEach(() => {
    useResumeStore.setState({
      data: {
        basics: { name: 'John Doe', label: 'Developer', email: 'john@example.com' },
        work: [
          {
            name: 'Acme Corp',
            position: 'Dev',
            startDate: '2020-01',
            endDate: '2021-01',
            summary: 'Built web apps.',
            highlights: ['Improved speed']
          }
        ]
      },
      isLoading: false,
      error: null
    });

    (window as any).electron = {
      ipcRenderer: {
        invoke: jest.fn<any>()
      }
    };
  });

  it('should return error if no resume data exists', async () => {
    useResumeStore.setState({ data: null });
    const result = await useResumeStore.getState().analyzeWork();
    expect(result).toEqual({ success: false, error: 'No resume data available' });
  });

  it('should invoke groq:analyze-work IPC and update work state on success', async () => {
    const mockRefinedWork = [
      {
        name: 'Acme Corp',
        position: 'Software Engineer',
        startDate: '2020-01',
        endDate: '2021-01',
        summary: 'Architected scalable web applications.',
        highlights: ['Enhanced application load speed by 35%.']
      }
    ];

    (window.electron.ipcRenderer.invoke as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockRefinedWork }) // groq:analyze-work
      .mockResolvedValueOnce(true); // resume:save

    const initialWork = useResumeStore.getState().data?.work;
    const result = await useResumeStore.getState().analyzeWork();

    expect(result).toEqual({ success: true });
    expect(window.electron.ipcRenderer.invoke).toHaveBeenNthCalledWith(
      1,
      'groq:analyze-work',
      initialWork
    );
    expect(useResumeStore.getState().data?.work).toEqual(mockRefinedWork);
  });

  it('should return error message when Groq IPC invocation returns failure', async () => {
    (window.electron.ipcRenderer.invoke as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'GROQ_API_KEY environment variable is missing.'
    });

    const result = await useResumeStore.getState().analyzeWork();

    expect(result).toEqual({
      success: false,
      error: 'GROQ_API_KEY environment variable is missing.'
    });
  });
});
