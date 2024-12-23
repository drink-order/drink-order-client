"use client";

import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import CategorySelector from "./components/CategorySelector";
import StickyCartButton from "./components/StickyCartButton";
import { mockCategories } from "./lib/mockData/mockCategories"; // Import data from mockCategories.js from lib folder

export default function Home() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showStickyCart, setShowStickyCart] = useState(false);


  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
    setShowStickyCart(true);
  };


  return (
    <div className="min-h-screen flex flex-col bg-white">
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
          addToCart={addToCart}
        />
      </div>

      {showStickyCart && (
        <StickyCartButton cart={cart} total={total} />
      )}

    </div>
  );
}
