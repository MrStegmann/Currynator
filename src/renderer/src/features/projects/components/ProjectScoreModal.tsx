import React, { useEffect, useRef } from 'react';
import { ProjectScoreModalProps } from '../types/projects';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';

export const ProjectScoreModal: React.FC<ProjectScoreModalProps> = ({
  isOpen,
  onClose,
  repositoryName,
  scoreResult,
  triggerRef
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store currently focused element to return focus on close
    previousActiveElement.current = (document.activeElement as HTMLElement) || triggerRef?.current || null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus initial element in modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector<HTMLElement>('button');
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400';
    if (score >= 50) return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400';
  };

  const allImprovements = scoreResult?.logs?.flatMap(l => l.improvements || []) || [];

  return (
    <div
      data-testid="score-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="score-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden focus:outline-none"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-outline-variant/60 flex items-center justify-between gap-4 bg-surface-container/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 id="score-modal-title" className="text-title-md font-bold text-on-surface truncate m-0">
                {repositoryName}
              </h3>
              <p className="text-body-xs text-on-surface-variant m-0">
                AI Repository Quality & Improvement Audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {scoreResult ? (
              <span className={`px-3 py-1 rounded-full text-label-md font-bold border flex items-center gap-1.5 ${getScoreBadgeColor(scoreResult.totalScore)}`}>
                <Sparkles className="w-4 h-4" />
                {scoreResult.totalScore}/100
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-label-md font-medium border bg-surface-container-high text-on-surface-variant border-outline-variant">
                Not Scored
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Close score details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-body-sm">
          {!scoreResult ? (
            <div className="py-12 text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto opacity-80" />
              <h4 className="text-title-sm font-semibold text-on-surface m-0">
                Not Scored Yet
              </h4>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto m-0">
                This repository has not been evaluated yet. Run the AI Project Scoring tool to generate a detailed audit breakdown and improvement tips.
              </p>
            </div>
          ) : (
            <>
              {/* Recommended Improvements Section */}
              <div className="space-y-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-body-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Recommended Repository Improvements</span>
                </div>

                {allImprovements.length > 0 ? (
                  <ul className="space-y-2 m-0 pl-1 list-none">
                    {allImprovements.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-on-surface text-body-xs leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-body-xs pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No further improvements required! Repository meets high quality standards.</span>
                  </div>
                )}
              </div>

              {/* Score Breakdown Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-on-surface font-semibold text-body-sm">
                  <Layers className="w-4 h-4 text-on-surface-variant" />
                  <span>Section Breakdown ({scoreResult.logs.length} Criteria Evaluated)</span>
                </div>

                <div className="grid gap-3">
                  {scoreResult.logs.map((logItem, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container/40 border border-outline-variant/60 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-on-surface text-body-sm">
                          {logItem.title}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-label-sm font-bold border ${getScoreBadgeColor(logItem.score)}`}>
                          {logItem.score}/100
                        </span>
                      </div>

                      {logItem.log && (
                        <p className="text-on-surface-variant text-body-xs leading-relaxed m-0">
                          {logItem.log}
                        </p>
                      )}

                      {logItem.improvements && logItem.improvements.length > 0 && (
                        <div className="pt-2 border-t border-outline-variant/40">
                          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                            Key Recommendations:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-body-xs text-on-surface-variant/90 m-0 pl-1">
                            {logItem.improvements.map((imp, impIdx) => (
                              <li key={impIdx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-outline-variant/60 bg-surface-container/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-body-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
