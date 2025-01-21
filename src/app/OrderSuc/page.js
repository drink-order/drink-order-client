"use client"
import React from 'react'
import SuccessAnimate from '../components/SuccessAnimate'
import OrderStatusButton from '../components/OrderStatusButton'
export const page = () => {
  return (
    <div>
     <SuccessAnimate />,
     <OrderStatusButton />
    </div>
  )
}
export default page;
