"use client";

import React, { useEffect, useState } from 'react';
import Removebtn from './Removebtn';
import EditCategoryForm from './EditCategoryForm';
import AddCategory from '../addCategory/page';
import Link from 'next/link';
import { HiPencilAlt } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [addingCategory, setAddingCategory] = useState(false);

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

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleBack = () => {
    setEditingCategory(null);
    setAddingCategory(false);
  };

  const handleUpdate = (updatedCategory) => {
    setCategories(categories.map(category => category.id === updatedCategory.id ? updatedCategory : category));
    setEditingCategory(null);
  };

  const handleAdd = (newCategory) => {
    setCategories([...categories, newCategory]);
    setAddingCategory(false);
  };

  if (editingCategory) {
    return <EditCategoryForm id={editingCategory.id} nameCategory={editingCategory.nameCategory} onBack={handleBack} onUpdate={handleUpdate} />;
  }

  if (addingCategory) {
    return <AddCategory onBack={handleBack} onAdd={handleAdd} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setAddingCategory(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Category
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Category Name</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Updated At</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="p-2 border">{category.id}</td>
              <td className="p-2 border">{category.nameCategory}</td>
              <td className="p-2 border">{new Date(category.createdAt).toLocaleDateString()}</td>
              <td className="p-2 border">{new Date(category.updatedAt).toLocaleDateString()}</td>
              <td className="p-2 border">
                <div className="flex justify-center gap-2">
                  <Removebtn id={category.id} onDelete={handleDelete} />
                  <button onClick={() => handleEdit(category)}>
                    <HiPencilAlt size={24} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}