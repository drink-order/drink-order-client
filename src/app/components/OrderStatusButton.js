import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const OrderStatusButton = ({ orderId }) => {
  const searchParams = useSearchParams();
  const statusFromParams = searchParams.get('status') || 'Preparing'; // Default status
  const [status, setStatus] = useState(statusFromParams);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Store orderId in local storage
    if (orderId) {
      localStorage.setItem('orderId', orderId);
    }

    // Retrieve orderId from local storage if not provided as a prop
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
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: status === 'Ready to Pickup' ? 'green' : status === 'Pickedup' ? 'blue' : 'orange',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'default',
          transition: 'background-color 0.3s',
        }}
        disabled
      >
        {status}
      </button>
    </div>
  );
};

export default OrderStatusButton;