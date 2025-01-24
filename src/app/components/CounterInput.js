"use client";

import React from "react";
import { MdRemove, MdAdd } from "react-icons/md"; // Import icons

const CounterInput = ({ value = 1, onChange, min = 1, max = 100 }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <form className="max-w-xs mx-auto">
      <label
        htmlFor="counter-input"
        className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        Choose quantity:
      </label>
      <div className="relative flex items-center">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          className="flex-shrink-0 bg-gray5 hover:bg-primary inline-flex items-center justify-center rounded-full h-8 w-8"
        >
          <MdRemove className="w-4 h-4 text-secondary" />
        </button>

        {/* Counter Input */}
        <input
          type="text"
          id="counter-input"
          value={value}
          onChange={handleChange}
          className="flex-shrink-0 text-gray-900 dark:text-white bg-transparent text-sm font-normal max-w-[2.5rem] text-center"
        />

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          className="flex-shrink-0 bg-gray5 hover:bg-primary inline-flex items-center justify-center rounded-full h-8 w-8"
        >
          <MdAdd className="w-4 h-4 text-secondary" />
        </button>
      </div>
    </form>
  );
};

export default CounterInput;