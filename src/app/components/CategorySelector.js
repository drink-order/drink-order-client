"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import Card from "./card";

const CategorySelector = ({ drinks, onCardClick, activeCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [activeSearch, setActiveSearch] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch categories: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        // Filter categories to include only those that have drinks
        const filteredCategories = data.filter(category => 
          drinks.some(drink => drink.categoryId === category.id)
        );
        setCategories([{ id: -1, nameCategory: "All" }, ...filteredCategories]); // Add "All" category
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      }
    };

    if (drinks.length > 0) {
      fetchCategories();
    }
  }, [drinks]);

  const handleCategoryClick = (categoryIndex) => {
    onCategoryChange(categoryIndex); // Update active category index in parent component
    setActiveSearch([]); // Clear search results when category is clicked
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    if (value === '') {
      setActiveSearch([]);
      return;
    }
    const activeCategoryId = categories[activeCategory]?.id;
    const filtered = activeCategoryId === -1
      ? drinks.filter(drink => drink.title.toLowerCase().includes(value))
      : drinks.filter(drink => drink.categoryId === activeCategoryId && drink.title.toLowerCase().includes(value));
    setActiveSearch(filtered.slice(0, 8));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Display error message
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return <div className="text-center text-gray-500">No categories available</div>; // Fallback for empty categories
  }

  const activeCategoryId = categories[activeCategory]?.id;
  let filteredDrinks = activeSearch.length > 0
    ? activeSearch
    : activeCategoryId === -1
      ? drinks
      : drinks.filter(drink => drink.categoryId === activeCategoryId);

  // Sort drinks by sold count in descending order
  filteredDrinks = filteredDrinks.sort((a, b) => b.soldCount - a.soldCount);

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="w-full md:w-[500px] mb-4 px-2 relative">
        <form onSubmit={handleSubmit}>
          <label htmlFor="search-bar" className="sr-only">Search</label>
          <div className="relative text-white">
            <input
              id="search-bar"
              type="search"
              placeholder="Search for drink"
              className="w-full p-3 rounded-3xl bg-gray5 text-black"
              onChange={(e) => handleSearch(e)}
            />
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 bg-primary rounded-full"
              type="submit"
            >
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      </div>

      {/* Category buttons */}
      <div className="flex overflow-x-scroll justify-start mb-4 px-2 space-x-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(index)} // Handle click event
            className={`flex items-center justify-center px-4 py-2 bg-transparent border border-gray-900 rounded-xl whitespace-nowrap
              ${activeCategory === index
                ? "bg-yellow-600 text-white"
                : "bg-white text-black"
              }`}
          >
            <span className="text-xs md:text-sm font-medium">{category.nameCategory}</span>
          </button>
        ))}
      </div>

      {/* Display the active category title */}
      <h2 className="text-xl font-bold text-left px-2 mb-4">
        {categories[activeCategory]?.nameCategory}
      </h2>

      {/* Display content of the active category */}
      <div className="flex justify-center px-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {filteredDrinks.map((drink, index) => {
            console.log(`Drink ID: ${drink.id}, Price: ${drink.price}`); // Log the price value
            return (
              <Card
                key={index}
                id={drink.id}
                image={drink.image}
                title={drink.title}
                soldCount={drink.soldCount}
                price={drink.price}
                onClick={() => onCardClick(drink)} // Handle card click
              />
            );
          })}
          {filteredDrinks.length === 0 && (
            <div className="text-gray-500">No content available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;