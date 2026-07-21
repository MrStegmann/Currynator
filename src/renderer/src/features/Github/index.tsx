import React, { useState, useEffect } from 'react';
import type { UserGitHubProfile, ProjectItem } from './types';
import { ProfileHeader } from './components/ProfileHeader';
import { ProjectCard } from './components/Card/ProjectCard';
import { ProjectDetailScreen } from './components/Card/ProjectDetailScreen';

export const Github: React.FC = () => {
  const [profile, setProfile] = useState<UserGitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await (window as any).electronAPI?.analyzeGithub();
        if (res?.success && res.data) {
          setProfile(res.data);
        } else {
          setError(res?.error || 'Failed to analyze GitHub profile. Make sure you connected your GitHub account.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching GitHub data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-[#e9eaec]">Analyzing your GitHub profile...</h2>
        <p className="text-sm text-slate-400 mt-2">This may take a moment while we fetch and analyze your repositories.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-[#e9eaec]">Error Loading GitHub Data</h2>
        <p className="text-sm text-red-300 mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  if (selectedProject) {
    return <ProjectDetailScreen project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      <ProfileHeader profile={profile} />
      
      <div>
        <h3 className="text-xl font-semibold text-[#e9eaec] mb-6 flex items-center gap-2">
          <span>Repositories Analysis</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">
            {profile.projects.length} evaluated
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {profile.projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={setSelectedProject} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
