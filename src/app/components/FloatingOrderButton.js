"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const FloatingOrderButton = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  useEffect(() => {
    // Fetch the order status from the API
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order status');
        }
        const data = await response.json();
        setOrderStatus(data.status);
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };

    if (orderId) {
      fetchOrderStatus();
    }
  }, [orderId]);

  const handleNavigateToOrderSuc = () => {
    router.push(`/OrderSuc?orderId=${orderId}`);
  };

  if (orderStatus === 'PickedUp') {
    return null;
  }

  return (
    <button
      onClick={handleNavigateToOrderSuc}
      className="fixed bottom-32 right-16 bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700"
    >
      View Order
    </button>
  );
};

export default FloatingOrderButton;