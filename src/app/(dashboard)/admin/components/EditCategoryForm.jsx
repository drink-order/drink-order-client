"use client";
import React, { useState } from 'react';

export default function EditCategoryForm({ id, nameCategory, onBack, onUpdate }) {
  const [newName, setNewName] = useState(nameCategory);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the auth token (same as CategoryList)
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          name: newName.trim() // Use 'name' field to match your table display
        }),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You don't have permission to update categories");
        }
        throw new Error("Failed to update category");
      }

      const updatedCategory = await res.json();
      onUpdate(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      setError(error.message || "An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setNewName(e.target.value)}
          value={newName}
          className="border border-slate-500 px-8 py-2"
          type="text"
          placeholder="Category Name"
          disabled={loading}
        />
        
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onBack} 
            className="bg-gray-500 hover:bg-gray-600 font-bold text-white py-3 px-5 w-fit"
            disabled={loading}
          >
            Back
          </button>

          <button 
            type="submit" 
            className="bg-[#5D4435] hover:bg-[#4a3629] font-bold text-white py-3 px-5 w-fit disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}