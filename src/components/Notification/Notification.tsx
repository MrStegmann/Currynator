import React from 'react';
import type { NotificationType } from '../../contexts/NotificationContext';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#10B981]'; // Success Emerald
      case 'warning':
        return 'bg-[#F59E0B]'; // Warning Amber
      case 'error':
        return 'bg-[#EF4444]'; // Error Ruby
      case 'info':
      default:
        return 'bg-[#3B82F6]'; // Primary Action Blue
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between w-full p-4 mb-3 rounded-lg shadow-2xl text-white font-sans transition-all duration-300 animate-in slide-in-from-top fade-in ${getBackgroundColor()}`}
      style={{ animationDuration: '300ms' }}
    >
      <div className="flex-1 mr-4 wrap-break-word font-medium">
        {message}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 text-white opacity-80 hover:opacity-100 hover:bg-white/20 rounded-md p-1.5 transition-all outline-none"
        aria-label="Cerrar notificación"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default Notification;
