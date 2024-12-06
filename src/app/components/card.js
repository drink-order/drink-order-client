import React from 'react';

export default function Card({ image, title, soldCount, price , category}) {
  return (
    <div className="max-w-xs p-4 border border-[black] rounded-lg shadow-lg">
      {/* Product Image */}
      <div className="flex justify-center mb-10">
      <img src={image} className="h-40 w-40 object-cover" />

      </div>
      
      {/* Product Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>
        <p className="text-sm text-gray-500 text-center mb-1">{soldCount} sold</p>
      </div>

      {/* Price and Add Button */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">${price}</span>
        <button className="bg-yellow-500 text-white px-2 py-0.5 rounded hover:bg-yellow-600">+</button>
      </div>
    </div>
  );
};
