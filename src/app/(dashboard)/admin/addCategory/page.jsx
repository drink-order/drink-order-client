"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function addCategory() {
  const [idCategory, setIdCategory] = useState("");
  const [nameCategory, setNameCategory] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!idCategory || !nameCategory){
      alert("ID and Name of Category are required.");
      return;
    }

    try{
      const res = await fetch('http://localhost:3000/admin/api/category', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({idCategory, nameCategory}),
      });

      if(res.ok){
        router.push('/admin');
      } else {
        throw new Error("Failed to create Category");
      }
    }catch (error){
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setIdCategory(e.target.value)}
          value={idCategory}
          className="border border-slate-500 px-8 py-2"
          type="text"
          placeholder="Category ID"
        />
        <input
          onChange={(e) => setNameCategory(e.target.value)}
          value={nameCategory}
          className="border border-slate-500 px-8 py-2"
          type="text"
          placeholder="Category Name"
        />
        <button type='submit' className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">Add Category</button>
    </form>
  )
}
