import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import Notification from './Notification';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[40%] z-9999 pointer-events-none flex flex-col items-center">
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
