// hooks/useNotifications.js (Fixed & Clean)
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../app/context/AuthContext';

const useNotifications = (options = {}) => {
  const {
    pollingInterval = 30000, // 30 seconds default
    autoStart = true,
    onNewNotification = null,
  } = options;

  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  
  const intervalRef = useRef(null);
  const isPollingRef = useRef(false);

  // Get token directly from localStorage
  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("auth_token");
  }, []);

  // Utility function to deduplicate notifications
  const deduplicateNotifications = useCallback((notifications) => {
    const seen = new Set();
    return notifications.filter(notification => {
      if (seen.has(notification.id)) {
        return false;
      }
      seen.add(notification.id);
      return true;
    });
  }, []);

  const apiCall = useCallback(async (endpoint, options = {}) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }, [getToken]);

  // Initial load of notifications
  const loadNotifications = useCallback(async () => {
    const token = getToken();
    
    if (!user || !token) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiCall('/notifications');
      
      // Set notifications, avoiding duplicates if there are already some loaded
      setNotifications(prev => {
        if (prev.length === 0) {
          return data.notifications || [];
        }
        // If we already have notifications, merge and deduplicate
        const allNotifications = [...(data.notifications || []), ...prev];
        return deduplicateNotifications(allNotifications);
      });
      
      setUnreadCount(data.unread_count || 0);
      setLastTimestamp(data.timestamp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, apiCall, getToken, deduplicateNotifications]);

  // Poll for new notifications
  const pollNotifications = useCallback(async () => {
    const token = getToken();
    
    if (!user || !token || !lastTimestamp) {
      return;
    }
    
    try {
      const data = await apiCall(`/notifications/latest?since=${encodeURIComponent(lastTimestamp)}`);
      
      if (data.has_new && data.notifications.length > 0) {
        // Add new notifications to the beginning of the list, avoiding duplicates
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const newNotifications = data.notifications.filter(n => !existingIds.has(n.id));
          return [...newNotifications, ...prev];
        });
        
        // Call callback for new notifications
        if (onNewNotification) {
          data.notifications.forEach(notification => {
            onNewNotification(notification);
          });
        }
      }
      
      setUnreadCount(data.unread_count || 0);
      setLastTimestamp(data.timestamp);
    } catch (err) {
      // Don't update error state for polling failures to avoid UI disruption
    }
  }, [user, lastTimestamp, apiCall, onNewNotification, getToken]);

  // Poll only unread count (lightweight)
  const pollUnreadCount = useCallback(async () => {
    const token = getToken();
    
    if (!user || !token) return;
    
    try {
      const data = await apiCall('/notifications/unread-count');
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      // Silent fail for polling
    }
  }, [user, apiCall, getToken]);

  // Start polling
  const startPolling = useCallback(() => {
    if (isPollingRef.current || !user) {
      return;
    }
    
    isPollingRef.current = true;
    
    intervalRef.current = setInterval(() => {
      // Use lightweight polling by default, full polling occasionally
      if (Math.random() > 0.8) { // 20% chance for full poll
        pollNotifications();
      } else {
        pollUnreadCount();
      }
    }, pollingInterval);
  }, [user, pollingInterval, pollNotifications, pollUnreadCount]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const data = await apiCall(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiCall('/notifications/read-all', {
        method: 'PATCH',
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // Initialize
  useEffect(() => {
    const token = getToken();
    if (user && token && autoStart) {
      loadNotifications();
    }
  }, [user, autoStart, loadNotifications, getToken]);

  // Start/stop polling based on user presence and autoStart
  useEffect(() => {
    const token = getToken();
    if (user && token && autoStart) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [user, autoStart, startPolling, stopPolling, getToken]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const token = getToken();
      if (document.hidden) {
        stopPolling();
      } else if (user && token && autoStart) {
        loadNotifications(); // Refresh when page becomes visible
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, autoStart, loadNotifications, startPolling, stopPolling, getToken]);

  // Clean up duplicates if they exist
  useEffect(() => {
    const uniqueNotifications = deduplicateNotifications(notifications);
    if (uniqueNotifications.length !== notifications.length) {
      setNotifications(uniqueNotifications);
    }
  }, [notifications, deduplicateNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    startPolling,
    stopPolling,
    isPolling: isPollingRef.current,
  };
};

export default useNotifications;