"use client";
import React, { useState } from "react";
import Link from "next/link";
import { PiEyesDuotone } from "react-icons/pi";

const ConfirmOrderPage = () => {
  const [orders, setOrders] = useState({
    confirm: [
      { id: "#001", date: "26/11/24:5:02", total: "5.50$" },
      { id: "#002", date: "26/11/24:4:34", total: "4.99$" },
    ],
    pending: [],
    completed: [],
  });

  const moveOrder = (id, from, to) => {
    const orderToMove = orders[from].find((order) => order.id === id);

    if (orderToMove) {
      setOrders((prevOrders) => ({
        ...prevOrders,
        [from]: prevOrders[from].filter((order) => order.id !== id),
        [to]: [orderToMove, ...prevOrders[to]],
      }));
    }
  };

  return (
    
    <div className="p-4">
      <h1 className="p-4 text-2xl text-black font-bold mb-4">All Customers</h1>
      <div className="flex justify-end mb-4">
        <Link
          href="/staff/addnewdrinks"
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Add New Order
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-200 text-black text-center bg-white">
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
          {orders.confirm.length === 0 ? (
            <tr>
              <td className="p-4 text-gray-500" colSpan="7">
                No orders available
              </td>
            </tr>
          ) : (
            orders.confirm.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.date}</td>
                <td className="p-2 border">New order</td>
                <td className="p-2 border">{order.total}</td>
                <td className="p-2 border">Unpaid</td>
                <td className="p-2 border text-center">
                  <PiEyesDuotone className="inline-block cursor-pointer text-2xl" />
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => moveOrder(order.id, "confirm", "pending")}
                    className="bg-yellow-400 text-white hover:bg-yellow-500 border px-4 py-1 rounded"
                  >
                    Confirm
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

export default ConfirmOrderPage;


