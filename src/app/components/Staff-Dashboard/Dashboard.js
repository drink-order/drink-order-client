"use client";
import React, { useState } from "react";
import { FaClipboardCheck, FaCoffee, FaEdit } from "react-icons/fa";
import { PiNotificationBold, PiHandWavingBold } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";

export default function Dashboard() {
  // State to handle active page
  const [activePage, setActivePage] = useState("user account");

  // Sample table data
  const [tab, setTab] = useState({
    "user account": [
      { id: "#001", role: "Shop Owner", total: "4.99$", createdAt: "26/11/24, 8:30AM" },
      { id: "#002", role: "Shop Owner", total: "5.50$", createdAt: "26/11/24, 8:45AM" },
    ],
    "shop site": [],
  });

  // Get data for the current active page
  const activeData = tab[activePage];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="min-h-screen w-60 bg-gray-100 shadow-lg flex flex-col fixed">
        {/* Logo Section */}
        <div className="p-4">
          <h1 className="ml-2 text-lg text-black font-bold flex justify-left">
            <span className="mr-2 p-1">
              <FaCoffee />
            </span>
            Admin
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <button
                onClick={() => setActivePage("user account")}
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activePage === "user account"
                    ? "text-white bg-yellow-400"
                    : "text-gray-700 hover:text-white hover:bg-yellow-400"
                }`}
              >
                <span className="mr-2">
                  <PiNotificationBold />
                </span>
                User Account
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("shop site")}
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activePage === "shop site"
                    ? "text-white bg-yellow-400"
                    : "text-gray-700 hover:text-white hover:bg-yellow-400"
                }`}
              >
                <span className="mr-2">
                  <GiSandsOfTime />
                </span>
                Shop Site
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-4 ml-60 min-h-screen">
        <h1 className="text-lg text-black flex items-center">
          Hello Admin{" "}
          <span className="ml-2 p-1">
            <PiHandWavingBold />
          </span>
        </h1>

        {/* Table */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{activePage === "user account" ? "All Customers" : "Shop Site"}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="px-4 py-2 text-left">Invoid ID</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Edit</th>
              </tr>
            </thead>
            <tbody>
              {activeData.length > 0 ? (
                activeData.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.role}</td>
                    <td className="px-4 py-3">{item.total}</td>
                    <td className="px-4 py-3">{item.createdAt}</td>
                    <td className="px-4 py-3">
                      <button className="text-yellow-400 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
