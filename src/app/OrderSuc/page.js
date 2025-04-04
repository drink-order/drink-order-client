"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessAnimate from '../components/SuccessAnimate';
import OrderStatusButton from '../components/OrderStatusButton';

const OrderSucPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderStatus = searchParams.get('status') || 'Preparing'; // Default status
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
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
        {orderStatus && <p className="text-lg mt-2">Order Status: {orderStatus}</p>}
      </div>
      {orderId && <OrderStatusButton orderId={orderId} />}
    </div>
  );
};

export default OrderSucPage;