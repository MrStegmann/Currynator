import { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddData from './pages/AddData';
import ViewData from './pages/ViewData';
import GenerateCV from './pages/GenerateCV';
import GenerateGuide from './pages/GenerateGuide';
import Settings from './pages/Settings';
import Modal from './components/Modal/Modal';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [showApiAlert, setShowApiAlert] = useState<boolean>(false);
  const hasShownAlertRef = useRef(false);

  const checkApiKey = async () => {
    const res = await (window as any).electronAPI?.getSettings();
    if (res?.success) {
      const key = res.data.geminiApiKey;
      if (!key || key.trim() === '') {
        setHasApiKey(false);
        if (!hasShownAlertRef.current) {
          setShowApiAlert(true);
          hasShownAlertRef.current = true;
        }
      } else {
        setHasApiKey(true);
      }
    }
  };

  useEffect(() => {
    // Check when app starts or when navigating
    checkApiKey();
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    if (!hasApiKey && (page === 'generate-cv' || page === 'generate-guide')) {
      return; // Bloquear navegación si no hay API Key
    }

    setCurrentPage(page);
    if (page !== 'add-data' && page !== 'view-data') {
      setSelectedProfile(null);
    }
  };

  const handleEditProfile = (data: any) => {
    setSelectedProfile(data);
    setCurrentPage('add-data');
  };

  const handleViewProfile = (data: any) => {
    setSelectedProfile(data);
    setCurrentPage('view-data');
  };

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={handleNavigate} hasApiKey={hasApiKey}>
        {currentPage === 'dashboard' && <Dashboard onEditProfile={handleEditProfile} onViewProfile={handleViewProfile} />}
        {currentPage === 'add-data' && <AddData initialData={selectedProfile} />}
        {currentPage === 'view-data' && <ViewData data={selectedProfile} onBack={() => handleNavigate('dashboard')} />}
        {currentPage === 'generate-cv' && <GenerateCV />}
        {currentPage === 'generate-guide' && <GenerateGuide onSuccess={() => handleNavigate('dashboard')} />}
        {currentPage === 'settings' && <Settings onSaveSettings={checkApiKey} />}
      </Layout>

      <Modal isOpen={showApiAlert} onClose={() => setShowApiAlert(false)} title="API-Key Requerida">
        <div className="flex flex-col gap-4 text-[#d3e4fe]">
          <p>La aplicación no tiene configurada una clave API de Gemini.</p>
          <p className="text-sm text-yellow-500">
            Para poder generar currículums optimizados y guiones de estudio, necesitas configurar tu API-Key. Por favor, ve a <strong>Configuración</strong> en el menú lateral.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setShowApiAlert(false);
                handleNavigate('settings');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
            >
              Ir a Configuración
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}


export default App;
