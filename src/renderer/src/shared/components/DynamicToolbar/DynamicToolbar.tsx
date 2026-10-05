import React from 'react';
import { Upload, Plus, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { DynamicToolbarProps } from '../../types/navigation';

export const DynamicToolbar: React.FC<DynamicToolbarProps> = ({
  isOpen = true,
  activeView,
  onImportCsv,
  onNewApply,
  onSyncProjects,
  onScoreProjects,
  isScoringProjects = false,
  isSyncingProjects = false,
}) => {
  return (
    <aside
      aria-label="Toolbar"
      className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-surface-container-lowest border-l border-outline-variant shadow-sm z-40 p-4 flex flex-col gap-4 overflow-y-auto transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full pointer-events-none p-0 border-none'
      }`}
    >

      <div className="flex flex-col gap-3">
        {activeView === 'Home' && (
          <button
            type="button"
            onClick={onImportCsv}
            aria-label="Import LinkedIn CSV"
            title="Import LinkedIn CSV"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-body-medium font-medium rounded-lg shadow-sm hover:bg-primary/90 hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            <Upload className="w-4 h-4" />
            <span>Import LinkedIn CSV</span>
          </button>
        )}

        {activeView === 'CV Dashboard' && (
          <button
            type="button"
            onClick={onNewApply}
            aria-label="New Apply"
            title="New Apply"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-body-medium font-medium rounded-lg shadow-sm hover:bg-primary/90 hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            <Plus className="w-4 h-4" />
            <span>New Apply</span>
          </button>
        )}

        {activeView === 'Projects' && (
          <>
            <button
              type="button"
              onClick={onSyncProjects}
              disabled={isSyncingProjects}
              aria-label="Sync Projects"
              title="Sync Projects"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface hover:bg-surface-container-highest text-body-medium font-medium rounded-lg shadow-sm border border-outline-variant transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingProjects ? 'animate-spin' : ''}`} />
              <span>Sync Projects</span>
            </button>

            <button
              type="button"
              onClick={onScoreProjects}
              disabled={isScoringProjects}
              aria-label="Score Projects"
              title="Score Projects"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-body-medium font-medium rounded-lg shadow-sm hover:bg-primary/90 hover:shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              {isScoringProjects ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>Score Projects</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
