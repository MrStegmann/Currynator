import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';

const SECTIONS = [
  { id: 'basics', label: 'Basics', icon: '👤' },
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'volunteer', label: 'Volunteer', icon: '🤝' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'awards', label: 'Awards', icon: '🏆' },
  { id: 'certificates', label: 'Certificates', icon: '📜' },
  { id: 'publications', label: 'Publications', icon: '📚' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'languages', label: 'Languages', icon: '🗣️' },
  { id: 'interests', label: 'Interests', icon: '❤️' },
  { id: 'references', label: 'References', icon: '👍' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
];

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection } = useDashboardStore();
  
  return (
    <aside className="w-64 bg-slate-800/50 border-r border-slate-700 overflow-y-auto shrink-0 flex flex-col">
      <nav className="p-4 space-y-1">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition text-left
              ${section.id === activeSection ? 'bg-indigo-600/20 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}
            `}
          >
            <span className="text-xl">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
