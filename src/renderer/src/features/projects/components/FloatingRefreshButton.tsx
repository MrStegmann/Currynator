import React from 'react';
import { RefreshCw } from 'lucide-react';

interface FloatingRefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const FloatingRefreshButton: React.FC<FloatingRefreshButtonProps> = ({
  onRefresh,
  isRefreshing
}) => {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={isRefreshing}
      aria-label="Refresh Projects"
      title="Refresh projects from GitHub"
      className="fixed top-20 right-6 z-40 p-3 bg-primary text-on-primary rounded-full shadow-lg hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 transition-all cursor-pointer border border-primary/20 flex items-center justify-center"
    >
      <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
    </button>
  );
};
