"use client";
import React, { useState, useEffect } from "react";

const EditStaffForm = ({ staff, onBack, onUpdate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize form with staff data
  useEffect(() => {
    if (staff) {
      setName(staff.name || "");
      setEmail(staff.email || "");
      setPhone(staff.phone || "");
    }
  }, [staff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const updateData = {
        name,
        email,
        phone: phone || null,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/staff/${staff.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update staff member");
      }

      const data = await res.json();
      
      // Call the onUpdate callback with the updated staff member
      onUpdate(data.user);
    } catch (error) {
      console.error("Error updating staff member:", error);
      setError(error.message || "An error occurred while updating the staff member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Staff Member</h1>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                placeholder="Enter phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* Role display */}
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Role:</span> Staff (cannot be changed)
              </p>
            </div>

            {/* Password change note */}
            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Note:</span> To change password, please contact an administrator.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                onClick={onBack}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStaffForm;