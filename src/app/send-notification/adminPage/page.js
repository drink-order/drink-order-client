"use client";
import React, { useState } from 'react';

// Assuming predefined notification data to be sent
//const predefinedNotification = { id: 4, message: 'New special offer available!', read: false };

const AdminPage = () => {
  const [sendStatus, setSendStatus] = useState('');

  const handleSendNotification = () => {
    fetch('/send-notification/api/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: "New notification!"}), // Sending predefined data
    })
      .then((response) => response.json())
      .then(() => {
        setSendStatus('Notification sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
        setSendStatus('Failed to send notification');
      });
  };

  return (
    <div className='p-6'>
      <h2>Admin Page</h2>
      <button onClick={handleSendNotification} 
      className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
      >Send Notification</button>
      {sendStatus && <p>{sendStatus}</p>}
    </div>
  );
};

export default AdminPage;

