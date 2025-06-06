"use client";
import React, { useEffect, useState } from 'react';
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AddCategoryForm from './AddCategoryForm';
import EditCategoryForm from './EditCategoryForm';
import Swal from "sweetalert2";

export default function CategoryManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to sort categories
  const sortCategories = (categoriesArray, sortType) => {
    return [...categoriesArray].sort((a, b) => {
      if (sortType === "ID Ascending") {
        return a.id - b.id;
      } else if (sortType === "ID Descending") {
        return b.id - a.id;
      } else if (sortType === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortType === "Oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortType === "Name A-Z") {
        return a.name?.localeCompare(b.name) || 0;
      } else if (sortType === "Name Z-A") {
        return b.name?.localeCompare(a.name) || 0;
      }
      return 0;
    });
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      setError(null);

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
      console.log("Fetched categories:", data);
      
      // Handle different API response structures
      const categoriesData = Array.isArray(data) ? data : (data.categories || data.data || []);
      
      // Ensure data has proper date properties
      const categoriesWithDates = categoriesData.map(category => ({
        ...category,
        created_at: category.created_at || category.createdAt || new Date().toISOString(),
        updated_at: category.updated_at || category.updatedAt || new Date().toISOString()
      }));
      
      // Sort categories by current sort option when fetched
      const sortedCategories = sortCategories(categoriesWithDates, sortOption);
      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error loading categories: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      getCategories();
    } else if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  // Separate useEffect for sort option changes
  useEffect(() => {
    if (categories.length > 0) {
      const sortedCategories = sortCategories(categories, sortOption);
      setCategories(sortedCategories);
    }
  }, [sortOption]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
  };

  const handleDelete = async (id, name) => {
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: `This will permanently delete category "${name}".`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel',
      });

      if (confirmed.isConfirmed) {
        setLoading(true);
        
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
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete category");
        }
        
        // Remove category immediately from state
        setCategories(prevCategories => 
          prevCategories.filter(category => category.id !== id)
        );
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'The category has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    console.log("Editing category:", category);
    setEditCategory(category);
    setShowEditCategory(true);
  };

  const handleAddNewCategory = (newCategory) => {
    console.log("Adding new category:", newCategory);
    
    // Ensure the new category has proper structure
    const categoryToAdd = {
      id: newCategory.id || Date.now(), // Fallback ID if not provided
      name: newCategory.name,
      created_at: newCategory.created_at || new Date().toISOString(),
      updated_at: newCategory.updated_at || new Date().toISOString(),
      ...newCategory
    };
    
    // Add new category immediately to state
    setCategories(prevCategories => {
      const updatedCategories = [...prevCategories, categoryToAdd];
      return sortCategories(updatedCategories, sortOption);
    });
    
    setShowAddNewCategory(false);
    
    Swal.fire({
      title: 'Success!',
      text: 'Category added successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleUpdateCategory = (updatedCategory) => {
    console.log("Updating category:", updatedCategory);
    
    // Update category immediately in state
    setCategories(prevCategories => {
      const updatedCategories = prevCategories.map((category) =>
        category.id === updatedCategory.id ? {
          ...category,
          ...updatedCategory,
          created_at: category.created_at, // Preserve original created_at
          updated_at: updatedCategory.updated_at || new Date().toISOString()
        } : category
      );
      return sortCategories(updatedCategories, sortOption);
    });
    
    setShowEditCategory(false);
    setEditCategory(null);
    
    Swal.fire({
      title: 'Success!',
      text: 'Category updated successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleBackToList = () => {
    setShowAddNewCategory(false);
    setShowEditCategory(false);
    setEditCategory(null);
  };

  // Filter categories and maintain sort order
  const filteredCategories = categories.filter((category) =>
    category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If showing add form
  if (showAddNewCategory) {
    return (
      <AddCategoryForm 
        onBack={handleBackToList} 
        onAdd={handleAddNewCategory} 
      />
    );
  }

  // If showing edit form
  if (showEditCategory && editCategory) {
    return (
      <EditCategoryForm
        category={editCategory}
        onBack={handleBackToList}
        onUpdate={handleUpdateCategory}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={getCategories} 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header Section - Matches other tables */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Category Management</h1>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-black">All Categories ({filteredCategories.length})</h2>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ID Ascending">Sort by: ID Ascending</option>
              <option value="ID Descending">Sort by: ID Descending</option>
              <option value="Name A-Z">Sort by: Name A-Z</option>
              <option value="Name Z-A">Sort by: Name Z-A</option>
              <option value="Newest">Sort by: Newest</option>
              <option value="Oldest">Sort by: Oldest</option>
            </select>
            {/* Add Button */}
            <button
              onClick={() => setShowAddNewCategory(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <HiPlus className="w-4 h-4" />
              Add New Category
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">
            {categories.length === 0 ? "No categories found." : "No categories match your search."}
          </p>
          {categories.length === 0 && (
            <button
              onClick={() => setShowAddNewCategory(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Add Your First Category
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table - Matches your existing style */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border border-gray-300 font-semibold">ID</th>
                    <th className="p-3 border border-gray-300 font-semibold">Category Name</th>
                    <th className="p-3 border border-gray-300 font-semibold">Created</th>
                    <th className="p-3 border border-gray-300 font-semibold">Updated</th>
                    <th className="p-3 border border-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300 font-medium">{category.id}</td>
                      <td className="p-3 border border-gray-300 font-medium">
                        <div className="truncate" title={category.name}>
                          {category.name}
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300 text-xs">
                        <div className="whitespace-nowrap">
                          <div>{new Date(category.created_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(category.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300 text-xs">
                        <div className="whitespace-nowrap">
                          <div>{new Date(category.updated_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(category.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            disabled={loading}
                          >
                            <HiPencil className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            disabled={loading}
                          >
                            <HiTrash className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-3">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-black">#{category.id} - {category.name}</h3>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div>Created: {new Date(category.created_at).toLocaleDateString()} at {new Date(category.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  <div>Updated: {new Date(category.updated_at).toLocaleDateString()} at {new Date(category.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <HiPencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <HiTrash className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}