"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function EditCategoryForm({ id, idCategory, nameCategory }) {
  const [ newID, setNewID ] = useState(idCategory);
  const [ newName, setNewName ] = useState(nameCategory);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/admin/api/category/${id}`, {
        method: "PUT",
        headers:{
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newID, newName}),
      });

      if(!res.ok){
        throw new Error("Failed to update category");
      }
      router.refresh();
      router.push('/admin');
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={e => setNewID(e.target.value)}
          value={newID}
          className="border border-slate-500 px-8 py-2"
          type="text"
          placeholder="Category ID"
        />
        <input
          onChange={e => setNewName(e.target.value)}
          value={newName}
          className="border border-slate-500 px-8 py-2"
          type="text"
          placeholder="Category Name"
        />
        <button className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">Update Category</button>
    </form>
  );
}
