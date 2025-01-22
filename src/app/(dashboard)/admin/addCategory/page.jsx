"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AddCategory({ onBack, onAdd }) {
  const [nameCategory, setNameCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameCategory) {
      alert("Name of Category is required.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/admin/api/category', {
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
      onAdd(newCategory);
    } catch (error) {
      console.log(error);
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
          <button type="button" onClick={onBack} className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Back
          </button>
          <button type="submit" className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}