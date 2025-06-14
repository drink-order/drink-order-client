"use client";
import React, { useState } from "react";

const AddAccountForm = ({ onBack, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Client-side validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          name,
          email, 
          phone: phone || null,
          role,
          password 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        
        // Handle Laravel validation errors (422 status)
        if (res.status === 422 && errorData.errors) {
          setValidationErrors(errorData.errors);
          
          // Set primary error message
          if (errorData.errors.email && errorData.errors.email.length > 0) {
            setError(errorData.errors.email[0]);
          } else if (errorData.errors.name && errorData.errors.name.length > 0) {
            setError(errorData.errors.name[0]);
          } else {
            setError("Validation failed. Please check your input.");
          }
          return;
        }
        
        // Handle other errors
        throw new Error(errorData.message || "Failed to create account");
      }

      const data = await res.json();
      
      // Call the onAdd callback with the new account
      onAdd(data.user);
    } catch (error) {
      console.error("Error creating account:", error);
      setError(error.message || "An error occurred while creating the account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Account</h1>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${
                    validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                  disabled={loading}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${
                    validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                  disabled={loading}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Enter phone number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${
                    validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="shop_owner">Shop Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${
                    validationErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                  disabled={loading}
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Information */}
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Selected Role:</span> {role.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {role === 'admin' && 'Full system access with user management capabilities.'}
                {role === 'shop_owner' && 'Can manage products, staff, and shop operations.'}
                {role === 'staff' && 'Limited access to assigned shop operations.'}
                {role === 'user' && 'Basic customer account with order capabilities.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
                {error.includes("already been taken") && (
                  <p className="text-red-500 text-xs mt-1">
                    This email address is already registered. Please use a different email.
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button 
                type="button" 
                onClick={onBack}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md transition-colors duration-200 text-base"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAccountForm;