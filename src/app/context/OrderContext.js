"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch all user orders for order history page
  const fetchUserOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      const ordersList = data.orders || [];
      
      setOrders(ordersList);
      return ordersList;
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
      setOrders([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get order by ID for OrderSuc page
  const getOrderById = useCallback(async (orderId) => {
    if (!orderId || !user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      return data.order;
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
      console.error('Error fetching order details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get order status for real-time updates
  const getOrderStatus = useCallback(async (orderId) => {
    if (!orderId || !user) return null;
    
    try {
      const order = await getOrderById(orderId);
      return order ? order.order_status : null;
    } catch (err) {
      console.error('Error fetching order status:', err);
      return null;
    }
  }, [user, getOrderById]);

  // Refresh specific order (for OrderSuc page polling)
  const refreshOrder = useCallback(async (orderId) => {
    try {
      const updatedOrder = await getOrderById(orderId);
      if (updatedOrder) {
        // Update the orders list if it exists
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? updatedOrder : order
          )
        );
        return updatedOrder;
      }
      return null;
    } catch (err) {
      console.error('Error refreshing order:', err);
      return null;
    }
  }, [getOrderById]);

  // Find active orders (for FloatingOrderButton)
  const getActiveOrders = useCallback(() => {
    return orders.filter(order => 
      order.order_status === 'preparing' || order.order_status === 'ready_for_pickup'
    );
  }, [orders]);

  // Get most recent active order
  const getMostRecentActiveOrder = useCallback(() => {
    const activeOrders = getActiveOrders();
    if (activeOrders.length === 0) return null;
    
    // Sort by created_at descending and get the first one
    return activeOrders.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    )[0];
  }, [getActiveOrders]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear orders (for logout scenarios)
  const clearOrders = useCallback(() => {
    setOrders([]);
    setError(null);
  }, []);

  const value = {
    // State
    orders,
    loading,
    error,
    
    // Actions
    fetchUserOrders,
    getOrderById,
    getOrderStatus,
    refreshOrder,
    getActiveOrders,
    getMostRecentActiveOrder,
    clearError,
    clearOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;