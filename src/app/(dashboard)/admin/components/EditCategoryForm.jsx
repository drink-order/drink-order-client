"use client";
import React, { useState } from 'react';

export default function EditCategoryForm({ id, nameCategory, onBack, onUpdate }) {
  const [newName, setNewName] = useState(nameCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/admin/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newName }),
      });

      if (!res.ok) {
        throw new Error("Failed to update category");
      }
      const updatedCategory = await res.json();
      onUpdate(updatedCategory);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setNewName(e.target.value)}
        value={newName}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Category Name"
      />
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
          Back
        </button>

        <button type="submit" className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
          Update Category
        </button>
      </div>
    </form>
  );
}