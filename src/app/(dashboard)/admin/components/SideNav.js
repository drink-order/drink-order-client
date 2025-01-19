"use client";
import React from "react";
import Link from "next/link"; // Import next/link for routing
import { FaCoffee } from "react-icons/fa";
import { PiNotificationBold } from "react-icons/pi";

export default function SideNav() {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="min-h-screen w-64 bg-gray-100 shadow-lg flex flex-col fixed">
        <div className="p-4">
          <h1 className="ml-2 text-lg text-black font-bold flex justify-left">
            <span className="mr-2 p-1">
              <FaCoffee />
            </span>
            Welcome Admin
          </h1>
        </div>
        <div className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <Link
                href="/admin" // Use Next.js Link with href
                className="w-full flex items-center px-3 py-2 rounded-md bg-yellow-400 text-white"
              >
                <span className="mr-2">
                  <PiNotificationBold />
                </span>
                Category Management
              </Link>
            </li>
          </ul>
        </div>
        <Link
          href="/account" // Use Next.js Link with href
          className="p-4 flex items-center space-x-3 w-full text-left text-gray-700 hover:text-white hover:bg-yellow-400"
        >
          <img src="./chillguy.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">Admin</p>
            <p className="text-sm">Project Manager</p>
          </div>
        </Link>
      </div>
    </div>
  );
}