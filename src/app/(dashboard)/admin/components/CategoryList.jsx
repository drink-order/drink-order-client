"use client";

import React, { useEffect, useState } from 'react';
import Removebtn from './Removebtn';
import EditCategoryForm from './EditCategoryForm';
import AddCategory from '../addCategory/page';
import { HiPencilAlt } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function CategoryList() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the auth token
      const token = localStorage.getItem("auth_token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : '',
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You don't have permission to view categories");
        }
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();
      return data;

    } catch (error) {
      console.error("Error loading categories: ", error);
      setError(error.message);
      return { categories: [] }; 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch categories if user is admin
    if (user && user.role === "admin") {
      const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data.categories || []);
      };
      fetchCategories();
    } else if (user && user.role !== "admin") {
      // Redirect non-admin users
      router.push("/");
    }
  }, [user, router]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete category");
      }
      
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category: " + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleBack = () => {
    setEditingCategory(null);
    setAddingCategory(false);
  };

  const handleUpdate = async (updatedCategory) => {
    // Refresh the category list after update
    const data = await getCategories();
    setCategories(data.categories || []);
    setEditingCategory(null);
  };

  const handleAdd = async (newCategory) => {
    // Refresh the category list after addition
    const data = await getCategories();
    setCategories(data.categories || []);
    setAddingCategory(false);
  };

  if (editingCategory) {
    return <EditCategoryForm id={editingCategory.id} nameCategory={editingCategory.nameCategory} onBack={handleBack} onUpdate={handleUpdate} />;
  }

  if (addingCategory) {
    return <AddCategory onBack={handleBack} onAdd={handleAdd} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={() => getCategories()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
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
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="p-2 border">{category.id}</td>
                <td className="p-2 border">{category.name}</td>
                <td className="p-2 border">{new Date(category.createdAt || category.created_at).toLocaleDateString()}</td>
                <td className="p-2 border">{new Date(category.updatedAt || category.updated_at).toLocaleDateString()}</td>
                <td className="p-2 border">
                  <div className="flex justify-center gap-2">
                    <Removebtn id={category.id} onDelete={handleDelete} />
                    <button onClick={() => handleEdit(category)}>
                      <HiPencilAlt size={24} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}