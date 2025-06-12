const CACHE_NAME = 'notifications-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

// Handle background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.data);
  
  event.notification.close();
  
  const { notificationId, orderId, type } = event.notification.data || {};
  
  // Determine the URL to open based on notification data
  let targetUrl = '/';
  if (orderId) {
    targetUrl = `/orders/${orderId}`;
  } else if (type === 'order') {
    targetUrl = '/orders';
  } else {
    targetUrl = '/notification';
  }
  
  // Handle action buttons
  if (event.action === 'view') {
    targetUrl = orderId ? `/orders/${orderId}` : '/notification';
  } else if (event.action === 'dismiss') {
    // Just close the notification (already done above)
    return;
  }
  
  // Open the target URL
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if the app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              data: { notificationId, orderId, type, targetUrl }
            });
            return;
          }
        }
        
        // If no existing window, open a new one
        return clients.openWindow(targetUrl);
      })
  );
});

// Handle notification close events
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.data);
  
  // Optional: Track notification dismissals
  const { notificationId } = event.notification.data || {};
  if (notificationId) {
    // You could send analytics data here
    console.log(`Notification ${notificationId} was dismissed`);
  }
});

// Handle push events (if you implement push notifications)
self.addEventListener('push', (event) => {
  console.log('Push message received:', event);
  
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon || '/favicon.ico',
    badge: notificationData.badge || '/favicon.ico',
    tag: notificationData.tag || 'general',
    requireInteraction: true,
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
    data: notificationData.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Background sync for notifications when offline
async function syncNotifications() {
  try {
    // This would sync any pending notifications when back online
    console.log('Syncing notifications in background');
    
    // You could implement logic here to fetch missed notifications
    // when the user comes back online
    
  } catch (error) {
    console.error('Error syncing notifications:', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SHOW_NOTIFICATION':
      showPersistentNotification(data);
      break;
    case 'CLEAR_NOTIFICATIONS':
      clearAllNotifications();
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

// Show a persistent notification
async function showPersistentNotification(notificationData) {
  const options = {
    body: notificationData.message,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `notification-${notificationData.id}`,
    requireInteraction: true,
    renotify: false,
    silent: false,
    vibrate: [200, 100, 200],
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
      notificationId: notificationData.id,
      orderId: notificationData.order_id,
      type: notificationData.type
    }
  };
  
  return self.registration.showNotification(notificationData.title, options);
}

// Clear all notifications
async function clearAllNotifications() {
  const notifications = await self.registration.getNotifications();
  notifications.forEach(notification => notification.close());
}
