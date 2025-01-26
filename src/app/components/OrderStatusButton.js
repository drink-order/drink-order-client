import React, { useState, useEffect } from 'react';

const OrderStatusButton = ({ orderId }) => {
  const [status, setStatus] = useState('Preparing'); // Default status
  const [error, setError] = useState(null);

  useEffect(() => {
    // Store orderId in local storage
    if (orderId) {
      localStorage.setItem('orderId', orderId);
    }

    // Retrieve orderId from local storage if not provided as a prop
    const storedOrderId = orderId || localStorage.getItem('orderId');

    // Fetch the current status of the order when the component mounts
    const fetchOrderStatus = async () => {
      try {
        console.log(`Fetching order status for orderId: ${storedOrderId}`);
        const response = await fetch(`/api/orders?orderId=${storedOrderId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch order status: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Order status fetched:', data);
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching order status:', error);
        setError('Failed to fetch order status');
      }
    };

    if (storedOrderId) {
      fetchOrderStatus();
    } else {
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