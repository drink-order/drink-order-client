"use client";
import React, { useState, useEffect } from "react";
import { PiEyesDuotone } from "react-icons/pi";
import { HiSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";

const ReceivedOrder = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("preparing");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Newest");

  const statusOptions = [
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?status=preparing`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) {
          if(res.status === 401 || res.status === 403) {
            throw new Error("You are not authorized to view this page");
          }
          throw new Error(`Failed to fetch orders: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Fetched orders:", data); // Debugging log
        //setOrders(data.orders || data); // Directly set the array to state
        const transformedOrders = (data.orders || data).map((order) => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString(), // convert timestamp to readable date
        total: `$${parseFloat(order.total_price).toFixed(2)}`,
        paymentStatus: "Unpaid",
        raw: order, // Keep the raw order if needed later
      }));

      setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } 
    };

    fetchOrders();
  }, []);

  const updatePaymentStatus = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, paymentStatus: "Paid" } : order
      )
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updatePaymentStatus(1); // Example: Automatically mark order #001 as "Paid"
    }, 5000);
    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, []);

  const updateStatus = async (newStatus, id) => {
  if (newStatus === status) return;
  
  setError('');
  
  try {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          order_status: newStatus
        }),
      });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update status');
    }

    setStatus(newStatus);
    
  } catch (err) {
    setError(err.message);
  }
};

  const filteredOrders = orders.filter((order) =>
    String(order.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Hello Staff 👋,</h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">All Orders</h2>
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
                onChange={(e) => setSortOption(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="Newest">Sort by: Newest</option>
                <option value="Oldest">Sort by: Oldest</option>
              </select>
            </div>
            {/* Add New Order Button */}
            <button
              onClick={() => router.push("/staff/addnewdrinks")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add New Order
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">INVOICE ID</th>
            <th className="p-2 border">DATE</th>
            <th className="p-2 border">ORDER STATUS</th>
            <th className="p-2 border">TOTAL</th>
            <th className="p-2 border">PAYMENT STATUS</th>
            <th className="p-2 border">VIEW DETAIL</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td className="p-2 border">{order.id}</td>
              <td className="p-2 border">{order.date}</td>
              <td className="p-2 border">
              <select 
                value={status}
                onChange={(e) => updateStatus(e.target.value, order.id)}
                className="border rounded px-3 py-2 disabled:opacity-50"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {error && <p className="text-sm text-red-600">{error}</p>}
              </td>
              <td className="p-2 border">{order.total}</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={order.paymentStatus}
                  readOnly
                  className="border-none bg-transparent text-center text-gray-700"
                />
              </td>
              <td className="p-2 border text-center">
                <PiEyesDuotone className="inline-block cursor-pointer text-2xl" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceivedOrder;