"use client";
import React, { useState } from 'react';
import { FaClipboardCheck, FaCoffee } from 'react-icons/fa';
import { PiNotificationBold, PiHandWavingBold } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";
import ConfirmOrderPage from '../../components/Staff-Dashboard/ConfirmOrderPage';
import PendingPage from '../../components/Staff-Dashboard/PendingPage';
import CompleteOrderPage from '../../components/Staff-Dashboard/CompleteOrderPage';
import Profile from '../../components/Profile'; // Import the Profile component

export default function Dashboard() {
  // State to handle active page
  const [activePage, setActivePage] = useState('confirmOrder'); // Default to 'confirmOrder'

  const [orders, setOrders] = useState([]);

  // Function to render the active page
  const renderActivePage = () => {
    switch (activePage) {
      case 'confirmOrder':
        return <ConfirmOrderPage />;
      case 'pending':
        return <PendingPage />;
      case 'completeOrder':
        return <CompleteOrderPage />;
      case 'profile':
        return <Profile />;
      default:
        return <ConfirmOrderPage />;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setActivePage('confirmOrder')}>
          <FaClipboardCheck /> Confirm Order
        </button>
        <button onClick={() => setActivePage('pending')}>
          <GiSandsOfTime /> Pending
        </button>
        <button onClick={() => setActivePage('completeOrder')}>
          <FaCoffee /> Complete Order
        </button>
        <button onClick={() => setActivePage('profile')}>
          <PiHandWavingBold /> Profile
        </button>
      </nav>
      <div>
        {renderActivePage()}
      </div>
    </div>
  );
}