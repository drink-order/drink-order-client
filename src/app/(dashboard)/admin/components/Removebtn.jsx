"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import { HiOutlineTrash } from "react-icons/hi";

export default function Removebtn({ id }) {
  const router = useRouter();

  const removeCategory = async () => {
    const confirmed = confirm('Are you sure?');

    if (confirmed) {
      try {
        const res = await fetch(`http://localhost:3000/admin/api/category?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          router.refresh();
        } else {
          console.error("Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <button onClick={removeCategory} className="text-red-500">
      <HiOutlineTrash size={24} />
    </button>
  );
}