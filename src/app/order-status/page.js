"use client";

import React from 'react'
import SuccessAnimate from '../components/SuccessAnimate';
import OrderStatusButton from '../components/OrderStatusButton';

const OrderStatus = () => {
  return (
    <div>
        <SuccessAnimate />
        <OrderStatusButton />
    </div>
  )
}

export default OrderStatus