import React, { useState, useEffect } from 'react';
import { Header } from '../../shared/components/Header/Header';
import { RightNavBar } from '../../shared/components/RightNavBar/RightNavBar';
import { DynamicToolbar } from '../../shared/components/DynamicToolbar/DynamicToolbar';
import { useResumeStore } from '../../store/useResumeStore';
import { useCvDashboardStore } from '../cv-dashboard/store/useCvDashboardStore';
import { useProjectsStore } from '../projects/store/useProjectsStore';
import { ActiveView } from '../../shared/types/navigation';
import { CvDashboardView } from '../cv-dashboard/components/CvDashboardView';
import { ProjectsView } from '../projects/components/ProjectsView';
import { BasicsArticle } from './BasicsArticle/BasicsArticle';
import { WorkArticle } from './WorkArticle/WorkArticle';
import { EducationArticle } from './EducationArticle/EducationArticle';
import { CertificatesArticle } from './CertificatesArticle/CertificatesArticle';
import { SkillsArticle } from './SkillsArticle/SkillsArticle';
import { LanguagesArticle } from './LanguagesArticle/LanguagesArticle';
import { ReferencesArticle } from './ReferencesArticle/ReferencesArticle';
import { ImportView } from '../linkedin-import/components/ImportView';

export const Home: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isToolbarOpen, setIsToolbarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isImportViewOpen, setIsImportViewOpen] = useState(false);
  const { loadResume, isLoading, error } = useResumeStore();
  const { activeView, setActiveView, setFormModalOpen } = useCvDashboardStore();
  const {
    fetchRepositories,
    scoreSelectedProjects,
    setConfirmModalOpen,
    isScoring,
    isRefreshing,
    selectedRepoIds
  } = useProjectsStore();

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 1024;
      setIsSmallScreen(small);
      if (!small) {
        setIsSidebarOpen(true);
        setIsToolbarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleToolbar = () => {
    setIsToolbarOpen((prev) => !prev);
  };

  const handleSelectView = (view: ActiveView) => {
    setIsImportViewOpen(false);
    setActiveView(view);
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  };

  const handleImportCsv = () => {
    setIsImportViewOpen(true);
  };

  const handleNewApply = () => {
    setFormModalOpen(true, null);
  };

  const handleSyncProjects = () => {
    fetchRepositories(true);
  };

  const handleScoreProjects = () => {
    const selectedCount = selectedRepoIds ? selectedRepoIds.length : 0;
    if (selectedCount > 0) {
      scoreSelectedProjects();
    } else {
      setConfirmModalOpen(true);
    }
  };

  const currentHeaderTitle = isImportViewOpen
    ? 'Import LinkedIn Data'
    : activeView === 'CV Dashboard'
    ? 'CV Dashboard'
    : activeView === 'Projects'
    ? 'Projects'
    : 'Home';

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      <Header
        currentViewName={currentHeaderTitle}
        onToggleSidebar={toggleSidebar}
        onToggleToolbar={toggleToolbar}
        showBurger={isSmallScreen}
        showToolbarToggle={isSmallScreen && !isImportViewOpen}
      />
      
      <div className="flex flex-1 relative">
        <RightNavBar
          isOpen={isSidebarOpen}
          activeView={activeView as ActiveView}
          onSelectView={handleSelectView}
        />

        {isSmallScreen && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        
        <main
          className={`flex-1 p-6 lg:p-8 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'
          } ${(!isImportViewOpen && isToolbarOpen) ? 'mr-0 lg:mr-64' : 'mr-0'}`}
        >
          {isImportViewOpen ? (
            <ImportView onBack={() => setIsImportViewOpen(false)} />
          ) : activeView === 'CV Dashboard' ? (
            <CvDashboardView />
          ) : activeView === 'Projects' ? (
            <ProjectsView />
          ) : (
            <div className="max-w-editor-max-width mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-on-surface-variant text-body-lg animate-pulse">Loading resume data...</p>
                </div>
              ) : error ? (
                <div className="bg-error-container text-on-error-container p-4 rounded-lg">
                  <p className="font-semibold">Failed to load resume</p>
                  <p className="text-body-sm mt-1">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8 pb-24">
                  <BasicsArticle />
                  <WorkArticle />
                  <EducationArticle />
                  <CertificatesArticle />
                  <SkillsArticle />
                  <LanguagesArticle />
                  <ReferencesArticle />
                </div>
              )}
            </div>
          )}
        </main>

        {isSmallScreen && !isImportViewOpen && isToolbarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsToolbarOpen(false)}
            aria-hidden="true"
          />
        )}

        {!isImportViewOpen && (
          <DynamicToolbar
            isOpen={isToolbarOpen}
            activeView={activeView as ActiveView}
            onImportCsv={handleImportCsv}
            onNewApply={handleNewApply}
            onSyncProjects={handleSyncProjects}
            onScoreProjects={handleScoreProjects}
            isScoringProjects={isScoring}
            isSyncingProjects={isRefreshing}
          />
        )}
      </div>
    </div>
  );
};
