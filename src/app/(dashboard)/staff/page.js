"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FaClipboardCheck, FaCoffee, FaUser } from "react-icons/fa";
import { PiNotificationBold, PiHandWavingBold } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import ReceivedOrder from "./component/ReceivedOrder";
import ReadyToPickup from "./component/ReadyToPickup";
import Completed from "./component/Completed";
import Profile from "../../components/UserProfile";
import SignOutButton from "../../components/Signout";

export default function StaffDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("received");

  // Authentication and role check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
      return;
    }

    if (user && user.role !== "staff") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "shopOwner") {
        router.push("/shop-owner");
      } else {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user or wrong role
  if (!user || user.role !== "staff") {
    return null;
  }

  const userName = user?.username || user?.name || "Staff";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="min-h-screen w-60 bg-white shadow-lg flex flex-col fixed z-10">
        <div className="p-4 border-b border-gray-200">
          <h1 className="ml-2 text-lg text-black font-bold flex items-center">
            <span className="mr-2 p-1">
              <FaCoffee className="text-yellow-500" />
            </span>
            COFFEE SHOP
          </h1>
          <p className="text-sm text-gray-500 ml-9">Staff Dashboard</p>
        </div>
        
        <div className="flex-grow">
          <nav className="mt-4">
            <ul className="space-y-2 px-4">
              <li>
                <button
                  className={`w-full flex items-center px-3 py-3 rounded-md text-left transition-colors duration-200 ${
                    activeTab === "received"
                      ? "bg-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-white hover:bg-yellow-400"
                  }`}
                  onClick={() => handleTabChange("received")}
                >
                  <span className="mr-3">
                    <PiNotificationBold className="w-5 h-5" />
                  </span>
                  Preparing Orders
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-3 py-3 rounded-md text-left transition-colors duration-200 ${
                    activeTab === "ready"
                      ? "bg-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-white hover:bg-yellow-400"
                  }`}
                  onClick={() => handleTabChange("ready")}
                >
                  <span className="mr-3">
                    <GiSandsOfTime className="w-5 h-5" />
                  </span>
                  Ready for Pickup
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-3 py-3 rounded-md text-left transition-colors duration-200 ${
                    activeTab === "completed"
                      ? "bg-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-white hover:bg-yellow-400"
                  }`}
                  onClick={() => handleTabChange("completed")}
                >
                  <span className="mr-3">
                    <FaClipboardCheck className="w-5 h-5" />
                  </span>
                  Completed Orders
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-colors duration-200 ${
              activeTab === "profile"
                ? "bg-yellow-400 text-white shadow-md"
                : "text-gray-700 hover:text-white hover:bg-yellow-400"
            }`}
            onClick={() => handleTabChange("profile")}
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <FaUser className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{userName}</p>
              <p className="text-sm opacity-75">Staff Member</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-60 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <h1 className="text-xl text-black flex items-center">
            Hello, {userName}
            <span className="ml-2 p-1">
              <PiHandWavingBold className="text-yellow-500" />
            </span>
            !
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {activeTab === "received" && "Manage orders that are currently being prepared"}
            {activeTab === "ready" && "Handle orders ready for customer pickup"}
            {activeTab === "completed" && "View completed order history and generate receipts"}
            {activeTab === "profile" && "Manage your profile settings and account information"}
          </p>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          <Suspense fallback={
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading...</p>
            </div>
          }>
            {activeTab === "received" && <ReceivedOrder />}
            {activeTab === "ready" && <ReadyToPickup />}
            {activeTab === "completed" && <Completed />}
            {activeTab === "profile" && (
              <div className="p-4">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6 text-black">Profile Settings</h2>
                    <Profile />
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}