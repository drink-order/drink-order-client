"use client";
import React, { useState } from 'react';
import { FaClipboardCheck, FaCoffee } from 'react-icons/fa';
import { GiSandsOfTime } from "react-icons/gi";
import ConfirmOrderPage from '../../components/Staff-Dashboard/ConfirmOrderPage';
import PendingPage from '../../components/Staff-Dashboard/PendingPage';
import CompleteOrderPage from '../../components/Staff-Dashboard/CompleteOrderPage';

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
      </nav>
      <div>
        {renderActivePage()}
      </div>
    </div>
  );
}