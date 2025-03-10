"use client";
import React, { useState } from "react";
import { FaClipboardCheck, FaCoffee } from "react-icons/fa";
import { PiHandWavingBold } from "react-icons/pi";
import CategoryList from './components/CategoryList';
import AccountManagement from './components/AccountManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("accounts");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="min-h-screen w-60 bg-gray-100 shadow-lg flex flex-col fixed">
        <div className="p-4">
          <h1 className="ml-2 text-lg text-black font-bold flex justify-left">
            <span className="mr-2 p-1">
              <FaCoffee />
            </span>
            ADMIN DASHBOARD
          </h1>
        </div>
        <div className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <button
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeTab === "accounts" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
                }`}
                onClick={() => handleTabChange("accounts")}
              >
                <span className="mr-2">
                  <FaClipboardCheck />
                </span>
                Account Management
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeTab === "categories" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
                }`}
                onClick={() => handleTabChange("categories")}
              >
                <span className="mr-2">
                  <FaClipboardCheck />
                </span>
                Categories
              </button>
            </li>
          </ul>
        </div>
        <button
          className={`p-4 flex items-center space-x-3 w-full text-left ${
            activeTab === "profile" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
          }`}
          onClick={() => handleTabChange("profile")}
        >
          <img src="./chillguy.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">Admin</p>
            <p className="text-sm">Project Manager</p>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-4 ml-60 min-h-screen">
        <h1 className="text-lg text-black flex items-center">
          Hello Admin{" "}
          <span className="ml-2 p-1">
            <PiHandWavingBold />
          </span>
          ,
        </h1>
        <div className="mt-4">
          {activeTab === "accounts" && <div><AccountManagement /></div>}
          {activeTab === "categories" && <div><CategoryList /></div>}
          {activeTab === "profile" && <div>Profile Content</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;