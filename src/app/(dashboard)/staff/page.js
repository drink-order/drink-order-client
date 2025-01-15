"use client";
import React, { useState, useEffect } from "react";
import { PiEyesDuotone } from "react-icons/pi";
import { HiSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";

const ConfirmOrderPage = () => {
  const router = useRouter();

  // Initial orders with default payment status "Unpaid"
  const [orders, setOrders] = useState([
    { id: "#001", date: "26/11/24", total: "4.99$", orderStatus: "Preparing", paymentStatus: "Unpaid" },
    { id: "#002", date: "26/11/24", total: "5.50$", orderStatus: "Preparing", paymentStatus: "Unpaid" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Newest");

  // Simulate a trigger that updates the payment status to "Paid"
  const updatePaymentStatus = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, paymentStatus: "Paid" } : order
      )
    );
  };

  // Example: Automatically mark payment status as "Paid" for an order after 5 seconds (simulate API call or external logic)
  useEffect(() => {
    const timeout = setTimeout(() => {
      updatePaymentStatus("#001"); // Example: Automatically mark order #001 as "Paid"
    }, 5000);
    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, []);

  const handleOrderStatusChange = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                  value={order.orderStatus}
                  onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Preparing">Preparing</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Picked Up">Picked Up</option>
                </select>
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

export default ConfirmOrderPage;
