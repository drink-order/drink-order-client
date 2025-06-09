"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import Card from "./card";

const CategorySelector = ({ drinks, onCardClick, activeCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [activeSearch, setActiveSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("You don't have permission to view categories");
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch categories: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        
        const categoriesArray = (data.categories || []).map(category => ({
          id: category.id,
          nameCategory: category.name,
          userId: category.user_id,
          createdAt: category.created_at,
          updatedAt: category.updated_at
        }));
        
        const filteredCategories = categoriesArray.filter(category => 
          drinks.some(drink => drink.categoryId === category.id)
        );
        setCategories([{ id: -1, nameCategory: "All" }, ...filteredCategories]);
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
    onCategoryChange(categoryIndex);
    setActiveSearch([]);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
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
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearch([]);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>No categories available</p>
      </div>
    );
  }

  const activeCategoryId = categories[activeCategory]?.id;
  let filteredDrinks = activeSearch.length > 0
    ? activeSearch
    : activeCategoryId === -1
      ? drinks
      : drinks.filter(drink => drink.categoryId === activeCategoryId);

  filteredDrinks = filteredDrinks.sort((a, b) => a.title.localeCompare(b.title));

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
              key={index}
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