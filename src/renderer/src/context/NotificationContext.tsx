import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextValue {
  /** Queues a new notification toast on screen. */
  addNotification: (message: string, type: NotificationType) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Provides application-wide toast notification state.
 * Wrap the root <App /> with this provider so every feature module can call
 * `addNotification` without prop-drilling.
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Appends a notification to the queue and auto-dismisses it after 4 seconds.
   * @param message - Human-readable description of the event.
   * @param type - Visual severity level of the notification.
   */
  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  // ─── Toast colour mapping ────────────────────────────────────────────────

  const colourMap: Record<NotificationType, string> = {
    success: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    error:   'bg-red-500/20   border-red-500/40   text-red-300',
    warning: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    info:    'bg-blue-500/20  border-blue-500/40  text-blue-300',
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}

      {/* ── Toast container ── */}
      {notifications.length > 0 && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
          aria-live="polite"
        >
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`
                px-4 py-3 rounded-lg border text-sm font-medium shadow-lg
                backdrop-blur-md animate-in fade-in duration-300
                ${colourMap[n.type]}
              `}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the notification context value.
 * @throws {Error} If used outside of <NotificationProvider>.
 */
export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within a <NotificationProvider>.');
  }
  return ctx;
};
