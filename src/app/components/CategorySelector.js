"use client";

import React, { useState, useCallback, useMemo } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import Card from "./card";

const CategorySelector = ({ drinks, categories, onCardClick, activeCategory, onCategoryChange }) => {
  const [activeSearch, setActiveSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = useCallback((categoryIndex) => {
    onCategoryChange(categoryIndex);
    setActiveSearch([]);
    setSearchTerm("");
  }, [onCategoryChange]);

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === '') {
      setActiveSearch([]);
      return;
    }
    
    const searchValue = value.toLowerCase();
    const activeCategoryId = categories[activeCategory]?.id;
    const filtered = activeCategoryId === -1
      ? drinks.filter(drink => drink.title.toLowerCase().includes(searchValue))
      : drinks.filter(drink => drink.categoryId === activeCategoryId && drink.title.toLowerCase().includes(searchValue));
    setActiveSearch(filtered.slice(0, 12));
  }, [drinks, categories, activeCategory]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setActiveSearch([]);
  }, []);

  // Memoize filtered drinks to prevent recalculation on every render
  const filteredDrinks = useMemo(() => {
    const activeCategoryId = categories[activeCategory]?.id;
    let filtered = activeSearch.length > 0
      ? activeSearch
      : activeCategoryId === -1
        ? drinks
        : drinks.filter(drink => drink.categoryId === activeCategoryId);

    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [drinks, categories, activeCategory, activeSearch]);

  // Show loading state if no data
  if (!drinks.length || !categories.length) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent mr-3"></div>
        <p className="text-gray-600">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <div className="relative">
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Search for drinks..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-500">
            {activeSearch.length > 0 
              ? `Found ${activeSearch.length} drinks`
              : 'No drinks found'
            }
          </div>
        )}
      </div>

      {/* Category Buttons */}
      <div className="mb-4">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${
                activeCategory === index
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-50 hover:border-yellow-300"
              }`}
            >
              {category.nameCategory}
            </button>
          ))}
        </div>
      </div>

      {/* Category Title */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {categories[activeCategory]?.nameCategory} ({filteredDrinks.length})
        </h2>
        
        {searchTerm && (
          <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            Filtered
          </span>
        )}
      </div>

      {/* Products Grid */}
      <div>
        {filteredDrinks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredDrinks.map((drink) => (
              <Card
                key={drink.id}
                id={drink.id}
                image={drink.image}
                title={drink.title}
                price={drink.price}
                sizes={drink.sizes}
                isAvailable={drink.isAvailable}
                onClick={() => onCardClick(drink)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No drinks found</h3>
              <p className="text-gray-500 text-sm">
                {searchTerm 
                  ? `No drinks match "${searchTerm}" in this category`
                  : "No drinks available in this category"
                }
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-3 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;