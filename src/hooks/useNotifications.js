import { useNotificationContext } from '../app/context/NotificationContext';

/**
 * Simplified hook that just returns data from NotificationContext
 * The actual polling is handled by the unified system
 */
const useNotifications = ({ onNewNotification = null } = {}) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshData
  } = useNotificationContext();

  // If onNewNotification callback is provided, you could implement
  // a useEffect here to call it when notifications change
  // But it's better to handle this in the unified context

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications: refreshData, // Alias for backward compatibility
    sendTestNotification: () => {
      // This could call the backend test endpoint if needed
      console.log('Test notification via hook');
    },
  };
};

export default useNotifications;
