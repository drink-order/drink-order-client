"use client";
import React, { useState } from "react";

const AddStaff = ({ onBack, onAdd, fetchAccounts }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("staff"); // Default role to "staff"
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation to ensure either email or phone is provided
    if (!email && !phone) {
      setError("Either email or phone must be provided.");
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, email, phone, role, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      const newAccount = await res.json();
      onAdd(newAccount);
      fetchAccounts(); // Refresh the account list
    } catch (error) {
      console.error("Error creating account:", error);
      setError(error.message || "An error occurred while creating the account.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Add New Staff</h1>
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-slate-500 px-8 py-2"
        />
        <div className="flex gap-3">
          <button type="button" onClick={onBack} className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Back
          </button>
          <button type="submit" className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Add Staff
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default AddStaff;