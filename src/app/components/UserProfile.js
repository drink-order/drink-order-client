"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const { user, updateUser } = useAuth();
  const router = useRouter();

  // Check if user is guest
  const isGuest = user?.role === 'guest';

  useEffect(() => {
    // If no user yet, keep loading
    if (!user) {
      return;
    }

    // If user is guest, stop loading and show guest UI
    if (isGuest) {
      setError("Guests cannot access profile settings. Profile editing is only available for registered users.");
      setFetchLoading(false);
      return;
    }

    // Only fetch profile for non-guest users
    const fetchProfile = async () => {
      try {
        setFetchLoading(true);
        setError(null);
        
        const token = localStorage.getItem("auth_token");
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("Access denied. Guests cannot view profile details.");
          }
          throw new Error(`Failed to fetch profile: ${res.statusText}`);
        }

        const data = await res.json();
        const userProfile = data.user;
        
        setName(userProfile.name || "");
        setEmail(userProfile.email || "");
        setPhone(userProfile.phone || "");
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, isGuest]); // Only depend on user ID and guest status

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Block guests from submitting
    if (isGuest) {
      setError("Guests cannot edit profile information. Please create a regular account to access profile settings.");
      return;
    }

    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    // Password validation - if any password field is filled, all must be filled
    if (currentPassword || newPassword || passwordConfirmation) {
      if (!currentPassword.trim()) {
        setError("Current password is required to change password.");
        return;
      }
      
      if (!newPassword.trim()) {
        setError("New password is required.");
        return;
      }
      
      if (!passwordConfirmation.trim()) {
        setError("Password confirmation is required.");
        return;
      }
      
      if (newPassword !== passwordConfirmation) {
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
      };

      // Include password fields if changing password
      if (currentPassword && newPassword) {
        updateData.current_password = currentPassword;
        updateData.password = newPassword;
        updateData.password_confirmation = passwordConfirmation;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
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
        
        if (res.status === 403) {
          throw new Error("Access denied. Guests cannot edit profile information.");
        }
        
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await res.json();
      
      // Update the auth context with new user data
      if (updateUser) {
        updateUser(updatedData.user);
      }
      
      setSuccess("Profile updated successfully!");
      
      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
      setShowPasswordSection(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordConfirmation("");
    setShowPasswordSection(false);
    setError(null);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (fetchLoading || !user) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 ml-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Guest access denied view
  if (isGuest) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Profile Access Restricted</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Guest Account Limitations</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-2">You are currently logged in as a <strong>guest user</strong> with limited access.</p>
                <p className="mb-3">Guest accounts cannot:</p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  <li>Edit profile information</li>
                  <li>Change passwords</li>
                  <li>Access account settings</li>
                  <li>Save personal preferences</li>
                </ul>
                <p className="font-medium">To access these features, please create a regular user account or contact an administrator.</p>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Session Information</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Role:</strong> <span className="capitalize text-yellow-600 font-medium">{user.role?.replace('_', ' ')}</span></p>
              <p><strong>Table:</strong> {localStorage.getItem('table_number') || 'N/A'}</p>
              <p><strong>Session ID:</strong> {localStorage.getItem('session_id') || 'N/A'}</p>
              <p><strong>Access granted:</strong> {new Date(user.created_at || user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 font-medium text-white py-3 px-6 rounded-md transition-colors"
          >
            Return to Menu
          </button>
          <button 
            onClick={() => router.push('/sign-up')}
            className="bg-green-600 hover:bg-green-700 font-medium text-white py-3 px-6 rounded-md transition-colors"
          >
            Create Account
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-black">My Profile</h1>
      
      {user && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Role:</strong> <span className="capitalize text-green-600 font-medium">{user.role?.replace('_', ' ')}</span>
          </p>
          <p className="text-sm text-gray-600">
            <strong>Member since:</strong> {new Date(user.created_at || user.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading || isGuest}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading || isGuest}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            placeholder="Enter your phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading || isGuest}
          />
        </div>
        
        {/* Password Change Section - Hidden for guests */}
        {!isGuest && (
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Password</h3>
              {!showPasswordSection ? (
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  disabled={isGuest}
                >
                  Change Password
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelPasswordChange}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>

            {showPasswordSection && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 mb-3">
                  Enter your current password and choose a new one to change your password.
                </p>
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading || isGuest}
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading || isGuest}
                  />
                </div>
                
                <div>
                  <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    id="passwordConfirmation"
                    placeholder="Confirm your new password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading || isGuest}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-6">
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 font-medium text-white py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isGuest}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          
          {isGuest && (
            <button 
              type="button"
              onClick={() => router.push('/sign-up')}
              className="bg-green-600 hover:bg-green-700 font-medium text-white py-3 px-6 rounded-md transition-colors"
            >
              Create Account Instead
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;