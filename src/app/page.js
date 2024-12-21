"use client";

import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import CategorySelector from "./components/CategorySelector";
import StickyCartButton from "./components/StickyCartButton";
import { mockCategories } from "./lib/mockData/mockCategories"; // Import data from mockCategories.js from lib folder

export default function Home() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Function to add a drink to the cart
  const handleAddToCart = (drink, quantity = 1) => {
    const existingDrinkIndex = cart.findIndex((item) => item.id === drink.id);
    if (existingDrinkIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingDrinkIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...drink, quantity }]);
    }
    setTotal((prevTotal) => prevTotal + drink.price * quantity);
  };

  // Function to remove a drink from the cart
  const handleRemoveFromCart = (drink) => {
    const updatedCart = cart.filter((item) => item.id !== drink.id);
    setCart(updatedCart);
    setTotal((prevTotal) => prevTotal - drink.price * drink.quantity);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="text-left text-2xl font-bold mt-4 mb-6 px-6">
        Hello, Customer
      </div>

      {/* Search Bar */}
      <div className="flex justify-center px-6">
        <SearchBar className="w-full max-w-3xl" />
      </div>

      {/* Category Selector */}
      <div className="mt-6 px-6">
        <CategorySelector
          categories={mockCategories}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Sticky Cart Button */}
      <StickyCartButton
        cart={cart}
        total={total}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
}
