import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { UserGitHubProfile } from '../types';
import { FeedbackRenderer } from './Card/FeedbackRenderer';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

interface ProfileHeaderProps {
  profile: UserGitHubProfile;
  onProfileReadmeUpdated?: (updatedReadme: any) => void;
}

const CircularProgress: React.FC<{ percentage: number; color: string; size?: number; strokeWidth?: number }> = ({ percentage, color, size = 50, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-[#38434f]"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-[10px] font-semibold text-[#e9eaec]">
        {percentage}%
      </div>
    </div>
  );
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onProfileReadmeUpdated }) => {
  const [isRefreshingReadme, setIsRefreshingReadme] = useState(false);
  const { addNotification } = useNotification();

  const handleRefreshProfileReadme = async () => {
    try {
      setIsRefreshingReadme(true);
      const res = await (window as any).electronAPI?.refetchProfileReadme();
      if (res?.success && res.data) {
        if (onProfileReadmeUpdated) {
          onProfileReadmeUpdated(res.data);
        }
        addNotification('Profile README refreshed & evaluated!', 'success');
      } else {
        addNotification(res?.error || 'Failed to refresh Profile README.', 'error');
      }
    } catch (err: any) {
      addNotification(err.message || 'Error refreshing profile README.', 'error');
    } finally {
      setIsRefreshingReadme(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 mb-8">
      
      {/* Top Languages Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#e9eaec] mb-4">Top Languages</h3>
        {profile.globalLanguages.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-6 items-center">
            {profile.globalLanguages.map(lang => (
              <div key={lang.name} className="flex items-center gap-3">
                <CircularProgress percentage={lang.percentage} color={lang.color} />
                <span className="text-[#e9eaec] text-sm font-medium">{lang.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-[#8c909f]">
            No language data found.
          </div>
        )}
      </div>

      {/* Profile README Section */}
      <div className="bg-[#1d2226] border border-[#38434f] rounded-lg p-6 shadow-sm overflow-hidden flex flex-col relative">
        <div className="flex items-center justify-between border-b border-[#38434f] pb-4 mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <img src={profile.avatarUrl} alt={profile.username} className="w-16 h-16 rounded-full border-2 border-[#38434f]" />
            <div>
              <h2 className="text-xl font-semibold text-[#e9eaec]">{profile.displayName}</h2>
              <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">
                @{profile.username}
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold bg-[#000000] border border-[#38434f] px-3 py-1 rounded-full text-blue-400">
              SCORE: {profile.profileReadme.score ?? 0}/100
            </span>

            {/* Exclusive Section Refetch Button for Profile README */}
            <button
              onClick={handleRefreshProfileReadme}
              disabled={isRefreshingReadme}
              className="px-3 py-1.5 bg-[#2d3741] hover:bg-[#38434f] text-[#e9eaec] rounded-md transition-colors text-xs font-medium border border-[#38434f] flex items-center gap-1.5 disabled:opacity-50"
              title="Refresh Account Profile README"
            >
              {isRefreshingReadme ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Refresh README</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[300px] prose prose-invert prose-sm text-[#e9eaec] mb-4 relative">
          {isRefreshingReadme && (
            <div className="absolute inset-0 bg-[#1d2226]/80 backdrop-blur-sm z-10 flex items-center justify-center gap-2 text-sm text-blue-400 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Fetching and scoring account README with Groq AI...</span>
            </div>
          )}

          {profile.profileReadme.exists ? (
            <ReactMarkdown>{profile.profileReadme.contentRaw || ''}</ReactMarkdown>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center text-3xl">📚</div>
              <h3 className="text-lg font-medium text-white mb-2">No Profile README</h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                A profile README allows you to introduce yourself to the GitHub community. It's a great place to showcase your skills, projects, and what you're currently working on.
              </p>
              <a 
                href={`https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme`} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors text-sm font-semibold"
              >
                Create Profile README
              </a>
            </div>
          )}
        </div>

        {profile.profileReadme.exists && (
          <FeedbackRenderer 
            worseParts={profile.profileReadme.worseParts || []} 
            warnings={profile.profileReadme.warnings || []} 
            tips={profile.profileReadme.tips || []} 
          />
        )}
      </div>

    </div>
  );
};
