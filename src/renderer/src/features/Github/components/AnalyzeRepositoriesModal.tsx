import React, { useState, useEffect } from 'react';
import type { ProjectItem } from '../types';
import { X, Search, Sparkles, Loader2, CheckSquare, Square } from 'lucide-react';

interface AnalyzeRepositoriesModalProps {
  isOpen: boolean;
  projects: ProjectItem[];
  onClose: () => void;
  onStartAnalysis: (selectedIds: string[]) => void;
  isAnalyzing: boolean;
  analysisProgress: { current: number; total: number; stageText: string } | null;
}

/**
 * Modal component allowing users to select specific GitHub projects to evaluate with AI.
 */
export const AnalyzeRepositoriesModal: React.FC<AnalyzeRepositoriesModalProps> = ({
  isOpen,
  projects,
  onClose,
  onStartAnalysis,
  isAnalyzing,
  analysisProgress
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-select unscored projects by default when opened
  useEffect(() => {
    if (isOpen) {
      const unscored = projects
        .filter((p) => p.statusScore !== 'score')
        .map((p) => p.id);
      setSelectedIds(unscored.length > 0 ? unscored : projects.map((p) => p.id));
      setSearchQuery('');
    }
  }, [isOpen, projects]);

  if (!isOpen) return null;

  const handleToggleSelect = (id: string) => {
    if (isAnalyzing) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (isAnalyzing) return;
    setSelectedIds(projects.map((p) => p.id));
  };

  const handleSelectUnscored = () => {
    if (isAnalyzing) return;
    const unscored = projects.filter((p) => p.statusScore !== 'score').map((p) => p.id);
    setSelectedIds(unscored);
  };

  const handleDeselectAll = () => {
    if (isAnalyzing) return;
    setSelectedIds([]);
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.primaryLanguage && p.primaryLanguage.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = () => {
    if (selectedIds.length === 0 || isAnalyzing) return;
    onStartAnalysis(selectedIds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1d2226] border border-[#38434f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#e9eaec]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#38434f] flex items-center justify-between bg-[#14181b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Select Repositories for AI Analysis</h3>
              <p className="text-xs text-slate-400">Choose which GitHub projects to evaluate with Groq AI.</p>
            </div>
          </div>

          {!isAnalyzing && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Controls & Selection Toggles */}
        <div className="p-4 bg-[#181d21] border-b border-[#38434f] space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by repo name or language..."
                disabled={isAnalyzing}
                className="w-full pl-9 pr-3 py-1.5 bg-[#0e1215] border border-[#38434f] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectUnscored}
                disabled={isAnalyzing}
                className="px-2.5 py-1 rounded bg-[#252b31] hover:bg-[#2e363e] text-blue-400 font-medium border border-[#38434f] transition-colors disabled:opacity-50"
              >
                Unscored Only
              </button>
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={isAnalyzing}
                className="px-2.5 py-1 rounded bg-[#252b31] hover:bg-[#2e363e] text-slate-300 font-medium border border-[#38434f] transition-colors disabled:opacity-50"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                disabled={isAnalyzing}
                className="px-2.5 py-1 rounded bg-[#252b31] hover:bg-[#2e363e] text-slate-400 font-medium border border-[#38434f] transition-colors disabled:opacity-50"
              >
                Deselect All
              </button>
            </div>
          </div>
        </div>

        {/* Repositories Selection List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching repositories found.
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isSelected = selectedIds.includes(project.id);
              const isScored = project.statusScore === 'score';

              return (
                <div
                  key={project.id}
                  onClick={() => handleToggleSelect(project.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/50 text-slate-100 shadow-sm'
                      : 'bg-[#14181b] hover:bg-[#191e23] border-[#2d3741] text-slate-300'
                  } ${isAnalyzing ? 'pointer-events-none opacity-80' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="text-blue-400 shrink-0">
                      {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-600" />}
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs truncate text-slate-100">{project.name}</span>
                        <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-800 text-slate-400 font-mono">
                          {project.primaryLanguage}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {project.description || 'No description available'}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {isScored ? (
                      <span className="px-2 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono font-bold">
                        Score: {project.scores.globalScore}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[11px] font-medium">
                        Unscored
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Progress Display Bar (Active when analyzing) */}
        {isAnalyzing && analysisProgress && (
          <div className="p-4 bg-[#121619] border-t border-[#38434f] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium truncate text-blue-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                {analysisProgress.stageText}
              </span>
              <span className="font-mono font-bold">
                {analysisProgress.current} / {analysisProgress.total}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${(analysisProgress.current / analysisProgress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#38434f] bg-[#14181b] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            Selected: <strong className="text-slate-200">{selectedIds.length}</strong> of {projects.length}
          </span>

          <div className="flex items-center gap-3">
            {!isAnalyzing && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#252b31] hover:bg-[#2e363e] text-slate-300 text-xs font-medium border border-[#38434f] transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0 || isAnalyzing}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-blue-900/40 flex items-center gap-2 transition-all active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing ({analysisProgress?.current || 0}/{analysisProgress?.total || selectedIds.length})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Selected ({selectedIds.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
