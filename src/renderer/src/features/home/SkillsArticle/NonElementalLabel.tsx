import React from 'react';
import { HelpCircle } from 'lucide-react';

export const NonElementalLabel: React.FC = () => {
  return (
    <div className="relative inline-flex items-center group cursor-help ml-2">
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-label-sm font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full select-none transition-colors">
        <HelpCircle className="w-3.5 h-3.5" />
        Skills no necesarias/prescindibles
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-72 p-3 bg-surface-container-highest text-on-surface text-body-sm rounded-lg shadow-xl border border-outline-variant z-50 pointer-events-none transition-all">
        <span className="font-semibold text-amber-600 dark:text-amber-400 mb-1 text-label-md">Non-Elemental</span>
        <p className="m-0 leading-normal text-on-surface-variant text-body-sm">
          Non-Elemental se refiere a habilidades que son redundantes, excesivamente genéricas, obsoletas, ambiguas o consideradas malas prácticas cuando se incluyen en un currículum profesional.
        </p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-surface-container-highest" />
      </div>
    </div>
  );
};
