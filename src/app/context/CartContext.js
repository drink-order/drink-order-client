"use client";

import React, { createContext, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Empty cart implementation since you're using direct ordering
  const cart = [];
  const total = 0;

  // Placeholder functions to maintain compatibility with existing components
  const addToCart = async () => {
    console.warn("Cart functionality is disabled - using direct ordering");
    return;
  };

  const removeFromCart = async () => {
    console.warn("Cart functionality is disabled - using direct ordering");
    return;
  };

  const clearCart = async () => {
    console.warn("Cart functionality is disabled - using direct ordering");
    return;
  };

  const setCart = () => {
    console.warn("Cart functionality is disabled - using direct ordering");
    return;
  };

  const calculateTotal = () => {
    console.warn("Cart functionality is disabled - using direct ordering");
    return 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        clearCart,
        setCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};