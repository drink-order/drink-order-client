"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null);

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };

    fetchSession();
  }, []);

  // Fetch cart items for the logged-in user
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
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  // Calculate total price of cart items
  const calculateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  };

  // Generate a unique key for each cart item
  const generateItemKey = (item) => {
    const toppings = Array.isArray(item.toppings) ? item.toppings : [];
    return `${item.id}-${item.size}-${item.sugar}-${toppings.join(",")}`;
  };

  // Add item to the cart
  const addToCart = async (item) => {
    if (!userId) return;

    try {
      const response = await fetch("/api/tocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        const existingItemIndex = prevCart.findIndex(
          (cartItem) => generateItemKey(cartItem) === itemKey
        );

        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += newItem.quantity; // Correctly update the quantity
          calculateTotal(updatedCart);
          return updatedCart;
        }

        const updatedCart = [...prevCart, newItem];
        calculateTotal(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Remove item from the cart
  const removeFromCart = async (itemId) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/tocart?userId=${userId}&itemId=${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove from cart: ${response.statusText} - ${errorText}`);
      }

      setCart((prevCart) => {
        const updatedCart = prevCart.filter((cartItem) => cartItem.id !== itemId);
        calculateTotal(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        setCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);