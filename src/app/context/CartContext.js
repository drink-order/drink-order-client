"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/tocart?userId=${userId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch cart: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        setCart(data.items || []);
        calculateTotal(data.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId]);

  const calculateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalPrice);
  };

  const generateItemKey = (item) => {
    const toppings = Array.isArray(item.toppings) ? item.toppings : [];
    return `${item.id}-${item.size}-${item.sugar}-${toppings.join(',')}`;
  };

  const addToCart = async (item) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/tocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, orderData: item }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add to cart: ${response.statusText} - ${errorText}`);
      }
      const newItem = await response.json();
      setCart((prevCart) => {
        const itemKey = generateItemKey(newItem);
        const existingItemIndex = prevCart.findIndex(cartItem => generateItemKey(cartItem) === itemKey);
        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += newItem.quantity;
          calculateTotal(updatedCart);
          return updatedCart;
        }
        const updatedCart = [...prevCart, newItem];
        calculateTotal(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (item) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/tocart?userId=${userId}&itemId=${item.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove from cart: ${response.statusText} - ${errorText}`);
      }
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((cartItem) => generateItemKey(cartItem) !== generateItemKey(item));
        calculateTotal(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);