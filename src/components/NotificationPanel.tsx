
import React from 'react';
import { useStore, Notification } from '../utils/store';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const notifications = useStore(state => state.notifications);
  const markNotificationAsRead = useStore(state => state.markNotificationAsRead);
  const clearAllNotifications = useStore(state => state.clearAllNotifications);
  const formatTimeAgo = useStore(state => state.formatTimeAgo);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-16 right-4 w-80 bg-card shadow-lg rounded-lg border border-border z-50 overflow-hidden">
      <div className="p-3 border-b border-border flex justify-between items-center">
        <h3 className="font-medium">Notificaciones</h3>
        <div className="flex items-center space-x-2">
          {notifications.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Limpiar todo
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No hay notificaciones</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={`p-3 border-b border-border hover:bg-accent cursor-pointer transition-colors ${notification.read ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;