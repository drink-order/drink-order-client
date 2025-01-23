"use client";
import React, { useState, useEffect } from "react";

const EditStaff = ({ id, onBack, onUpdate, fetchAccounts }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the account details
    const fetchAccount = async () => {
      try {
        const res = await fetch(`/api/user/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch account: ${res.statusText}`);
        }
        const data = await res.json();
        setUsername(data.username || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setRole(data.role || "user");
      } catch (error) {
        console.error("Error fetching account:", error);
        setError(error.message);
      }
    };

    fetchAccount();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, email, phone, role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update account");
      }

      const updatedAccount = await res.json();
      onUpdate(updatedAccount);
      fetchAccounts(); // Refresh the account list
    } catch (error) {
      console.error("Error updating account:", error);
      setError(error.message || "An error occurred while updating the account.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-slate-500 px-8 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-slate-500 px-8 py-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-slate-500 px-8 py-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-slate-500 px-8 py-2"
          disabled
        >
          <option value="admin">Admin</option>
          <option value="shop owner">Shop Owner</option>
          <option value="staff">Staff</option>
          <option value="user">User</option>
        </select>
        <div className="flex gap-3">
          <button type="button" onClick={onBack} className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Back
          </button>
          <button type="submit" className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Update Account
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default EditStaff;