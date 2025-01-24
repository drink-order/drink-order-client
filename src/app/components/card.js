"use client";

import React from 'react';

const Card = ({ id, image, title, soldCount, price, onClick }) => {
  // Ensure price is a number
  const formattedPrice = !isNaN(parseFloat(price)) && isFinite(price) ? parseFloat(price).toFixed(2) : 'N/A';

  return (
    <div className="max-w-xs w-full h-auto border border-secondary rounded-lg shadow-md p-2" onClick={onClick}>
      {/* Product Image */}
      <div className="flex justify-center mb-1">
        <img src={image} alt={title} className="w-36 h-36 object-cover rounded-md" />
      </div>

      {/* Product Title and Sold Count */}
      <div className="flex flex-col items-start px-1">
        <h2 className="text-sm font-semibold text-gray-800 truncate">{title}</h2>
        <p className="text-xs text-gray-500">{soldCount} sold</p>
      </div>

      {/* Price and Add Button */}
      <div className="flex justify-between items-center mt-auto px-1">
        <span className="text-md font-bold text-gray-900">${formattedPrice}</span>
        <button className="bg-primary text-white px-3 py-1 rounded-full hover:bg-yellow-600">
          Select
        </button>
      </div>
    </div>
  );
};

export default Card;