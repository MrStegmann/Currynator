import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import Home from './renderer/src/features/Home';
import Terminal from './renderer/src/features/terminal';
import InstallerWizard from './renderer/src/features/installer/InstallerWizard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSetup = async () => {
      const res = await (window as any).electronAPI?.getSettings();
      if (res?.success) {
        setIsSetupComplete(res.data.isSetupComplete);
      }
    };
    checkSetup();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (isSetupComplete === null) {
    return <div className="h-screen w-screen bg-background flex items-center justify-center text-on-surface">Cargando...</div>;
  }

  if (!isSetupComplete) {
    return <InstallerWizard onComplete={() => {
      setIsSetupComplete(true);
    }} />;
  }

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {currentPage === 'home' && <Home />}
        {currentPage === 'terminal' && <Terminal onClose={() => handleNavigate('home')} />}
        {/* Deprecated {currentPage === 'add-data' && <AddData initialData={selectedProfile} />}
        {currentPage === 'view-data' && <ViewData data={selectedProfile} onBack={() => handleNavigate('home')} />}
        {currentPage === 'generate-cv' && <GenerateCV />}
        {currentPage === 'generate-guide' && <GenerateGuide onSuccess={() => handleNavigate('home')} />}
        {currentPage === 'settings' && <Settings onSaveSettings={checkApiKey} />} */}

      </Layout>
    </>
  );
}


export default App;
