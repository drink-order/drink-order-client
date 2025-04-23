"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessAnimate from '../components/SuccessAnimate';
import OrderStatusButton from '../components/OrderStatusButton';

// Create a content component that uses useSearchParams
const OrderSucContent = () => {
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

// Main page component with Suspense boundary
const OrderSucPage = () => {
  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <OrderSucContent />
    </Suspense>
  );
};

export default OrderSucPage;