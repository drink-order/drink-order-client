"use client";
import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";

const StaffManagement = () => {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Oldest");

  useEffect(() => {
    // Fetch staff members from the API
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user");
        if (!res.ok) {
          throw new Error(`Failed to fetch staff: ${res.statusText}`);
        }
        const data = await res.json();
        // Filter accounts to display only those with the "staff" role
        const staffMembers = data.filter(user => user.role === "staff");
        // Sort staff by the initial sort option (Oldest)
        const sortedStaff = staffMembers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setStaff(sortedStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedStaff = [...staff].sort((a, b) => {
      if (option === "Newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setStaff(sortedStaff);
  };

  const handleDelete = (id) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const handleEdit = (id) => {
    router.push(`/shop-owner/edit-staff/${id}`);
  };

  const filteredStaff = staff.filter((member) =>
    member.username && member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">All Staff Members</h2>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Sort Dropdown */}
            <div>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="border rounded-md px-3 py-2"
              >
                <option value="Newest">Sort by: Newest</option>
                <option value="Oldest">Sort by: Oldest</option>
              </select>
            </div>
            {/* Add New Staff Button */}
            <button
              onClick={() => router.push("/shop-owner/add-staff")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add New Staff
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Updated At</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((member) => (
            <tr key={member.id}>
              <td className="p-2 border">{member.id}</td>
              <td className="p-2 border">{member.username}</td>
              <td className="p-2 border">{member.email}</td>
              <td className="p-2 border">{member.phone}</td>
              <td className="p-2 border">{member.role}</td>
              <td className="p-2 border">{new Date(member.createdAt).toLocaleDateString()}</td>
              <td className="p-2 border">{new Date(member.updatedAt).toLocaleDateString()}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(member.id)}
                  className="bg-yellow-400 text-white hover:bg-yellow-500 hover:text-white border px-4 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white border px-4 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;