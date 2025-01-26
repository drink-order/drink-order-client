"use client";
import React, { useState, useEffect } from 'react';

const UserPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/send-notification/api/notification')
      .then((response) => response.json())
      .then((data) => setNotifications(data));
  }, []);

  const markAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);
  };

  return (
    <div className='p-6'>
      <h2>User Page</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notif, index) => (
            <li key={notif.id}>
              <h3>{notif.title}</h3>
              <p>{notif.message}</p>
              <span>{notif.time}</span>
              {!notif.read && (
                <button onClick={() => markAsRead(index)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPage;

