"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaBeer, FaShoppingCart, FaBell, FaUser } from "react-icons/fa";

const NavBar = () => {
  const [activeItem, setActiveItem] = useState("Drinks");

  const menuItems = [
    { icon: <FaBeer className="w-5 h-5 mb-2 text-gray2 group-hover:text-blue-600" />, label: "Drinks", link: "/" },
    { icon: <FaShoppingCart className="w-5 h-5 mb-2 text-gray2 group-hover:text-blue-600" />, label: "Order", link: "/order" },
    { icon: <FaBell className="w-5 h-5 mb-2 text-gray2 group-hover:text-blue-600" />, label: "Notification", link: "/notification" },
    { icon: <FaUser className="w-5 h-5 mb-2 text-gray2 group-hover:text-blue-600" />, label: "Account", link: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto font-medium">
        {menuItems.map((item, idx) => (
          <Link key={idx} href={item.link}>
            <div
              className={`flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${activeItem === item.label ? 'text-blue-600' : 'text-gray2'}`}
              onClick={() => setActiveItem(item.label)}
            >
              {React.cloneElement(item.icon, { className: `w-5 h-5 mb-2 ${activeItem === item.label ? 'text-blue-600' : 'text-gray2'} group-hover:text-blue-600` })}
              <span className={`text-sm ${activeItem === item.label ? 'text-blue-600' : 'text-gray2'} group-hover:text-blue-600`}>
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;