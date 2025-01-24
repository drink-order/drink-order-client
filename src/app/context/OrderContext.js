"use client";

import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = async (userId, cart) => {
    const orderId = uuidv4();
    const newOrder = {
      id: orderId,
      userId: userId, // Ensure userId is included
      items: cart,
      status: 'Pending', // Initial status
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
      return orderId;
    } catch (error) {
      console.error('Error storing order:', error);
      return null;
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);