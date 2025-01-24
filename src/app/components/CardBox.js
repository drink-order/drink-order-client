"use client"
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

const CardBox = ({ name, description, price, originalPrice, image, quantity, onRemove, onQuantityChange }) => {
  return (
    <div className="max-w-4xs bg-white shadow-md overflow-hidden flex items-center">
      <div className="p-4 flex flex-col justify-between w-full">
        <h3 className="text-xl mt-4 font-semibold">{name}</h3>
        <p className="text-gray-600 mt-2 text-sm">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-gray-800">${price}</span>
          {originalPrice && originalPrice !== price && (
            <span className="text-sm line-through text-gray-500">${originalPrice}</span>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <CounterInput value={quantity} onChange={onQuantityChange} />
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
      <img 
        src={image} 
        alt={name} 
        className="w-48 h-[150px] rounded-lg object-cover mr-4" 
      />
    </div>
  );
};

export default CardBox;