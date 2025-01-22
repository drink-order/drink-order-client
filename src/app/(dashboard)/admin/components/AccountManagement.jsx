"use client";
import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import EditAccount from "../edit-account/[id]/page";
import AddAccount from "../add-account/page";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Oldest");
  const [editingAccount, setEditingAccount] = useState(null);
  const [addingAccount, setAddingAccount] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) {
        throw new Error(`Failed to fetch accounts: ${res.statusText}`);
      }
      const data = await res.json();
      // Sort accounts by the initial sort option (Oldest)
      const sortedAccounts = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setAccounts(sortedAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
      const res = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete account");
      }
      setAccounts(accounts.filter(account => account.id !== id));
      fetchAccounts(); // Refresh the account list
    } catch (error) {
      console.error("Error deleting account:", error);
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
    setAccounts(accounts.map(account => account.id === updatedAccount.id ? updatedAccount : account));
    setEditingAccount(null);
    fetchAccounts(); // Refresh the account list
  };

  const handleAdd = (newAccount) => {
    setAccounts([...accounts, newAccount]);
    setAddingAccount(false);
    fetchAccounts(); // Refresh the account list
  };

  const filteredAccounts = accounts.filter((account) =>
    account.username && account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (editingAccount) {
    return <EditAccount id={editingAccount.id} onBack={handleBack} onUpdate={handleUpdate} fetchAccounts={fetchAccounts} />;
  }

  if (addingAccount) {
    return <AddAccount onBack={handleBack} onAdd={handleAdd} fetchAccounts={fetchAccounts} />;
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Account Management</h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">All Accounts</h2>
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
          {filteredAccounts.map((account) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountManagement;