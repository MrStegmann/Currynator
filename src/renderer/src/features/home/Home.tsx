import React, { useState, useEffect } from 'react';
import { Header } from '../../shared/components/Header/Header';
import { RightNavBar } from '../../shared/components/RightNavBar/RightNavBar';
import { useResumeStore } from '../../store/useResumeStore';
import { BasicsArticle } from './BasicsArticle/BasicsArticle';
import { WorkArticle } from './WorkArticle/WorkArticle';
import { EducationArticle } from './EducationArticle/EducationArticle';
import { CertificatesArticle } from './CertificatesArticle/CertificatesArticle';
import { SkillsArticle } from './SkillsArticle/SkillsArticle';
import { LanguagesArticle } from './LanguagesArticle/LanguagesArticle';
import { ReferencesArticle } from './ReferencesArticle/ReferencesArticle';

export const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data, loadResume, isLoading, error } = useResumeStore();

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      <Header currentViewName="Home" onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        <RightNavBar isOpen={isSidebarOpen} activeView="Home" />
        
        <main
          className={`flex-1 p-6 lg:p-8 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
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
        </main>
      </div>
    </div>
  );
};
