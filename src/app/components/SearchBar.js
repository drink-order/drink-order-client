"use client";
import React from "react";

export const SearchBar = () => {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm w-64">
      <span className="text-gray-400 text-lg mr-2">🔍</span>
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent outline-none text-gray-700 text-sm flex-1"
      />
    </div>
  );
};
