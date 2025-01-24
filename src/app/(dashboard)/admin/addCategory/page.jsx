"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const AddCategory = () => {
  const [nameCategory, setNameCategory] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameCategory) {
      alert("Name of Category is required.");
      return;
    }

    try {
      const res = await fetch('/api/category', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ nameCategory }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Category");
      }

      const newCategory = await res.json();
      // Optionally, you can redirect or show a success message here
      router.push('/admin'); // Redirect to admin page after adding category
    } catch (error) {
      console.error("Error creating category:", error);
      setError(error.message || "An error occurred while creating the category.");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setNameCategory(e.target.value)}
          value={nameCategory}
          className="border border-slate-500 px-8 py-2"
          type="text"
          placeholder="Category Name"
        />
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Back
          </button>
          <button type="submit" className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Add Category
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default AddCategory;