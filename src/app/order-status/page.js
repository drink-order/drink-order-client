"use client";
import React, { Suspense } from 'react';
import SuccessAnimate from '../components/SuccessAnimate';
import OrderStatusButton from '../components/OrderStatusButton';

const OrderStatusContent = () => {
  return (
    <div>
      <SuccessAnimate />
      <OrderStatusButton />
    </div>
  );
};

const OrderStatus = () => {
  return (
    <Suspense fallback={<div>Loading order status...</div>}>
      <OrderStatusContent />
    </Suspense>
  );
};

export default OrderStatus;