"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const AddAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

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
      // Optionally, you can redirect or show a success message here
      router.push('/admin'); // Redirect to admin page after adding account
    } catch (error) {
      console.error("Error creating account:", error);
      setError(error.message || "An error occurred while creating the account.");
    }
  };

  // useEffect for side effects like error display
  useEffect(() => {
    if (error) {
      // You can show a toast notification, log the error, etc.
      console.error("Error occurred:", error);
    }
  }, [error]);  // This will run whenever the `error` state changes

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Add New Account</h1>
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
        >
          <option value="admin">Admin</option>
          <option value="shop owner">Shop Owner</option>
          <option value="staff">Staff</option>
          <option value="user">User</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-slate-500 px-8 py-2"
        />
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Back
          </button>
          <button type="submit" className="bg-[#5D4435] font-bold text-white py-3 px-5 w-fit">
            Add Account
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default AddAccount;
