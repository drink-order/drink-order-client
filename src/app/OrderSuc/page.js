"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessAnimate from '../components/SuccessAnimate';
import OrderStatusButton from '../components/OrderStatusButton';

const OrderSucPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div>
      <SuccessAnimate />
      <div className="text-center mt-4">
        {orderId && <p className="text-lg mt-2">Your Order ID: {orderId}</p>}
      </div>
      <OrderStatusButton />
    </div>
  );
};

export default OrderSucPage;