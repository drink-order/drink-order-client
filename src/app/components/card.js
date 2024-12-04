import React from 'react';

export const Card = () => {
  return (
    <div className="max-w-xs mx-auto p-4 border border-[black] rounded-lg shadow-lg ">
      {/* Product Image */}
      <div className="flex justify-center mb-10">
        <img src="/drinkimg.png"/>
      </div>
      {/* Product Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-center mb-2">Creamy Latte</h2>
        <p className="text-sm text-gray-500 text-center mb-1">200+ sold</p>
      </div>

      {/* Price and Add Button */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">$10.00</span>
        <button className="bg-yellow-500 text-white px-2 py-0.5 rounded hover:bg-yellow-600">+</button>
      </div>
    </div>
  );
};
