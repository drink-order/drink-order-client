"use client";
import React, { useState, useEffect } from "react";
import { PiEyesDuotone } from "react-icons/pi";

const ReadyToPickup = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the mock data or API endpoint
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/api/orders");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data.orders.filter(order => order.orderStatus === "Ready for Pickup"));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

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
              <td className="p-2 border">{order.orderStatus}</td>
              <td className="p-2 border">{order.total}</td>
              <td className="p-2 border">{order.paymentStatus}</td>
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