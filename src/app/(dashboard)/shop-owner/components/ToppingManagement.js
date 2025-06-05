"use client";
import React, { useState, useEffect } from "react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";

const ToppingManagement = () => {
  const [toppings, setToppings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showForm, setShowForm] = useState(false);
  const [editTopping, setEditTopping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    is_available: true
  });

  // Helper function to sort toppings
  const sortToppings = (toppingsArray, sortType) => {
    return [...toppingsArray].sort((a, b) => {
      if (sortType === "ID Ascending") {
        return a.id - b.id;
      } else if (sortType === "ID Descending") {
        return b.id - a.id;
      } else if (sortType === "Name A-Z") {
        return a.name.localeCompare(b.name);
      } else if (sortType === "Name Z-A") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  };

  // Helper function to format date with time
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Fetch toppings
  useEffect(() => {
    const getToppings = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("auth_token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toppings`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("You don't have permission to view toppings");
          }
          throw new Error("Failed to fetch toppings");
        }

        const data = await res.json();
        console.log("Fetched toppings:", data.toppings);
        
        // Sort toppings by current sort option when fetched
        const sortedToppings = sortToppings(data.toppings || [], sortOption);
        setToppings(sortedToppings);
      } catch (error) {
        console.error("Error loading toppings: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getToppings();
  }, [sortOption]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    // Sort current toppings with new option
    const sortedToppings = sortToppings(toppings, option);
    setToppings(sortedToppings);
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      is_available: true
    });
    setEditTopping(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (topping) => {
    setFormData({
      name: topping.name,
      is_available: topping.is_available
    });
    setEditTopping(topping);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Topping name is required");
      return;
    }

    try {
      setFormLoading(true);
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const url = editTopping 
        ? `${process.env.NEXT_PUBLIC_API_URL}/toppings/${editTopping.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/toppings`;
      
      const method = editTopping ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          is_available: formData.is_available
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 422 && errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
        }
        if (res.status === 401 || res.status === 403) {
          throw new Error(`You don't have permission to ${editTopping ? 'update' : 'create'} this topping`);
        }
        throw new Error(`Failed to ${editTopping ? 'update' : 'create'} topping: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (editTopping) {
        // Update existing topping
        const updatedToppings = toppings.map((topping) =>
          topping.id === editTopping.id ? data.topping : topping
        );
        const sortedToppings = sortToppings(updatedToppings, sortOption);
        setToppings(sortedToppings);
        
        Swal.fire({
          title: 'Success!',
          text: 'Topping updated successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Add new topping
        const updatedToppings = [...toppings, data.topping];
        const sortedToppings = sortToppings(updatedToppings, sortOption);
        setToppings(sortedToppings);
        
        Swal.fire({
          title: 'Success!',
          text: 'Topping added successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      
      resetForm();
      
    } catch (error) {
      console.error(`Error ${editTopping ? 'updating' : 'creating'} topping:`, error);
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: `This will permanently delete the topping "${name}".`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
  
      if (confirmed.isConfirmed) {
        setLoading(true);
  
        const token = localStorage.getItem("auth_token");
  
        if (!token) {
          throw new Error("Authentication token not found");
        }
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toppings/${id}`, {
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
          if (res.status === 422) {
            // Topping is used in products
            throw new Error(errorData.message || "This topping cannot be deleted as it is used in products.");
          }
          throw new Error("Failed to delete topping");
        }

        // Remove topping and maintain current sort order
        const updatedToppings = toppings.filter((topping) => topping.id !== id);
        setToppings(updatedToppings);
  
        await Swal.fire({
          title: 'Deleted!',
          text: 'The topping has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting topping:", error);
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

  // Filter toppings and maintain sort order
  const filteredToppings = toppings.filter((topping) =>
    topping.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Topping Management</h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">All Toppings ({filteredToppings.length})</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search toppings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ID Ascending">Sort by: ID Ascending</option>
              <option value="ID Descending">Sort by: ID Descending</option>
              <option value="Name A-Z">Sort by: Name A-Z</option>
              <option value="Name Z-A">Sort by: Name Z-A</option>
            </select>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              <HiPlus className="w-4 h-4" />
              Add New Topping
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-xl font-semibold mb-4 text-black">
            {editTopping ? 'Edit Topping' : 'Add New Topping'}
          </h3>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-black font-medium">Topping Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded-md text-black focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={255}
                  placeholder="Enter topping name"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center text-black cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleFormChange}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="font-medium">Available</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                disabled={formLoading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={formLoading}
                className={`px-4 py-2 rounded text-white ${
                  formLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {formLoading 
                  ? (editTopping ? "Updating..." : "Adding...") 
                  : (editTopping ? "Update Topping" : "Add Topping")
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading toppings...</p>
        </div>
      ) : error && !showForm ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      ) : filteredToppings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">
            {toppings.length === 0 ? "No toppings found. Add your first topping!" : "No toppings match your search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border border-gray-300 font-semibold">ID</th>
                <th className="p-3 border border-gray-300 font-semibold">Name</th>
                <th className="p-3 border border-gray-300 font-semibold">Available</th>
                <th className="p-3 border border-gray-300 font-semibold">Created</th>
                <th className="p-3 border border-gray-300 font-semibold">Updated</th>
                <th className="p-3 border border-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredToppings.map((topping) => (
                <tr key={topping.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 font-medium">{topping.id}</td>
                  <td className="p-3 border border-gray-300 font-medium">{topping.name}</td>
                  <td className="p-3 border border-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      topping.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {topping.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300 text-xs">
                    <div className="whitespace-nowrap">
                      {formatDateTime(topping.created_at)}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300 text-xs">
                    <div className="whitespace-nowrap">
                      {formatDateTime(topping.updated_at)}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(topping)}
                        className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                        disabled={loading}
                      >
                        <HiPencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(topping.id, topping.name)}
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
      )}
    </div>
  );
};

export default ToppingManagement;