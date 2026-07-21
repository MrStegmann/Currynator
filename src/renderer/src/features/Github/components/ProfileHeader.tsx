import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { UserGitHubProfile } from '../types';

interface ProfileHeaderProps {
  profile: UserGitHubProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {/* Profile README Section */}
      <div className="flex-1 bg-[#1d2226] border border-[#38434f] rounded-lg p-6 shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 border-b border-[#38434f] pb-4 mb-4">
          <img src={profile.avatarUrl} alt={profile.username} className="w-16 h-16 rounded-full border-2 border-[#38434f]" />
          <div>
            <h2 className="text-xl font-semibold text-[#e9eaec]">{profile.displayName}</h2>
            <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">
              @{profile.username}
            </a>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto max-h-[300px] prose prose-invert prose-sm text-[#e9eaec]">
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
      </div>

      {/* Global Languages Section */}
      <div className="w-full md:w-80 flex-shrink-0 bg-[#1d2226] border border-[#38434f] rounded-lg p-6 shadow-sm flex flex-col">
        <h3 className="text-lg font-semibold text-[#e9eaec] mb-4 border-b border-[#38434f] pb-2">Top Languages</h3>
        
        {profile.globalLanguages.length > 0 ? (
          <div className="flex flex-col gap-4 mt-2">
            {profile.globalLanguages.map(lang => (
              <div key={lang.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#e9eaec] flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }}></span>
                    {lang.name}
                  </span>
                  <span className="text-[#8c909f]">{lang.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#000000] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-[#8c909f] py-4 text-center">
            No language data found.
          </div>
        )}
      </div>
    </div>
  );
};
