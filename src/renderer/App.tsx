import React from 'react';
import { useInitStore } from './src/features/initialization/store/initStore';
import { GreetingsView } from './src/features/initialization/components/GreetingsView';
import { OnboardingForm } from './src/features/initialization/components/OnboardingForm';
import { ErrorScreen } from './src/features/initialization/components/ErrorScreen';
import { CorruptedDataModal } from './src/features/initialization/components/CorruptedDataModal';
import { Home } from './src/features/home/Home';

export const App: React.FC = () => {
  const status = useInitStore(state => state.status);
  const error = useInitStore(state => state.error);
  const checkSavedData = useInitStore(state => state.checkSavedData);
  const resetToOnboarding = useInitStore(state => state.resetToOnboarding);

  switch (status) {
    case 'loading':
      return <GreetingsView />;
    case 'no-data':
      return <OnboardingForm />;
    case 'has-data':
      return <Home />;
    case 'corrupted':
      return <CorruptedDataModal onReset={resetToOnboarding} />;
    case 'error':
      return <ErrorScreen message={error || 'Unknown error occurred'} onRetry={checkSavedData} />;
    default:
      return null;
  }
};
