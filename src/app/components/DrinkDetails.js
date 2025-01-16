"use client";

import React, { useState } from "react";
import DrinkOption from "./DrinkOption";
import CounterInput from "./CounterInput";
import Button from "./Button";

const DrinkDetails = ({ drink, onBack }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Assuming addToCart is defined elsewhere in your application
    addToCart({ ...drink, quantity });
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Back Button */}
      <button
        className="text-xl text-black mb-3"
        onClick={onBack}
        aria-label="Go Back"
      >
        Back
      </button>

      <div className="flex justify-center">
        {/* Drink Image */}
        <img
          src={drink.image || "/default-drink.png"}
          alt={drink.title}
          className="rounded-t-lg w-36 h-36 object-cover"
        />
      </div>

      {/* Drink Options */}
      <DrinkOption />

      <div className="flex justify-between items-center mt-4">
        <CounterInput value={quantity} onChange={setQuantity} />
        <Button
          onClick={handleAddToCart}
          className="bg-primary text-white px-3 py-1 rounded-full hover:bg-yellow-600"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default DrinkDetails;