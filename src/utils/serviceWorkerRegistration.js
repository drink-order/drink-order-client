let registration = null;

export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          console.log('New Service Worker installed');
        }
      });
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'NOTIFICATION_CLICK':
          handleNotificationClick(data);
          break;
        default:
          console.log('Unknown message from SW:', type);
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

export const unregisterServiceWorker = async () => {
  if (registration) {
    try {
      const success = await registration.unregister();
      console.log('Service Worker unregistered:', success);
      registration = null;
      return success;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }
  return true;
};

export const getServiceWorkerRegistration = () => registration;

// Send message to service worker
export const sendMessageToSW = (message) => {
  if (registration && registration.active) {
    registration.active.postMessage(message);
  }
};

// Show persistent notification via service worker
export const showPersistentNotification = (notificationData) => {
  sendMessageToSW({
    type: 'SHOW_NOTIFICATION',
    data: notificationData
  });
};

// Clear all notifications via service worker
export const clearAllPersistentNotifications = () => {
  sendMessageToSW({
    type: 'CLEAR_NOTIFICATIONS'
  });
};

// Handle notification click from service worker
const handleNotificationClick = (data) => {
  const { targetUrl, notificationId, orderId, type } = data;
  
  console.log('Handling notification click:', data);
  
  // Navigate to the target URL if needed
  if (targetUrl && window.location.pathname !== targetUrl) {
    window.location.href = targetUrl;
  }
  
  // You can also dispatch custom events here
  window.dispatchEvent(new CustomEvent('notificationClick', {
    detail: { notificationId, orderId, type }
  }));
};

// Check if notifications are supported and enabled
export const checkNotificationSupport = () => {
  if (typeof window === 'undefined') return false;
  
  return {
    supported: 'Notification' in window,
    serviceWorkerSupported: 'serviceWorker' in navigator,
    permission: 'Notification' in window ? Notification.permission : 'unsupported',
    pushSupported: 'PushManager' in window
  };
};

// Request notification permission with better UX
export const requestNotificationPermissionWithFallback = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  // Request permission
  const permission = await Notification.requestPermission();
  
  // If granted, register service worker for better notification handling
  if (permission === 'granted' && !registration) {
    await registerServiceWorker();
  }
  
  return permission;
};