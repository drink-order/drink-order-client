"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import useUnifiedPolling from '../../hooks/useUnifiedPolling';
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

  // Initialize notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Enhanced notification handler
  const handleNewNotification = useCallback((notification) => {
    console.log('🔔 New notification received:', notification);
    
    // Always show custom toast
    showCustomToast(notification);
    
    // Play sound if enabled
    if (soundEnabled) {
      playNotificationSound();
    }
    
    // Flash title if page is hidden
    if (document.hidden) {
      flashPageTitle(notification.title);
    }
  }, [soundEnabled]);

  // Use unified polling with notification callback
  const {
    notifications,
    unreadCount,
    activeOrder,
    loading,
    error,
    isPolling,
    refreshData
  } = useUnifiedPolling({
    user,
    onNotificationUpdate: handleNewNotification,
    pollingInterval: 30000 // 30 seconds
  });

  // Sound functions
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGm+DyvmEfBDWH0fPTgjMGHm7A7+OZXRYLV7Le6rZZDwgudt7yim8gBSl+zO/cgCUGI2Ow7t6XVRYHRZ3l8sNgHAY');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Fallback to Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      });
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, [soundEnabled]);

  // Custom toast notification
  const showCustomToast = useCallback((notification) => {
    const existingToasts = document.querySelectorAll('.custom-notification-toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = 'custom-notification-toast fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm z-[10000] transform transition-all duration-300 ease-in-out translate-x-full';
    
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'order': return '🛍️';
        case 'system': return '⚙️';
        case 'promotion': return '🎉';
        default: return '📢';
      }
    };
    
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

    document.body.appendChild(toast);
    toast.offsetHeight; // Force reflow
    
    setTimeout(() => toast.classList.remove('translate-x-full'), 50);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
      }
    }, 8000);
  }, []);

  // Flash page title
  const flashPageTitle = useCallback((notificationTitle) => {
    const originalTitle = document.title;
    let flashCount = 0;
    
    const flashInterval = setInterval(() => {
      document.title = flashCount % 2 === 0 ? `🔔 ${notificationTitle}` : originalTitle;
      flashCount++;
      
      if (flashCount >= 6 || !document.hidden) {
        clearInterval(flashInterval);
        document.title = originalTitle;
      }
    }, 1000);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        clearInterval(flashInterval);
        document.title = originalTitle;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // API functions
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
        refreshData(); // Refresh unified data
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, [refreshData]);

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
        refreshData(); // Refresh unified data
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [refreshData]);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }, []);

  const testNotification = useCallback(() => {
    const testNotif = {
      id: 'test-' + Date.now(),
      title: 'Test Notification',
      message: 'This is a test notification! 🎉',
      type: 'system',
      created_at: new Date().toISOString()
    };
    
    handleNewNotification(testNotif);
  }, [handleNewNotification]);

  return (
    <NotificationContext.Provider value={{
      // Data from unified polling
      notifications,
      unreadCount,
      activeOrder,
      loading,
      error,
      isPolling,
      
      // Settings
      notificationPermission,
      soundEnabled,
      setSoundEnabled,
      
      // Actions
      markAsRead,
      markAllAsRead,
      requestNotificationPermission,
      testNotification,
      refreshData,
      
      // Utility functions
      showCustomToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
};