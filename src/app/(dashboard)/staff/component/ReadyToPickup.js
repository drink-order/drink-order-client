"use client";
import React, { useState, useEffect } from "react";
import { PiEyesDuotone } from "react-icons/pi";

const ReadyToPickup = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("ready_for_pickup");
  const [error, setError] = useState("");

  const statusOptions = [
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'completed', label: 'Completed' }
  ];

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/orders?status=ready_for_pickup`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        }
      );
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You are not authorized to view this page");
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      console.log("Fetched orders:", data);

      // Filter and transform orders in one step
      const transformedOrders = (data.orders || data)
        .filter((order) => order.order_status === "ready_for_pickup")
        .map((order) => ({
          id: order.id,
          date: new Date(order.created_at).toLocaleDateString(),
          orderStatus: order.order_status,
          total: `$${parseFloat(order.total_price).toFixed(2)}`,
          paymentStatus: "Unpaid",
          raw: order,
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
      updatePaymentStatus("#001"); // Example: Automatically mark order #001 as "Paid"
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-black mb-4">Ready to Pickup Orders</h2>
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
          {orders.map((order) => (
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
              {/* <td className="p-2 border">{order.paymentStatus}</td> */}
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

export default ReadyToPickup;