"use client";
import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import EditAccount from "../edit-account/[id]/page";
import AddAccount from "../add-account/page";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Oldest");
  const [editingAccount, setEditingAccount] = useState(null);
  const [addingAccount, setAddingAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the auth token from localStorage
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          // Handle unauthorized access
          throw new Error("You don't have permission to access this resource");
        }
        throw new Error(`Failed to fetch accounts: ${res.statusText}`);
      }

      const data = await res.json();
      
      // Ensure data has createdAt property or provide a fallback
      const accountsWithDates = data.map(account => ({
        ...account,
        createdAt: account.createdAt || account.created_at || new Date().toISOString(),
        updatedAt: account.updatedAt || account.updated_at || new Date().toISOString()
      }));
      
      // Sort accounts by the initial sort option (Oldest)
      const sortedAccounts = accountsWithDates.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      
      setAccounts(sortedAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error.message);
      
      if (error.message.includes("Authentication") || error.message.includes("permission")) {
        // Redirect to login if unauthorized
        router.push("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch accounts if user is admin
    if (user && user.role === "admin") {
      fetchAccounts();
    } else if (user && user.role !== "admin") {
      // Redirect non-admin users
      router.push("/");
    }
  }, [user, router]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedAccounts = [...accounts].sort((a, b) => {
      if (option === "Newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setAccounts(sortedAccounts);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete account");
      }
      
      setAccounts(accounts.filter(account => account.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account: " + error.message);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
  };

  const handleBack = () => {
    setEditingAccount(null);
    setAddingAccount(false);
  };

  const handleUpdate = (updatedAccount) => {
    setAccounts(accounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    ));
    setEditingAccount(null);
    fetchAccounts(); // Refresh the account list
  };

  const handleAdd = (newAccount) => {
    setAccounts([...accounts, newAccount]);
    setAddingAccount(false);
    fetchAccounts(); // Refresh the account list
  };

  const filteredAccounts = accounts.filter((account) =>
    (account.username && account.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (account.email && account.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (account.phone && account.phone.includes(searchTerm))
  );

  if (editingAccount) {
    return <EditAccount id={editingAccount.id} onBack={handleBack} onUpdate={handleUpdate} fetchAccounts={fetchAccounts} />;
  }

  if (addingAccount) {
    return <AddAccount onBack={handleBack} onAdd={handleAdd} fetchAccounts={fetchAccounts} />;
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
          onClick={fetchAccounts}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Account Management</h1>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-black">All Accounts</h2>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            {/* Search Bar */}
            <div className="relative">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
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
            {/* Add New Account Button */}
            <button
              onClick={() => setAddingAccount(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add New Account
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td className="p-2 border">{account.id}</td>
                  <td className="p-2 border">{account.username}</td>
                  <td className="p-2 border">{account.email}</td>
                  <td className="p-2 border">{account.phone}</td>
                  <td className="p-2 border">{account.role}</td>
                  <td className="p-2 border">{new Date(account.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 border">{new Date(account.updatedAt).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(account)}
                      className="bg-yellow-400 text-white hover:bg-yellow-500 hover:text-white border px-4 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="bg-red-500 text-white hover:bg-red-600 hover:text-white border px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center">
                  {searchTerm ? "No accounts match your search criteria" : "No accounts found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;