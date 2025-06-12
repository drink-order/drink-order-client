"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Check and request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
          if (permission === 'granted') {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        });
      }
    }
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  // Enhanced notification handler with multiple popup methods
  const handleNewNotification = (notification) => {
    console.log('New notification received:', notification);
    
    // Method 1: Browser Native Notification (Most Common)
    showBrowserNotification(notification);
    
    // Method 2: Custom Toast Notification (Always works)
    showCustomToast(notification);
    
    // Method 3: Play sound
    playNotificationSound();
    
    // Method 4: Window focus/alert for background tabs
    if (document.hidden && typeof window !== 'undefined') {
      // Flash the page title
      flashPageTitle(notification.title);
      
      // Try to focus the window (limited by browser security)
      try {
        window.focus();
      } catch (e) {
        console.log('Cannot focus window:', e);
      }
    }
  };

  // Method 1: Enhanced Browser Notification
  const showBrowserNotification = (notification) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      const options = {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `notification-${notification.id}`,
        renotify: false,
        requireInteraction: true, // Keep notification until user interacts
        silent: false,
        vibrate: [200, 100, 200], // Vibration pattern for mobile
        actions: [
          {
            action: 'view',
            title: 'View',
            icon: '/favicon.ico'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/favicon.ico'
          }
        ],
        data: {
          notificationId: notification.id,
          orderId: notification.order_id,
          type: notification.type
        }
      };

      const browserNotification = new Notification(notification.title, options);

      // Handle notification click
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        
        // Navigate based on notification type
        if (notification.order_id) {
          window.location.href = `/orders/${notification.order_id}`;
        } else {
          window.location.href = '/notification';
        }
      };

      // Handle action buttons (if supported)
      if ('addEventListener' in browserNotification) {
        browserNotification.addEventListener('notificationclick', (event) => {
          event.notification.close();
          
          if (event.action === 'view') {
            window.focus();
            if (notification.order_id) {
              window.location.href = `/orders/${notification.order_id}`;
            } else {
              window.location.href = '/notification';
            }
          }
          // 'dismiss' action just closes the notification
        });
      }

      // Auto-close after 10 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 10000);
    }
  };

  // Method 2: Custom Toast Notification (Fallback)
  const showCustomToast = (notification) => {
    // Create custom notification element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-[9999] transform transition-all duration-300 ease-in-out translate-x-full';
    toast.style.zIndex = '10000';
    
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="text-2xl">${getNotificationIcon(notification.type)}</div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900 text-sm">${notification.title}</h4>
          <p class="text-gray-600 text-sm mt-1">${notification.message}</p>
          <div class="flex space-x-2 mt-2">
            <button class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700" onclick="window.location.href='/notification'">
              View
            </button>
            <button class="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400" onclick="this.closest('.fixed').remove()">
              Dismiss
            </button>
          </div>
        </div>
        <button class="text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 8000);
  };

  // Method 3: Flash page title for background tabs
  const flashPageTitle = (notificationTitle) => {
    if (typeof window === 'undefined') return;
    
    const originalTitle = document.title;
    let flashCount = 0;
    const maxFlashes = 6;
    
    const flashInterval = setInterval(() => {
      document.title = flashCount % 2 === 0 ? `🔔 ${notificationTitle}` : originalTitle;
      flashCount++;
      
      if (flashCount >= maxFlashes || !document.hidden) {
        clearInterval(flashInterval);
        document.title = originalTitle;
      }
    }, 1000);
    
    // Stop flashing when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        clearInterval(flashInterval);
        document.title = originalTitle;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  // Helper function for notification icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '🛍️';
      case 'system':
        return '⚙️';
      case 'promotion':
        return '🎉';
      default:
        return '📢';
    }
  };

  // Request permission function for settings
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    }
    return 'denied';
  };

  // Test notification function
  const testNotification = () => {
    const testNotif = {
      id: 'test',
      title: 'Test Notification',
      message: 'This is a test notification to check if popups are working!',
      type: 'system',
      created_at: new Date().toISOString()
    };
    handleNewNotification(testNotif);
  };

  const notificationData = useNotifications({
    pollingInterval: 30000, // 30 seconds
    autoStart: !!user,
    onNewNotification: handleNewNotification,
  });

  return (
    <NotificationContext.Provider value={{
      ...notificationData,
      notificationPermission,
      soundEnabled,
      setSoundEnabled,
      requestNotificationPermission,
      testNotification,
      showBrowserNotification,
      showCustomToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
};