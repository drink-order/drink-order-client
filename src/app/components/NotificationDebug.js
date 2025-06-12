"use client";

import React, { useState } from 'react';
import { useNotificationContext } from '../context/NotificationContext';

const NotificationDebug = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testMessage, setTestMessage] = useState('Your test order is ready for pickup!');
  const [testTitle, setTestTitle] = useState('Order Ready');
  
  const {
    notificationPermission,
    requestNotificationPermission,
    testNotification,
    showBrowserNotification,
    showCustomToast,
    soundEnabled,
    setSoundEnabled,
    sendTestNotification // Add this from useNotifications hook
  } = useNotificationContext();

  const testServiceWorkerNotification = async () => {
    if (notificationPermission !== 'granted') {
      alert('Browser notification permission not granted. Please enable it first.');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      alert('Service Worker not supported in this browser.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const options = {
        body: testMessage,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: `sw-test-${Date.now()}`,
        requireInteraction: true,
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
          notificationId: 'sw-test',
          orderId: '123',
          type: 'order'
        }
      };

      await registration.showNotification(testTitle, options);
      console.log('✅ Service Worker notification created with actions');
    } catch (error) {
      console.error('Service Worker notification failed:', error);
      alert('Service Worker notification failed: ' + error.message);
    }
  };

  // Debug info
  const debugInfo = {
    notificationSupported: typeof window !== 'undefined' && 'Notification' in window,
    permission: notificationPermission,
    serviceWorkerSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator,
    isSecureContext: typeof window !== 'undefined' && window.isSecureContext,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A'
  };

  const testCustomNotification = () => {
    const customTestNotif = {
      id: 'custom-test-' + Date.now(),
      title: testTitle,
      message: testMessage,
      type: 'order',
      order_id: '123',
      created_at: new Date().toISOString()
    };
    
    console.log('🧪 Testing custom notification:', customTestNotif);
    showCustomToast(customTestNotif);
  };

  const testBrowserNotification = () => {
    if (notificationPermission !== 'granted') {
      alert('Browser notification permission not granted. Please enable it first.');
      return;
    }
    
    const browserTestNotif = {
      id: 'browser-test-' + Date.now(),
      title: testTitle,
      message: testMessage,
      type: 'order',
      order_id: '123',
      created_at: new Date().toISOString()
    };
    
    console.log('🧪 Testing browser notification:', browserTestNotif);
    showBrowserNotification(browserTestNotif);
  };

  const getPermissionStatusColor = (permission) => {
    switch (permission) {
      case 'granted': return 'text-green-600 bg-green-50';
      case 'denied': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Open Notification Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">🐛 Notification Debug</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* System Info */}
      <div className="mb-4 text-xs">
        <h4 className="font-medium text-gray-700 mb-2">System Support:</h4>
        <div className="space-y-1 text-gray-600">
          <div className="flex justify-between">
            <span>Notifications:</span>
            <span className={debugInfo.notificationSupported ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.notificationSupported ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Service Worker:</span>
            <span className={debugInfo.serviceWorkerSupported ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.serviceWorkerSupported ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Secure Context:</span>
            <span className={debugInfo.isSecureContext ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.isSecureContext ? '✅' : '❌'}
            </span>
          </div>
        </div>
      </div>

      {/* Permission Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Permission:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionStatusColor(notificationPermission)}`}>
            {notificationPermission}
          </span>
        </div>
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Request Permission
          </button>
        )}
      </div>

      {/* Sound Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Sound:</span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Test Message Inputs */}
      <div className="mb-4 space-y-2">
        <div>
          <label className="text-xs font-medium text-gray-700">Test Title:</label>
          <input
            type="text"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            placeholder="Notification title"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Test Message:</label>
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded resize-none"
            rows={2}
            placeholder="Notification message"
          />
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-2">
        <button
          onClick={testNotification}
          className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          🧪 Test Full System
        </button>
        
        <button
          onClick={testCustomNotification}
          className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
        >
          🍞 Test Custom Toast
        </button>
        
        <button
          onClick={testBrowserNotification}
          className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
          disabled={notificationPermission !== 'granted'}
        >
          🌐 Test Browser Notification
        </button>
        
        <button
          onClick={sendTestNotification}
          className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          🚀 Test Backend → Frontend Flow
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1">💡 Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• Custom toasts always work</li>
          <li>• Browser notifications need permission</li>
          <li>• SW notifications have action buttons</li>
          <li>• Check browser console for logs</li>
          <li>• Try different browser tabs</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationDebug;