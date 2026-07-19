import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface ActionableTip {
  category: string;
  priority: string;
  tip: string;
  details: string;
}

interface AITipCardProps {
  tip: ActionableTip;
}

export const AITipCard: React.FC<AITipCardProps> = ({ tip }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'LOW': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'MEDIUM': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'LOW': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col bg-surface-card border border-border-subtle rounded-lg overflow-hidden transition-all duration-200">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-bright transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {getPriorityIcon(tip.priority)}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityColor(tip.priority)}`}>
                {tip.priority}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                {tip.category}
              </span>
            </div>
            <h4 className="text-sm font-medium text-on-surface mt-1">{tip.tip}</h4>
          </div>
        </div>
        <div className="text-on-surface-variant">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-border-subtle bg-surface-deep/30">
          <div className="mt-2">
            <h5 className="text-label-caps text-on-surface-variant mb-1">Detalles de Acción</h5>
            <p className="text-body-sm text-on-surface whitespace-pre-wrap">{tip.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITipCard;
