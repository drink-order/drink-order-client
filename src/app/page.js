"use client";

import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import CategorySelector from "./components/CategorySelector";
import { mockCategories } from "./lib/mockData/mockCategories";

export default function Home() {
  // const [cartItems, setCartItems] = useState([]); // Cart items state
  // const [totalPrice, setTotalPrice] = useState(0); // Total price state
  // const [selectedDrink, setSelectedDrink] = useState(null); // State for the selected drink

  // // Function to add an item to the cart
  // const addToCart = (item) => {
  //   setCartItems((prev) => [...prev, item]);
  //   setTotalPrice((prev) => prev + item.price);
  // };

  // // Function to remove an item from the cart
  // const removeFromCart = (item) => {
  //   setCartItems((prev) => {
  //     const index = prev.findIndex((cartItem) => cartItem.title === item.title);
  //     if (index !== -1) {
  //       const updatedCart = [...prev];
  //       updatedCart.splice(index, 1);
  //       return updatedCart;
  //     }
  //     return prev;
  //   });
  //   setTotalPrice((prev) => prev - item.price);
  // };

  // Function to handle selecting a drink
  const handleSelectDrink = (drink) => {
    setSelectedDrink(drink);
  };

  // // Function to close the StickyCardComponent
  // const handleCloseStickyCard = () => {
  //   setSelectedDrink(null);
  // };

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
          onSelect={handleSelectDrink}
          // className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4"
        />
      </div>

      {/* Sticky Card Component
      {selectedDrink && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <StickyCardComponent
            drink={selectedDrink}
            cartItems={cartItems}
            totalPrice={totalPrice}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onClose={handleCloseStickyCard}
            className="max-w-md w-full bg-white rounded-lg shadow-lg"
          /> */}
        {/* </div> */}
      {/* )} */}
    </div>
  );
}
