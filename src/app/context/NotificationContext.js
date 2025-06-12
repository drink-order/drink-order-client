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

  // Initialize notification permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Play notification sound with better error handling
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    try {
      // Use a simple audio element approach first (more reliable)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGm+DyvmEfBDWH0fPTgjMGHm7A7+OZXRYLV7Le6rZZDwgudt7yim8gBSl+zO/cgCUGI2Ow7t6XVRYHRZ3l8sNgHAY');
      audio.volume = 0.5;
      audio.play().catch(e => {
        console.warn('Failed to play audio notification:', e);
        // Fallback to Web Audio API
        playWebAudioSound();
      });
    } catch (error) {
      console.warn('Audio notification failed, trying Web Audio API:', error);
      playWebAudioSound();
    }
  };

  // Fallback Web Audio API sound
  const playWebAudioSound = () => {
    try {
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

  // Service Worker notification with action buttons
  const showServiceWorkerNotification = async (notification) => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const options = {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: `notification-${notification.id}`,
        requireInteraction: true,
        silent: false,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'view',
            title: 'View',
            icon: '/logo.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/logo.png'
          }
        ],
        data: {
          notificationId: notification.id,
          orderId: notification.order_id,
          type: notification.type
        }
      };

      await registration.showNotification(notification.title, options);
    } catch (error) {
      console.error('Failed to create Service Worker notification:', error);
    }
  };

  // Enhanced notification handler with debugging
  const handleNewNotification = (notification) => {
    
    // Always show custom toast (works regardless of permission)
    showCustomToast(notification);
    
    // // Show browser notification if permission granted
    // if (notificationPermission === 'granted') {
    //   // Try Service Worker notification first (supports action buttons)
    //   if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    //     showServiceWorkerNotification(notification);
    //   } else {
    //     // Fallback to regular browser notification (no action buttons)
    //     showBrowserNotification(notification);
    //   }
    // } else {
    //   console.log('Browser notification skipped, permission:', notificationPermission);
    // }
    
    // Play sound
    playNotificationSound();
    
    // Handle background scenarios
    if (document.hidden) {
      flashPageTitle(notification.title);
      console.log('App is in background, using background notification methods');
    } else {
      console.log('App is in foreground, using foreground notification methods');
    }
  };

  // // Enhanced Browser Notification with better error handling
  // const showBrowserNotification = (notification) => {
  //   if (typeof window === 'undefined' || !('Notification' in window)) {
  //     console.log('Browser notifications not supported');
  //     return;
  //   }

  //   if (Notification.permission !== 'granted') {
  //     console.log('Browser notification permission not granted:', Notification.permission);
  //     return;
  //   }

  //   try {
  //     // Simple browser notification options (no actions - those only work with Service Worker)
  //     const options = {
  //       body: notification.message,
  //       icon: '/logo.png', // Use your actual logo
  //       badge: '/logo.png',
  //       tag: `notification-${notification.id}`,
  //       renotify: false,
  //       requireInteraction: true,
  //       silent: false,
  //       vibrate: [200, 100, 200],
  //       // Note: actions are not supported in regular Notification constructor
  //       // They only work with ServiceWorkerRegistration.showNotification()
  //       data: {
  //         notificationId: notification.id,
  //         orderId: notification.order_id,
  //         type: notification.type
  //       }
  //     };

  //     const browserNotification = new Notification(notification.title, options);
  //     console.log('✅ Browser notification created:', browserNotification);

  //     // Handle notification click
  //     browserNotification.onclick = () => {
  //       console.log('Browser notification clicked');
  //       window.focus();
  //       browserNotification.close();
        
  //       // Navigate based on notification type
  //       if (notification.order_id) {
  //         window.location.href = `/orders/${notification.order_id}`;
  //       } else {
  //         window.location.href = '/notification';
  //       }
  //     };

  //     // Auto-close after 10 seconds
  //     setTimeout(() => {
  //       browserNotification.close();
  //     }, 10000);

  //   } catch (error) {
  //     console.error('Failed to create browser notification:', error);
  //     // Fallback to service worker notification if available
  //     if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  //       showServiceWorkerNotification(notification);
  //     }
  //   }
  // };

  // Enhanced Custom Toast with better styling and positioning
  const showCustomToast = (notification) => {
    console.log('🍞 Creating custom toast notification');
    
    // Remove any existing toasts to prevent stacking
    const existingToasts = document.querySelectorAll('.custom-notification-toast');
    existingToasts.forEach(toast => toast.remove());

    // Create custom notification element
    const toast = document.createElement('div');
    toast.className = 'custom-notification-toast fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm z-[10000] transform transition-all duration-300 ease-in-out translate-x-full';
    
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="text-2xl flex-shrink-0">${getNotificationIcon(notification.type)}</div>
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-gray-900 text-sm leading-tight">${notification.title}</h4>
          <p class="text-gray-600 text-sm mt-1 leading-tight">${notification.message}</p>
          <div class="flex space-x-2 mt-3">
            <button class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors" onclick="window.location.href='/notification'">
              View
            </button>
            <button class="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition-colors" onclick="this.closest('.custom-notification-toast').remove()">
              Dismiss
            </button>
          </div>
        </div>
        <button class="text-gray-400 hover:text-gray-600 flex-shrink-0" onclick="this.closest('.custom-notification-toast').remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    // Ensure the toast is added to the body
    document.body.appendChild(toast);
    console.log('✅ Custom toast added to DOM');

    // Force a reflow to ensure the initial state is rendered
    toast.offsetHeight;

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
      console.log('✅ Custom toast animated in');
    }, 50);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
            console.log('✅ Custom toast removed');
          }
        }, 300);
      }
    }, 8000);
  };

  // Enhanced page title flashing
  const flashPageTitle = (notificationTitle) => {
    if (typeof window === 'undefined') return;
    
    const originalTitle = document.title;
    let flashCount = 0;
    const maxFlashes = 6;
    
    console.log('⚡ Starting page title flash');
    
    const flashInterval = setInterval(() => {
      document.title = flashCount % 2 === 0 ? `🔔 ${notificationTitle}` : originalTitle;
      flashCount++;
      
      if (flashCount >= maxFlashes || !document.hidden) {
        clearInterval(flashInterval);
        document.title = originalTitle;
        console.log('⚡ Page title flash ended');
      }
    }, 1000);
    
    // Stop flashing when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        clearInterval(flashInterval);
        document.title = originalTitle;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        console.log('⚡ Page title flash stopped (tab focused)');
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

  // Enhanced permission request
  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('Notifications not supported');
      return 'unsupported';
    }

    console.log('🔐 Requesting notification permission');
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      console.log('🔐 Permission result:', permission);
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted!');
      }
      
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  };

  // Enhanced test notification
  const testNotification = () => {
    console.log('🧪 Testing notification system');
    
    const testNotif = {
      id: 'test-' + Date.now(),
      title: 'Test Notification',
      message: 'This is a test notification to check if popups are working! 🎉',
      type: 'system',
      created_at: new Date().toISOString()
    };
    
    console.log('🧪 Triggering test notification:', testNotif);
    handleNewNotification(testNotif);
  };

  // Auto-request permission when user first loads (optional)
  useEffect(() => {
    if (user && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Don't auto-request immediately, wait a bit for better UX
        const timer = setTimeout(() => {
          console.log('🔐 Auto-requesting notification permission for user');
          requestNotificationPermission();
        }, 3000); // Wait 3 seconds after user login
        
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const notificationData = useNotifications({
    pollingInterval: 30000, // 30 seconds
    autoStart: !!user,
    onNewNotification: handleNewNotification, // This connects backend notifications to popups
  });

  return (
    <NotificationContext.Provider value={{
      ...notificationData,
      notificationPermission,
      soundEnabled,
      setSoundEnabled,
      requestNotificationPermission,
      testNotification,
      showServiceWorkerNotification,
      showCustomToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
};