"use client"
import React, { useState } from 'react';
import { FaClipboardCheck, FaCoffee} from 'react-icons/fa';
import { PiNotificationBold, PiHandWavingBold } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";

import ConfirmOrderPage from './ConfirmOrderPage';
import PendingPage from './PendingPage';
import CompleteOrderPage from './CompleteOrderPage';
// import Profile from './Profile';


export default function Dashboard() {

  // State to handle active page
  const [activePage, setActivePage] = useState('confirmOrder'); // Default to 'confirmOrder'

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
        setOrders((prevOrders) => ({
          ...prevOrders,
          [from]: prevOrders[from].filter((order) => order.id !== id),
          [to]: [orderToMove, ...prevOrders[to]],
        }));
      };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="min-h-screen w-60 bg-gray-100 shadow-lg flex flex-col fixed">
        {/* Logo Section */}
        <div className="p-4">
        <h1 className="ml-2 text-lg text-black font-bold flex justify-left">
          <span className="mr-2 p-1"><FaCoffee/></span>
        NAME SHOP</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <button
                onClick={() => setActivePage('confirmOrder')}
                className={`w-full flex items-center px-3 py-2 rounded-md ${activePage === 'confirmOrder' ? 'text-white bg-yellow-400' : 'text-gray-700 hover:text-white hover:bg-yellow-400'}`}
              >
                <span className="mr-2"><PiNotificationBold /></span> Confirm Order
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('pending')}
                className={`w-full flex items-center px-3 py-2 rounded-md ${activePage === 'pending' ? 'text-white bg-yellow-400' : 'text-gray-700 hover:text-white hover:bg-yellow-400'}`}
              >
                <span className="mr-2"><GiSandsOfTime /></span> Pending
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('completeOrder')}
                className={`w-full flex items-center px-3 py-2 rounded-md ${activePage === 'completeOrder' ? 'text-white bg-yellow-400' : 'text-gray-700 hover:text-white hover:bg-yellow-400'}`}
              >
                <span className="mr-2"><FaClipboardCheck /></span> Complete Order
              </button>
            </li>
          </ul>
        </div>

        {/* Profile Section */}
      <button
        onClick={() => setActivePage('profile')} 
        className={`p-4 flex items-center space-x-3 w-full text-left 
        ${activePage === 'profile' ? 'bg-yellow-400 text-white' : 'hover:bg-yellow-400 hover:text-white text-gray-700'}`}
      >
        <img
          src="./chillguy.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-bold">Admin</p>
          <p className="text-sm">Project Manager</p>
        </div>
      </button>
    </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-4 ml-60 min-h-screen">
        <h1 className="text-lg text-black flex item-center">Hello Admin <span className="ml-2 p-1"><PiHandWavingBold /></span>,</h1>

          {activePage === "confirmOrder" && (
            <ConfirmOrderPage
              orders={orders.confirm}
               moveToPending={(id) => moveOrder(id, "confirm", "pending")}
            />
          )}
          {activePage === "pending" && (
            <PendingPage
              orders={orders.pending}
              moveToCompleted={(id) => moveOrder(id, "pending", "completed")}
            />
          )}
          {activePage === "completeOrder" && (<CompleteOrderPage orders={orders.completed} />)}
          {/* {activePage === 'profile' && <Profile />} */}
      </div>
    </div>
  );
}