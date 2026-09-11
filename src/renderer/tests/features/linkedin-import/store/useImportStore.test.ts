import { useImportStore } from '../../../../src/features/linkedin-import/store/useImportStore';

describe('useImportStore', () => {
  beforeEach(() => {
    useImportStore.getState().reset();
  });

  it('should initialize with default idle state', () => {
    const state = useImportStore.getState();
    expect(state.stage).toBe('idle');
    expect(state.percentage).toBe(0);
    expect(state.message).toBe('');
    expect(state.skippedOptionalFiles).toEqual([]);
  });

  it('should update progress state correctly', () => {
    useImportStore.getState().setProgress({
      stage: 'parsing',
      percentage: 50,
      message: 'Parsing Work Experience...',
      skippedOptionalFiles: ['Certifications.csv']
    });

    const state = useImportStore.getState();
    expect(state.stage).toBe('parsing');
    expect(state.percentage).toBe(50);
    expect(state.message).toBe('Parsing Work Experience...');
    expect(state.skippedOptionalFiles).toEqual(['Certifications.csv']);
  });

  it('should reset state back to idle', () => {
    useImportStore.getState().setProgress({
      stage: 'error',
      percentage: 0,
      message: 'Failed to process ZIP',
      skippedOptionalFiles: []
    });

    useImportStore.getState().reset();

    const state = useImportStore.getState();
    expect(state.stage).toBe('idle');
    expect(state.percentage).toBe(0);
  });
});
