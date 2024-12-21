
"use client";
import React, { useState } from "react";
import Card from "./card";

const CategorySelector = ({ categories = [], addToCart }) => {
  const [activeCategory, setActiveCategory] = useState(0); // Default active category is the first

  const handleCategoryClick = (categoryIndex) => {
    setActiveCategory(categoryIndex); // Update active category index
  };

  if (categories.length === 0) {
    return <div className="text-center text-gray-500">No categories available</div>; // Fallback for empty categories
  }

  return (
    <div className="w-full">
      {/* Category buttons */}
      <div className="flex overflow-x-scroll justify-start mb-4 px-2">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center mx-1.5">
            <button
              onClick={() => handleCategoryClick(index)} // Handle click event
              className={`flex flex-col items-center w-20 h-20 md:w-20 md:h-20 p-2 bg-transparent border border-white-900 rounded-xl
                ${activeCategory === index
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-black"
                }`}
            >
              <img
                src={category.image}
                alt={category.label}
                className="w-14 h-14 md:w-20 md:h-20 rounded-full mb-2"
              />
            </button>
            <span className="text-xs md:text-sm font-medium mt-2">{category.label}</span>
          </div>
        ))}
      </div>

      {/* Display the active category title */}
      <h2 className="text-xl font-bold text-left px-2 mb-4">
        {categories[activeCategory]?.label}
      </h2>

      {/* Display content of the active category */}
      <div className="flex justify-center px-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {categories[activeCategory]?.content?.map((product, index) => (
            <Card
              key={index}
              image={product.image}
              title={product.title}
              soldCount={product.soldCount}
              price={product.price}
              category={product.category}
              addToCart={addToCart}
            />
          )) || (
            <div className="text-gray-500">No content available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;