"use client";
import React, { useState } from "react";

const CategorySelector = ({ categories = [] }) => {
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
      <div className="flex overflow-x-scroll justify-start mb-4">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center mx-2">
            <button
              onClick={() => handleCategoryClick(index)} // Handle click event
              className={`flex flex-col items-center w-32 h-32 p-4 bg-transparent border border-white-900 rounded-3xl
                ${activeCategory === index
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-black"
                }`}
            >
              <img
                src={category.image}
                alt={category.label}
                className="w-20 h-20 rounded-full mb-2"
              />
            </button>
            <span className="text-sm font-medium mt-2">{category.label}</span>
          </div>
        ))}
      </div>

      {/* Display content of the active category */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {categories[activeCategory]?.content || (
            <div className="text-gray-500">No content available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;