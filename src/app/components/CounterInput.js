"use client";
import React from 'react';
import { MdRemove, MdAdd } from "react-icons/md";

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
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrement}
        className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 inline-flex items-center justify-center rounded-full h-8 w-8"
      >
        <MdRemove className="w-4 h-4 text-gray-600" />
      </button>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="mx-2 text-center w-12 border border-gray-300 rounded"
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 inline-flex items-center justify-center rounded-full h-8 w-8"
      >
        <MdAdd className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default CounterInput;