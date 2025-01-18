import React from 'react';
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
    return data;

  } catch (error) {
    console.log("Error loading categories: ", error);
    return { categories: [] }; // Return an empty array if there is an error
  }
}

export default async function CategoryList() {
  const { categories } = await getCategories();

  return (
    <div>
      {categories.map(c => (
        <div key={c._id} className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
          <div>
            <h2 className="font-bold text-lg">{c.idCategory}</h2>
            <div>{c.nameCategory}</div>
          </div>
          <div className="flex gap-2">
            <Removebtn id={c._id} />
            <Link href={`/admin/editCategory/${c._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}