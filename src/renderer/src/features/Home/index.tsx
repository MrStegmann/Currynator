import React, { useState, useEffect } from 'react';
import { BasicInformation } from './components/BasicInformation';
import { GithubMetrics } from './components/GithubMetrics';
import { fetchProfileData } from './services/BasicInformation.service';
import { fetchGithubMetrics } from './services/GithubMetrics.service';
import type { HomeFeatureState } from './types';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<HomeFeatureState['profile'] | null>(null);
  const [metrics, setMetrics] = useState<HomeFeatureState['metrics'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data in parallel
        const [profileData, metricsData] = await Promise.all([
          fetchProfileData(),
          fetchGithubMetrics().catch((err: Error) => {
            console.error('Failed to load GitHub metrics:', err);
            return null; // Don't crash the whole page if GitHub fails
          })
        ]);

        if (profileData) {
          setProfile({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: profileData.email || ''
          });
        }

        if (metricsData) {
          setMetrics(metricsData);
        }
        
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while loading Home.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-on-surface">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 text-red-500 bg-red-500/10 rounded-xl border border-red-500/30">
        <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      <header className="mb-2">
        <h1 className="text-display-sm font-black text-on-surface">Home Dashboard</h1>
        <p className="text-body-lg text-on-surface-variant">Your developer profile and analytics overview.</p>
      </header>

      {/* Section One: Basic Information */}
      <section>
        {profile ? (
          <BasicInformation 
            initialProfile={profile} 
            onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)} 
          />
        ) : (
          <div className="p-6 bg-surface-card rounded-xl text-on-surface-variant border border-border-subtle">
            Profile data not found. Please complete the setup wizard.
          </div>
        )}
      </section>

      {/* Section Two: GitHub Metrics */}
      <section>
        {metrics ? (
          <GithubMetrics metrics={metrics} />
        ) : (
          <div className="p-6 bg-surface-card rounded-xl text-on-surface-variant border border-border-subtle">
            Unable to load GitHub metrics. Please ensure your token is valid.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
