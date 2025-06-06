"use client";
import React, { useState, useEffect } from "react";

const EditAccountForm = ({ account, onBack, onUpdate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Initialize form with account data
  useEffect(() => {
    if (account) {
      setName(account.name || "");
      setEmail(account.email || "");
      setPhone(account.phone || "");
      setRole(account.role || "user");
    }
  }, [account]);

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

    // Password validation if changing password
    if (showPasswordSection && (currentPassword || newPassword || confirmPassword)) {
      if (!currentPassword.trim()) {
        setError("Current password is required to change password.");
        return;
      }
      
      if (!newPassword.trim()) {
        setError("New password is required.");
        return;
      }
      
      if (!confirmPassword.trim()) {
        setError("Password confirmation is required.");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }
      
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
      
      if (currentPassword === newPassword) {
        setError("New password must be different from current password.");
        return;
      }
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
        role,
      };

      // Include password fields if changing password
      if (showPasswordSection && currentPassword && newPassword) {
        updateData.current_password = currentPassword;
        updateData.password = newPassword;
        updateData.password_confirmation = confirmPassword;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${account.id}`, {
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
        throw new Error(errorData.message || "Failed to update account");
      }

      const data = await res.json();
      
      // Call the onUpdate callback with the updated account
      onUpdate(data.user);
    } catch (error) {
      console.error("Error updating account:", error);
      setError(error.message || "An error occurred while updating the account.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordSection(false);
    setError(null);
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Account</h1>
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
                  className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  required
                  disabled={loading}
                />
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
                  className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  required
                  disabled={loading}
                />
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
                  className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  disabled={loading}
                />
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
              
              <div className="md:col-span-2">
                {/* Role Information */}
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200 h-full flex items-center">
                  <div>
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Current Role:</span> {role.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {role === 'admin' && 'Full system access with user management capabilities.'}
                      {role === 'shop_owner' && 'Can manage products, staff, and shop operations.'}
                      {role === 'staff' && 'Limited access to assigned shop operations.'}
                      {role === 'user' && 'Basic customer account with order capabilities.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="border-t pt-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">Password Management</h3>
                {!showPasswordSection ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(true)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-md font-medium transition-colors duration-200"
                  >
                    Change Password
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-md font-medium transition-colors duration-200"
                  >
                    Cancel Password Change
                  </button>
                )}
              </div>

              {showPasswordSection && (
                <div className="space-y-6 p-6 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the current password and choose a new one to change the account password.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          New Password *
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          placeholder="Enter new password (min. 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
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
                {loading ? "Updating..." : "Update Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccountForm;