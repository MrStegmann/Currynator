import { useState, useEffect } from 'react';
import { Layout } from './layout/Layout';
import Home from './features/Home';
import InstallerWizard from './features/installer/InstallerWizard';

/**
 * Root application component.
 * Determines whether to show the first-run InstallerWizard or the main
 * authenticated layout, based on the persisted `isSetupComplete` flag.
 */
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    /**
     * Reads the persisted setup flag from the Main process via IPC.
     * Falls back to showing the main layout on any error so the app is
     * never stuck on the loading screen.
     */
    const checkSetup = async () => {
      try {
        const res = await window.electronAPI?.getSettings();
        if (res?.success) {
          setIsSetupComplete(res.data.isSetupComplete ?? false);
        } else {
          // Settings exist but returned a failure — default to setup complete
          // so the user can access the app and retry from Settings.
          setIsSetupComplete(false);
        }
      } catch {
        // IPC unavailable (e.g., running in browser dev mode) — show layout.
        setIsSetupComplete(false);
      }
    };

    checkSetup();
  }, []);

  /** Handles sidebar navigation between named pages. */
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isSetupComplete === null) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center text-[#d3e4fe]">
        Cargando...
      </div>
    );
  }

  // ── First-run wizard ────────────────────────────────────────────────────────
  if (!isSetupComplete) {
    return (
      <InstallerWizard onComplete={() => setIsSetupComplete(true)} />
    );
  }

  // ── Main authenticated layout ───────────────────────────────────────────────
  return (

    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'home' && <Home />}
    </Layout>
  );
}

export default App;
