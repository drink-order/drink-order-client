import React from 'react';
import DrinkDetails from './DrinkDetails';
import { useState } from 'react';

export default function Card({ image, title, soldCount, price, category, addToCart }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(null);

  const handleSelect = (drink) => {
    setSelectedDrink(drink);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedDrink(null);
  };

  // addToCart = (product) => {
  //   setCart([...cart, product]);
  //   setTotal(total + product.price);
  // };

  return (
    <div className="max-w-xs w-full h-auto border border-secondary rounded-lg shadow-md p-2">
      {/* Product Image */}
      <div className="flex justify-center mb-1">
        <img src={image} alt={title} className="w-36 h-36 object-cover rounded-md" />
      </div>

      {/* Product Title and Sold Count */}
      <div className="flex flex-col items-start px-1">
        <h2 className="text-sm font-semibold text-gray-800 truncate">{title}</h2>
        <p className="text-xs text-gray-500">{category}</p>
        <p className="text-xs text-gray-500">{soldCount} sold</p>
      </div>

      {/* Price and Add Button */}
      <div className="flex justify-between items-center mt-auto px-1">
        <span className="text-md font-bold text-gray-900">${price.toFixed(2)}</span>
        <button
           onClick={() => handleSelect({ image, title, soldCount, price, category })}
          className="bg-primary text-white px-3 py-1 rounded-full hover:bg-yellow-600"
        >
          Select
        </button>
      </div>

      {showDrawer && (
        <div className="fixed inset-0 bottom-16 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full h-full p-4 overflow-y-auto">
            <DrinkDetails drink={selectedDrink} onBack={handleCloseDrawer} addToCart={addToCart} />
          </div>
        </div>
      )}
    </div>
  );
}