import { useState, useEffect, useCallback, useRef } from 'react';

const useNotifications = ({ 
  pollingInterval = 30000, 
  autoStart = true, 
  onNewNotification = null 
} = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  
  // Keep track of known notification IDs to detect new ones
  const knownNotificationIds = useRef(new Set());
  const isInitialLoad = useRef(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        return;
      }

      // Use the latest endpoint for efficient polling
      const endpoint = lastFetchTime 
        ? `/notifications/latest?since=${lastFetchTime}`
        : '/notifications';

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Update state
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
      setLastFetchTime(data.timestamp);

      // 🚀 TRIGGER POPUPS FOR NEW NOTIFICATIONS
      if (!isInitialLoad.current && data.notifications && data.notifications.length > 0) {
        // Check for truly new notifications
        const newNotifications = data.notifications.filter(notification => 
          !knownNotificationIds.current.has(notification.id)
        );

        // Trigger popup for each new notification
        newNotifications.forEach(notification => {          
          // Call the callback if provided (this connects to your NotificationContext)
          if (onNewNotification && typeof onNewNotification === 'function') {
            onNewNotification(notification);
          }
          
          // Add to known IDs
          knownNotificationIds.current.add(notification.id);
        });
      }

      // Update known notification IDs for all notifications
      if (data.notifications) {
        data.notifications.forEach(notification => {
          knownNotificationIds.current.add(notification.id);
        });
      }

      // Mark initial load as complete
      isInitialLoad.current = false;

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime, onNewNotification]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
        
        // Update the notification in the list
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (err) {
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setUnreadCount(0);
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
    } catch (err) {
    }
  }, []);

  // Test function to create backend notification
  const sendTestNotification = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/test`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Force a fetch to get the new notification
        setTimeout(() => {
          fetchNotifications();
        }, 1000);
      } else {
      }
    } catch (err) {
    }
  }, [fetchNotifications]);

  // Polling effect
  useEffect(() => {
    if (!autoStart) return;

    // Initial fetch
    fetchNotifications();

    // Set up polling
    const interval = setInterval(fetchNotifications, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchNotifications, pollingInterval, autoStart]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    sendTestNotification,
  };
};

export default useNotifications;