"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Create a wrapper component that uses useSearchParams
const OrderStatusButtonContent = ({ orderId: propOrderId }) => {
  const searchParams = useSearchParams();
  const statusFromParams = searchParams.get('status') || 'Preparing'; // Default status
  const orderIdFromParams = searchParams.get('orderId');
  const [status, setStatus] = useState(statusFromParams);
  const [error, setError] = useState(null);
  
  // Use the orderId from props or from URL params
  const orderId = propOrderId || orderIdFromParams;
  
  useEffect(() => {
    // Store orderId in local storage
    if (orderId) {
      localStorage.setItem('orderId', orderId);
    }
    // Retrieve orderId from local storage if not provided as a prop or URL param
    const storedOrderId = orderId || localStorage.getItem('orderId');
    if (!storedOrderId) {
      setError('Invalid order ID');
    }
  }, [orderId]);

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <button
        style={{
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Check Status: {status}
      </button>
    </div>
  );
};

// Create the main component with Suspense boundary
const OrderStatusButton = (props) => {
  return (
    <Suspense fallback={<div>Loading status...</div>}>
      <OrderStatusButtonContent {...props} />
    </Suspense>
  );
};

export default OrderStatusButton;