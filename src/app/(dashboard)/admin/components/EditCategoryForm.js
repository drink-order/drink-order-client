"use client";
import React, { useState, useEffect } from "react";

const EditCategoryForm = ({ category, onBack, onUpdate }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [originalName, setOriginalName] = useState("");

  // Initialize form with category data
  useEffect(() => {
    if (category) {
      const categoryName = category.name || "";
      setName(categoryName);
      setOriginalName(categoryName);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Client-side validation
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Category name must be at least 2 characters long.");
      return;
    }

    if (name.trim() === originalName) {
      setError("Please make changes before updating.");
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const updateData = {
        name: name.trim(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Handle Laravel validation errors (422 status)
        if (res.status === 422 && errorData.errors) {
          setValidationErrors(errorData.errors);
          
          // Display the first error for name field if it exists
          if (errorData.errors.name && errorData.errors.name.length > 0) {
            setError(errorData.errors.name[0]);
          } else {
            setError("Validation failed. Please check your input.");
          }
          return;
        }
        
        // Handle other errors
        throw new Error(errorData.message || `Failed to update category (${res.status})`);
      }

      const data = await res.json();
      console.log("Updated category response:", data);
      
      // Handle different API response structures
      const categoryData = data.category || data.data || data;
      
      // Ensure we have the updated category with proper structure
      const updatedCategory = {
        id: category.id,
        name: name.trim(),
        created_at: category.created_at,
        updated_at: categoryData.updated_at || categoryData.updatedAt || new Date().toISOString(),
        ...categoryData
      };
      
      console.log("Processed updated category:", updatedCategory);
      
      // Call the onUpdate callback with the updated category
      onUpdate(updatedCategory);
      
    } catch (error) {
      console.error("Error updating category:", error);
      setError(error.message || "An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = name.trim() !== originalName && name.trim().length >= 2;

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
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
                className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                required
                disabled={loading}
                maxLength={100}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name[0]}</p>
              )}
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  {name.length}/100 characters
                </p>
                {hasChanges && (
                  <p className="text-xs text-green-600">
                    ✓ Changes detected
                  </p>
                )}
              </div>
            </div>

            {/* Category Info */}
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category ID:</span> {category?.id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Created:</span> {category?.created_at ? new Date(category.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
                {error.includes("already been taken") && (
                  <p className="text-red-500 text-xs mt-1">
                    This category name is already in use. Please choose a different name.
                  </p>
                )}
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
                disabled={loading || !hasChanges}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Updating...
                  </>
                ) : (
                  "Update Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryForm;