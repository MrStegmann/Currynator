import React, { useEffect } from 'react';
import { useInitStore } from './features/initialization/store/initStore';
import { GreetingsView } from './features/initialization/components/GreetingsView';
import { OnboardingForm } from './features/initialization/components/OnboardingForm';
import { ErrorScreen } from './features/initialization/components/ErrorScreen';
import { CorruptedDataModal } from './features/initialization/components/CorruptedDataModal';
import { Dashboard } from './features/dashboard/components/Dashboard';

export const App: React.FC = () => {
  const { status, checkData } = useInitStore();

  useEffect(() => {
    checkData();
  }, [checkData]);

  if (status === 'loading') {
    return <GreetingsView />;
  }

  if (status === 'onboarding') {
    return <OnboardingForm />;
  }

  if (status === 'error' || status === 'fatal_error') {
    return <ErrorScreen />;
  }

  if (status === 'corrupted_data') {
    return <CorruptedDataModal />;
  }

  if (status === 'home') {
    return <Dashboard />;
  }

  return null;
};
