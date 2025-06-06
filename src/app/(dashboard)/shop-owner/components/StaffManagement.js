"use client";
import React, { useState, useEffect } from "react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import AddStaffForm from "./AddStaffForm";
import EditStaffForm from "./EditStaffForm";
import Swal from "sweetalert2";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showAddNewStaff, setShowAddNewStaff] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to sort staff
  const sortStaff = (staffArray, sortType) => {
    return [...staffArray].sort((a, b) => {
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

  // Helper function to format date with time
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-minute',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Fetch staff members
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You don't have permission to view staff members");
        }
        throw new Error(`Failed to fetch users: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Fetched users:", data);
      
      // Filter to get only staff members
      const staffMembers = data.filter(user => user.role === "staff");
      console.log("Filtered staff members:", staffMembers);
      
      // Ensure data has proper date properties
      const staffWithDates = staffMembers.map(member => ({
        ...member,
        created_at: member.created_at || member.createdAt || new Date().toISOString(),
        updated_at: member.updated_at || member.updatedAt || new Date().toISOString()
      }));
      
      // Sort staff by current sort option when fetched
      const sortedStaff = sortStaff(staffWithDates, sortOption);
      setStaff(sortedStaff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [sortOption]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    // Sort current staff with new option
    const sortedStaff = sortStaff(staff, option);
    setStaff(sortedStaff);
  };

  const handleDelete = async (id, name) => {
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: `This will permanently delete staff member "${name}".`,
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
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/staff/${id}`, {
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
          throw new Error(errorData.message || "Failed to delete staff member");
        }

        // Remove staff member and maintain current sort order
        const updatedStaff = staff.filter((member) => member.id !== id);
        setStaff(updatedStaff);
  
        await Swal.fire({
          title: 'Deleted!',
          text: 'The staff member has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
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

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/staff/${id}`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : '',
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Staff member not found");
        }
        throw new Error("Failed to fetch staff member details");
      }

      const data = await res.json();
      console.log("Fetched staff member for edit:", data.user);
      setEditStaff(data.user);
      setShowEditStaff(true);
    } catch (error) {
      console.error("Error fetching staff member for edit:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to load staff member details for editing',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewStaff = (newStaff) => {
    console.log("Adding new staff member:", newStaff);
    
    // Add new staff member and re-sort to maintain order
    const updatedStaff = [...staff, newStaff];
    const sortedStaff = sortStaff(updatedStaff, sortOption);
    setStaff(sortedStaff);
    setShowAddNewStaff(false);
    
    Swal.fire({
      title: 'Success!',
      text: 'Staff member added successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleUpdateStaff = (updatedStaff) => {
    console.log("Updating staff member:", updatedStaff);
    
    // Update staff member while maintaining current sort order
    const updatedStaffList = staff.map((member) =>
      member.id === updatedStaff.id ? updatedStaff : member
    );
    
    // Re-sort to ensure consistency
    const sortedStaff = sortStaff(updatedStaffList, sortOption);
    setStaff(sortedStaff);
    
    setShowEditStaff(false);
    setEditStaff(null);
    
    Swal.fire({
      title: 'Success!',
      text: 'Staff member updated successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleBackToList = () => {
    setShowAddNewStaff(false);
    setShowEditStaff(false);
    setEditStaff(null);
  };

  // Filter staff and maintain sort order
  const filteredStaff = staff.filter((member) =>
    (member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.phone && member.phone.includes(searchTerm))
  );

  // If showing add form
  if (showAddNewStaff) {
    return (
      <AddStaffForm 
        onBack={handleBackToList} 
        onAdd={handleAddNewStaff} 
      />
    );
  }

  // If showing edit form
  if (showEditStaff && editStaff) {
    return (
      <EditStaffForm
        staff={editStaff}
        onBack={handleBackToList}
        onUpdate={handleUpdateStaff}
      />
    );
  }

  // Main staff list view
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Staff Management</h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">All Staff Members ({filteredStaff.length})</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
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
              <option value="Newest">Sort by: Newest</option>
              <option value="Oldest">Sort by: Oldest</option>
            </select>
            <button
              onClick={() => setShowAddNewStaff(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              <HiPlus className="w-4 h-4" />
              Add New Staff
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading staff...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={fetchStaff} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">
            {staff.length === 0 ? "No staff members found." : "No staff members match your search."}
          </p>
          {staff.length === 0 && (
            <button
              onClick={() => setShowAddNewStaff(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Add Your First Staff Member
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border border-gray-300 font-semibold">ID</th>
                <th className="p-3 border border-gray-300 font-semibold">Name</th>
                <th className="p-3 border border-gray-300 font-semibold">Email</th>
                <th className="p-3 border border-gray-300 font-semibold">Phone</th>
                <th className="p-3 border border-gray-300 font-semibold">Role</th>
                <th className="p-3 border border-gray-300 font-semibold">Created</th>
                <th className="p-3 border border-gray-300 font-semibold">Updated</th>
                <th className="p-3 border border-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 font-medium">{member.id}</td>
                  <td className="p-3 border border-gray-300 font-medium">{member.name}</td>
                  <td className="p-3 border border-gray-300">{member.email}</td>
                  <td className="p-3 border border-gray-300">{member.phone || 'N/A'}</td>
                  <td className="p-3 border border-gray-300">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300 text-xs">
                    <div className="whitespace-nowrap">
                      {formatDateTime(member.created_at)}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300 text-xs">
                    <div className="whitespace-nowrap">
                      {formatDateTime(member.updated_at)}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(member.id)}
                        className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                        disabled={loading}
                      >
                        <HiPencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
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

export default StaffManagement;