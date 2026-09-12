import { describe, it, expect, beforeEach } from '@jest/globals';
import { useCvDashboardStore } from '../store/useCvDashboardStore';

describe('useCvDashboardStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCvDashboardStore.setState({
      cvItems: [
        {
          id: 'cv-1',
          targetVacancyTitle: 'Senior Frontend Engineer',
          jobDescriptionSnippet: 'Building modern UI applications with React & TypeScript.',
          createdAt: '2026-09-01T10:00:00Z',
          updatedAt: '2026-09-10T12:00:00Z',
        },
        {
          id: 'cv-2',
          targetVacancyTitle: 'Full Stack Developer',
          jobDescriptionSnippet: 'Full stack development with Electron, React and Node.',
          createdAt: '2026-09-02T11:00:00Z',
          updatedAt: '2026-09-11T14:30:00Z',
        },
      ],
      activeView: 'Home',
      deletingCvId: null,
    });
  });

  it('should initialize with default state and mock items', () => {
    const state = useCvDashboardStore.getState();
    expect(state.cvItems).toHaveLength(2);
    expect(state.activeView).toBe('Home');
    expect(state.deletingCvId).toBeNull();
  });

  it('should switch active view using setActiveView', () => {
    useCvDashboardStore.getState().setActiveView('CV Dashboard');
    expect(useCvDashboardStore.getState().activeView).toBe('CV Dashboard');

    useCvDashboardStore.getState().setActiveView('Home');
    expect(useCvDashboardStore.getState().activeView).toBe('Home');
  });

  it('should delete a CV item by ID using deleteCv', () => {
    useCvDashboardStore.getState().deleteCv('cv-1');
    const state = useCvDashboardStore.getState();
    expect(state.cvItems).toHaveLength(1);
    expect(state.cvItems[0].id).toBe('cv-2');
  });

  it('should set deletingCvId state for modal handling', () => {
    useCvDashboardStore.getState().setDeletingCvId('cv-2');
    expect(useCvDashboardStore.getState().deletingCvId).toBe('cv-2');

    useCvDashboardStore.getState().setDeletingCvId(null);
    expect(useCvDashboardStore.getState().deletingCvId).toBeNull();
  });
});
