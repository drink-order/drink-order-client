"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessAnimate from '../components/SuccessAnimate';
import OrderStatusButton from '../components/OrderStatusButton';

const OrderSucPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderStatus, setOrderStatus] = useState('Preparing'); // Default status
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the order status from the API using the orderId
    const fetchOrderStatus = async () => {
      try {
        console.log(`Fetching order status for orderId: ${orderId}`);
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch order status: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Order status fetched:', data);
        setOrderStatus(data.status);
      } catch (error) {
        console.error('Error fetching order status:', error);
        setError('Failed to fetch order status');
      }
    };

    if (orderId) {
      fetchOrderStatus();
    } else {
      setError('Invalid order ID');
    }
  }, [orderId]);

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div>
      <SuccessAnimate />
      <div className="text-center mt-4">
        {orderId && <p className="text-lg mt-2">Your Order ID: {orderId}</p>}
      </div>
      {orderId && <OrderStatusButton orderId={orderId} />}
    </div>
  );
};

export default OrderSucPage;