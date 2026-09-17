import React from 'react';
import { Search, Star, Code2, RotateCcw } from 'lucide-react';

export interface ProjectFilterBarProps {
  searchQuery: string;
  minStars: number;
  selectedLanguage: string;
  availableLanguages: string[];
  onSearchChange: (query: string) => void;
  onStarsChange: (stars: number) => void;
  onLanguageChange: (language: string) => void;
  onResetFilters: () => void;
}

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  searchQuery = '',
  minStars = 0,
  selectedLanguage = 'all',
  availableLanguages = [],
  onSearchChange,
  onStarsChange,
  onLanguageChange,
  onResetFilters
}) => {
  const query = searchQuery || '';
  const hasActiveFilters = Boolean(
    query.trim().length > 0 || (minStars || 0) > 0 || (selectedLanguage && selectedLanguage !== 'all')
  );

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Search Input Field */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by project name..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      {/* Stars Filter Dropdown */}
      <div className="relative min-w-[150px]">
        <label htmlFor="stars-filter-select" className="sr-only">Filter by stars</label>
        <div className="relative">
          <Star className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            id="stars-filter-select"
            aria-label="Filter by stars"
            value={minStars}
            onChange={e => onStarsChange(Number(e.target.value))}
            className="w-full pl-10 pr-8 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none"
          >
            <option value={0}>All Stars</option>
            <option value={5}>5+ Stars</option>
            <option value={10}>10+ Stars</option>
            <option value={25}>25+ Stars</option>
            <option value={50}>50+ Stars</option>
            <option value={100}>100+ Stars</option>
          </select>
        </div>
      </div>

      {/* Dynamic Language Filter Dropdown */}
      <div className="relative min-w-[180px]">
        <label htmlFor="language-filter-select" className="sr-only">Filter by language</label>
        <div className="relative">
          <Code2 className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            id="language-filter-select"
            aria-label="Filter by language"
            value={selectedLanguage}
            onChange={e => onLanguageChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-surface-container-high border border-outline-variant rounded-xl text-body-sm font-medium text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-on-surface-variant" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
