import React from 'react';

interface LanguageMetric {
  name: string;
  percentage: number;
  totalBytes: number;
}

interface LanguageSpectrumProps {
  languages: LanguageMetric[];
}

// Generate consistent colors for languages
const getLanguageColor = (lang: string) => {
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

export const LanguageSpectrum: React.FC<LanguageSpectrumProps> = ({ languages }) => {
  if (!languages || languages.length === 0) {
    return (
      <div className="text-body-sm text-on-surface-variant italic py-4">
        No hay datos de lenguajes disponibles.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full h-3 rounded-full overflow-hidden">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: getLanguageColor(lang.name) }}
            className="h-full border-r border-background last:border-r-0 transition-all duration-500"
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5 text-xs">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: getLanguageColor(lang.name) }}
            />
            <span className="font-medium text-on-surface">{lang.name}</span>
            <span className="text-on-surface-variant">{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSpectrum;
