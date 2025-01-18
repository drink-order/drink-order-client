"use client";
import React, { useState, useEffect } from "react";
import { PiEyesDuotone } from "react-icons/pi";

const PendingPage = () => {
  const [orders, setOrders] = useState({ pending: [] });

  useEffect(() => {
    // Fetch orders from the mock data or API endpoint
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/api/orders");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const moveOrder = (id, fromStatus, toStatus) => {
    setOrders((prevOrders) => {
      const orderToMove = prevOrders[fromStatus].find((order) => order.id === id);
      if (!orderToMove) return prevOrders;

      return {
        ...prevOrders,
        [fromStatus]: prevOrders[fromStatus].filter((order) => order.id !== id),
        [toStatus]: [...prevOrders[toStatus], orderToMove],
      };
    });
  };

  const moveToCompleted = (id) => {
    moveOrder(id, 'pending', 'completed');
  };

  return (
    <div className="p-4">
      <h1 className="p-4 text-2xl text-black font-bold mb-4">All Customers</h1>
      <table className="w-full border-collapse border border-gray-200 text-black text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">INVOICE ID</th>
            <th className="p-2 border">DATE</th>
            <th className="p-2 border">STATUS</th>
            <th className="p-2 border">TOTAL</th>
            <th className="p-2 border">PAYMENT STATUS</th>
            <th className="p-2 border">VIEW</th>
            <th className="p-2 border">DETAIL</th>
          </tr>
        </thead>
        <tbody>
          {(!orders || orders.pending.length === 0) ? (
            <tr>
              <td className="p-4 text-gray-500" colSpan="7">
                No orders available
              </td>
            </tr>
          ) : (
            orders.pending.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.date}</td>
                <td className="p-2 border">Preparing</td>
                <td className="p-2 border">{order.total}</td>
                <td className="p-2 border">{order.paymentStatus}</td>
                <td className="p-2 border text-center">
                  <PiEyesDuotone className="inline-block cursor-pointer text-2xl" />
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => moveToCompleted(order.id)}
                    className="bg-yellow-400 text-white hover:bg-yellow-500 px-4 py-1 rounded"
                  >
                    Ready
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingPage;