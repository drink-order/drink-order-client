"use client";

import React, { useEffect, useState } from 'react';
import Removebtn from './Removebtn';
import Link from 'next/link';
import { HiPencilAlt } from 'react-icons/hi';

const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:3000/admin/api/category", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();
    console.log('Fetched Categories:', data); // Debugging log
    return data;

  } catch (error) {
    console.log("Error loading categories: ", error);
    return { categories: [] }; // Return an empty array if there is an error
  }
}

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  const handleDelete = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <div>
      {categories.map(c => (
        <div key={c.id} className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
          <div>
            <h2 className="font-bold text-lg">{c.nameCategory}</h2>
          </div>
          <div className="flex gap-2">
            <Removebtn id={c.id} onDelete={handleDelete} />
            <Link href={`/admin/editCategory/${c.id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}