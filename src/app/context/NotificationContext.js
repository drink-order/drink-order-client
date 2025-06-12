"use client";

import React, { createContext, useContext, useEffect } from 'react';
import useNotifications from '../../hooks/useNotifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleNewNotification = (notification) => {
    // Global notification handler
    console.log('New notification received:', notification);
    
    // Show browser notification if permission granted
    if (typeof window !== 'undefined' && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `notification-${notification.id}`, // Prevent duplicates
        renotify: false,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);

      // Handle click on browser notification
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        // You can add navigation logic here
      };
    }
  };

  const notificationData = useNotifications({
    pollingInterval: 30000, // 30 seconds
    autoStart: !!user,
    onNewNotification: handleNewNotification,
  });

  return (
    <NotificationContext.Provider value={notificationData}>
      {children}
    </NotificationContext.Provider>
  );
};