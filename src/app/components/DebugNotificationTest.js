"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugNotificationTest = () => {
  const { user, token } = useAuth();

  const testNotificationAPI = async () => {
    console.log('🧪 Testing notification API directly...');
    console.log('User:', user);
    console.log('Token:', token ? 'Available' : 'Missing');
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    if (!token) {
      console.error('❌ No token available');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success! Notifications:', data);
        alert(`Success! Found ${data.notifications?.length || 0} notifications, ${data.unread_count || 0} unread`);
      } else {
        console.error('❌ API Error:', response.status, response.statusText);
        alert(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert(`Network Error: ${error.message}`);
    }
  };

  const createTestNotification = async () => {
    console.log('🧪 Creating test notification...');
    
    if (!token) {
      console.error('❌ No token available');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/create-test-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Test notification created:', data);
        alert('Test notification created! Check the notifications in 30 seconds.');
      } else {
        console.error('❌ Failed to create test notification:', response.status);
        alert(`Failed to create test notification: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error creating test notification:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (!user) {
    return <div className="p-4 text-gray-500">Please log in to test notifications</div>;
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-yellow-50">
      <h3 className="text-lg font-bold mb-4">🧪 Debug Notification System</h3>
      <div className="space-y-2">
        <p><strong>User ID:</strong> {user?.id}</p>
        <p><strong>Token:</strong> {token ? '✅ Available' : '❌ Missing'}</p>
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
      </div>
      
      <div className="mt-4 space-x-2">
        <button
          onClick={testNotificationAPI}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Load Notifications
        </button>
        
        <button
          onClick={createTestNotification}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Test Notification
        </button>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        Open browser console (F12) to see detailed debug logs
      </p>
    </div>
  );
};

export default DebugNotificationTest;