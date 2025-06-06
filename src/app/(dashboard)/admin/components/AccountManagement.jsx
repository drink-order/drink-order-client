"use client";
import React, { useState, useEffect } from "react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import AddAccountForm from "./AddAccountForm";
import EditAccountForm from "./EditAccountForm";
import Swal from "sweetalert2";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Oldest");
  const [showAddNewAccount, setShowAddNewAccount] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You don't have permission to access this resource");
        }
        throw new Error(`Failed to fetch accounts: ${res.statusText}`);
      }

      const data = await res.json();
      
      const accountsWithDates = data.map(account => ({
        ...account,
        created_at: account.created_at || account.createdAt || new Date().toISOString(),
        updated_at: account.updated_at || account.updatedAt || new Date().toISOString()
      }));
      
      const sortedAccounts = accountsWithDates.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      
      setAccounts(sortedAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error.message);
      
      if (error.message.includes("Authentication") || error.message.includes("permission")) {
        router.push("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAccounts();
    } else if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedAccounts = [...accounts].sort((a, b) => {
      if (option === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });
    setAccounts(sortedAccounts);
  };

  const handleDelete = async (id, name) => {
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: `This will permanently delete user "${name}".`,
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
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
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
          throw new Error(errorData.message || "Failed to delete account");
        }
        
        setAccounts(accounts.filter(account => account.id !== id));
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'The user has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
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
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
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
          throw new Error("Account not found");
        }
        throw new Error("Failed to fetch account details");
      }

      const data = await res.json();
      setEditAccount(data.user);
      setShowEditAccount(true);
    } catch (error) {
      console.error("Error fetching account for edit:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to load account details for editing',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    setShowAddNewAccount(true);
  };

  const handleAddNewAccount = (newAccount) => {
    const updatedAccounts = [...accounts, newAccount];
    const sortedAccounts = updatedAccounts.sort((a, b) => {
      if (sortOption === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });
    setAccounts(sortedAccounts);
    setShowAddNewAccount(false);
    
    Swal.fire({
      title: 'Success!',
      text: 'Account added successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleUpdateAccount = (updatedAccount) => {
    const updatedAccounts = accounts.map((account) =>
      account.id === updatedAccount.id ? updatedAccount : account
    );
    
    const sortedAccounts = updatedAccounts.sort((a, b) => {
      if (sortOption === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });
    setAccounts(sortedAccounts);
    
    setShowEditAccount(false);
    setEditAccount(null);
    
    Swal.fire({
      title: 'Success!',
      text: 'Account updated successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleBackToList = () => {
    setShowAddNewAccount(false);
    setShowEditAccount(false);
    setEditAccount(null);
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    Swal.fire({
      title: 'Email Copied!',
      text: email,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  };

  const filteredAccounts = accounts.filter((account) =>
    (account.name && account.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (account.email && account.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (account.phone && account.phone.includes(searchTerm))
  );

  // If showing add form
  if (showAddNewAccount) {
    return (
      <AddAccountForm 
        onBack={handleBackToList} 
        onAdd={handleAddNewAccount} 
      />
    );
  }

  // If showing edit form
  if (showEditAccount && editAccount) {
    return (
      <EditAccountForm
        account={editAccount}
        onBack={handleBackToList}
        onUpdate={handleUpdateAccount}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={fetchAccounts} 
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
        <h1 className="text-3xl font-bold mb-2 text-black">Account Management</h1>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-black">All Accounts ({filteredAccounts.length})</h2>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
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
              <option value="Newest">Sort by: Newest</option>
              <option value="Oldest">Sort by: Oldest</option>
            </select>
            {/* Add Button */}
            <button
              onClick={handleAddAccount}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <HiPlus className="w-4 h-4" />
              Add New Account
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">
            {accounts.length === 0 ? "No accounts found." : "No accounts match your search."}
          </p>
          {accounts.length === 0 && (
            <button
              onClick={handleAddAccount}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Add Your First Account
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
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300 font-medium">{account.id}</td>
                      <td className="p-3 border border-gray-300 font-medium">
                        <div className="truncate" title={account.name}>
                          {account.name}
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div 
                          className="truncate cursor-pointer hover:text-blue-600 transition-colors duration-200 max-w-56 mx-auto" 
                          title={`Click to copy: ${account.email}`}
                          onClick={() => copyEmail(account.email)}
                        >
                          {account.email}
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="truncate" title={account.phone || 'N/A'}>
                          {account.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.role === 'admin' ? 'bg-red-100 text-red-800' :
                          account.role === 'shop_owner' ? 'bg-blue-100 text-blue-800' :
                          account.role === 'staff' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {account.role?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-300 text-xs">
                        <div className="whitespace-nowrap">
                          <div>{new Date(account.created_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(account.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300 text-xs">
                        <div className="whitespace-nowrap">
                          <div>{new Date(account.updated_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(account.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(account.id)}
                            className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            disabled={loading}
                          >
                            <HiPencil className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(account.id, account.name)}
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
            {filteredAccounts.map((account) => (
              <div key={account.id} className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-black">#{account.id} - {account.name}</h3>
                    <div 
                      className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors mt-1"
                      onClick={() => copyEmail(account.email)}
                      title="Click to copy email"
                    >
                      {account.email}
                    </div>
                    {account.phone && (
                      <div className="text-sm text-gray-600 mt-1">{account.phone}</div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.role === 'admin' ? 'bg-red-100 text-red-800' :
                    account.role === 'shop_owner' ? 'bg-blue-100 text-blue-800' :
                    account.role === 'staff' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {account.role?.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div>Created: {new Date(account.created_at).toLocaleDateString()} at {new Date(account.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  <div>Updated: {new Date(account.updated_at).toLocaleDateString()} at {new Date(account.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(account.id)}
                    className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <HiPencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id, account.name)}
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
};

export default AccountManagement;