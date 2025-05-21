"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestOrderId, setLatestOrderId] = useState(null);
  
  // Use optional chaining to avoid the destructuring error
  const auth = useAuth();
  const user = auth?.user;
  
  const cart = useCart();
  const clearCart = cart?.clearCart;

  // Format cart items for the Laravel API
  const formatCartItemsForAPI = (cartItems) => {
    return cartItems.map(item => ({
      product_size_id: item.productSizeId || item.product_size_id, 
      quantity: item.quantity,
      toppings: item.toppings.map(topping => ({
        topping_id: topping.id || topping.topping_id
      }))
    }));
  };

  // Create a new order
  const addOrder = async (userId, cartItems) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format the order data for the API
      const orderData = {
        items: formatCartItemsForAPI(cartItems)
      };
      
      // Send order to backend
      const response = await orderService.createOrder(orderData);
      
      // Extract orderId from the response
      const orderId = response.order?.id;
      
      if (orderId) {
        setLatestOrderId(orderId);
        
        // Clear the cart after successful order
        if (clearCart) {
          await clearCart();
        }
        
        return orderId;
      } else {
        throw new Error('No order ID returned from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to create order');
      console.error('Error creating order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all orders for the current user
  const fetchUserOrders = async () => {
    if (!user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderService.getUserOrders();
      
      if (response && response.orders) {
        setOrders(response.orders);
      }
      
      return response.orders;
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = async (orderId) => {
    if (!orderId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderService.getOrderById(orderId);
      
      if (response && response.order) {
        return response.order;
      }
      
      return null;
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
      console.error('Error fetching order details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get order status
  const getOrderStatus = async (orderId) => {
    if (!orderId) return null;
    
    try {
      const order = await getOrderById(orderId);
      return order ? order.order_status : null;
    } catch (err) {
      console.error('Error fetching order status:', err);
      return null;
    }
  };

  // Update order status (for staff/admin)
  const updateOrderStatus = async (orderId, status) => {
    if (!orderId || !status) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await orderService.updateOrderStatus(orderId, status);
      
      // Update local orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, order_status: status } 
            : order
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get latest order ID
  const getLatestOrderId = () => {
    return latestOrderId;
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      loading, 
      error,
      addOrder,
      fetchUserOrders,
      getOrderById,
      getOrderStatus,
      updateOrderStatus,
      getLatestOrderId 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
export default OrderContext;