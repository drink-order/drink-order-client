import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Unified polling manager that coordinates all real-time updates
 * Prevents multiple polling intervals and optimizes API calls
 */
const useUnifiedPolling = ({ 
  user, 
  onNotificationUpdate = null,
  onOrderUpdate = null,
  pollingInterval = 30000 
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const intervalRef = useRef(null);
  const lastNotificationCheck = useRef(null);
  const knownNotificationIds = useRef(new Set());
  const isInitialLoad = useRef(true);

  // Unified fetch function that gets both notifications and orders efficiently
  const fetchUpdates = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // Use Promise.all for parallel requests to optimize speed
      const requests = [
        // Lightweight notification count check
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
        }),
        // Orders for FloatingOrderButton
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ];

      const [notificationResponse, ordersResponse] = await Promise.all(requests);

      // Handle notification response
      if (notificationResponse.ok) {
        const notificationData = await notificationResponse.json();
        const newUnreadCount = notificationData.unread_count || 0;
        
        // Only fetch full notifications if count changed or first load
        if (newUnreadCount !== unreadCount || isInitialLoad.current) {
          // Fetch full notification data only when needed
          try {
            const fullNotificationsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/notifications/latest?limit=20`, 
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            
            if (fullNotificationsResponse.ok) {
              const fullData = await fullNotificationsResponse.json();
              
              // Check for new notifications to trigger popups
              if (!isInitialLoad.current && fullData.notifications) {
                const newNotifications = fullData.notifications.filter(notification => 
                  !knownNotificationIds.current.has(notification.id)
                );
                
                // Trigger popup for each new notification
                newNotifications.forEach(notification => {
                  if (onNotificationUpdate) {
                    onNotificationUpdate(notification);
                  }
                  knownNotificationIds.current.add(notification.id);
                });
              }
              
              // Update known IDs
              if (fullData.notifications) {
                fullData.notifications.forEach(notification => {
                  knownNotificationIds.current.add(notification.id);
                });
              }
              
              setNotifications(fullData.notifications || []);
              setUnreadCount(fullData.unread_count || 0);
            }
          } catch (err) {
            console.warn('Failed to fetch full notifications:', err);
            setUnreadCount(newUnreadCount);
          }
        } else {
          setUnreadCount(newUnreadCount);
        }
      }

      // Handle orders response
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const orders = ordersData.orders || [];
        
        // Find active order for FloatingOrderButton
        const activeOrderFound = orders.find(order => 
          order.order_status === 'preparing' || order.order_status === 'ready_for_pickup'
        );
        
        if (activeOrderFound && (!activeOrder || activeOrderFound.id !== activeOrder.id)) {
          setActiveOrder(activeOrderFound);
          if (onOrderUpdate) {
            onOrderUpdate(activeOrderFound);
          }
        } else if (!activeOrderFound && activeOrder) {
          setActiveOrder(null);
          if (onOrderUpdate) {
            onOrderUpdate(null);
          }
        }
      }

      lastNotificationCheck.current = new Date().toISOString();
      isInitialLoad.current = false;

    } catch (err) {
      console.error('Unified polling error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, unreadCount, activeOrder, onNotificationUpdate, onOrderUpdate]);

  // Smart polling that adapts to page visibility
  useEffect(() => {
    if (!user) {
      // Clear data when no user
      setNotifications([]);
      setUnreadCount(0);
      setActiveOrder(null);
      return;
    }

    // Initial fetch
    fetchUpdates();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start polling with adaptive interval
    const startPolling = () => {
      intervalRef.current = setInterval(() => {
        // Only poll if page is visible (saves resources)
        if (!document.hidden) {
          fetchUpdates();
        }
      }, pollingInterval);
    };

    startPolling();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - clear interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Page visible - restart polling and fetch immediately
        fetchUpdates();
        if (!intervalRef.current) {
          startPolling();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, fetchUpdates, pollingInterval]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    return fetchUpdates();
  }, [fetchUpdates]);

  return {
    // Notification data
    notifications,
    unreadCount,
    
    // Order data
    activeOrder,
    
    // Status
    loading,
    error,
    isPolling: !!intervalRef.current,
    
    // Actions
    refreshData,
    lastCheck: lastNotificationCheck.current
  };
};

export default useUnifiedPolling;
