"use client";

import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [latestOrderId, setLatestOrderId] = useState(null);

  const addOrder = async (userId, cart) => {
    const orderId = uuidv4();
    const newOrder = {
      id: orderId,
      userId: userId, // Ensure userId is included
      items: cart,
      status: 'Preparing', // Initial status
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to store order: ${response.statusText} - ${errorText}`);
      }

      const storedOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, storedOrder]);
      setLatestOrderId(orderId); // Store the latest order ID
      return orderId;
    } catch (error) {
      console.error('Error storing order:', error);
      return null;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update order status: ${response.statusText} - ${errorText}`);
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getLatestOrderId = () => {
    return latestOrderId;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrderById, getLatestOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
export default OrderContext;