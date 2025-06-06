"use client";
import React, { useState } from "react";

const AddCategoryForm = ({ onBack, onAdd }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Category name must be at least 2 characters long.");
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          name: name.trim()
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create category (${res.status})`);
      }

      const data = await res.json();
      console.log("New category response:", data);
      
      // Handle different API response structures
      const categoryData = data.category || data.data || data;
      
      // Ensure we have the category with proper structure
      const newCategory = {
        id: categoryData.id || Date.now(), // Fallback ID
        name: name.trim(),
        created_at: categoryData.created_at || categoryData.createdAt || new Date().toISOString(),
        updated_at: categoryData.updated_at || categoryData.updatedAt || new Date().toISOString(),
        ...categoryData
      };
      
      console.log("Processed new category:", newCategory);
      
      // Call the onAdd callback with the new category
      onAdd(newCategory);
      
    } catch (error) {
      console.error("Error creating category:", error);
      setError(error.message || "An error occurred while creating the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              disabled={loading}
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {name.length}/100 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                onClick={onBack}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Adding...
                  </>
                ) : (
                  "Add Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;