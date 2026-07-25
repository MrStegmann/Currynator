import React from 'react';
import type { ChatMessage } from '../../types/studio.types';
import { AiActionButtons } from './AiActionButtons';
import { AiChatPanel } from './AiChatPanel';

interface StudioRightSidebarProps {
  onCreateStudyGuide: () => void;
  onGeneralOptimization: () => void;
  onSpecificOptimization: () => void;
  isProcessing: boolean;
  hasActiveResume: boolean;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  injectedContext?: string | null;
  onClearInjectedContext?: () => void;
}

/**
 * Right sidebar component housing AI action buttons and interactive chat assistant.
 */
export const StudioRightSidebar: React.FC<StudioRightSidebarProps> = ({
  onCreateStudyGuide,
  onGeneralOptimization,
  onSpecificOptimization,
  isProcessing,
  hasActiveResume,
  messages,
  onSendMessage,
  injectedContext,
  onClearInjectedContext
}) => {
  return (
    <aside className="w-80 h-full p-4 bg-[#0a101d] border-l border-slate-800 flex flex-col gap-4 select-none shrink-0 overflow-hidden">
      {/* Top Action Buttons */}
      <AiActionButtons
        onCreateStudyGuide={onCreateStudyGuide}
        onGeneralOptimization={onGeneralOptimization}
        onSpecificOptimization={onSpecificOptimization}
        isProcessing={isProcessing}
        hasActiveResume={hasActiveResume}
      />

      {/* Contextual AI Chat Panel */}
      <AiChatPanel
        messages={messages}
        onSendMessage={onSendMessage}
        injectedContext={injectedContext}
        onClearInjectedContext={onClearInjectedContext}
      />
    </aside>
  );
};
