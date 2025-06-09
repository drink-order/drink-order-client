"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBeer, FaShoppingCart, FaBell, FaUser } from "react-icons/fa";

const NavBar = () => {
  const pathname = usePathname();

  const menuItems = [
    { 
      icon: FaBeer, 
      label: "Drinks", 
      link: "/",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: FaShoppingCart, 
      label: "Order", 
      link: "/order",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: FaBell, 
      label: "Notifications", 
      link: "/notification",
      color: "from-yellow-500 to-yellow-600"
    },
    { 
      icon: FaUser, 
      label: "Account", 
      link: "/account",
      color: "from-purple-500 to-purple-600"
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Clean background without blur */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto relative">
          {/* Simple active indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500"></div>
          
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.link;
            const Icon = item.icon;
            
            return (
              <Link key={idx} href={item.link} className="flex-1">
                <div className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 group relative ${
                  isActive ? 'transform -translate-y-1' : 'hover:transform hover:-translate-y-0.5'
                }`}>
                  {/* Simple active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`relative p-2 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-yellow-500 shadow-md' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-600 group-hover:text-gray-800'
                    }`} />
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                    isActive 
                      ? 'text-gray-800 font-bold' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Bottom safe area */}
        <div className="h-safe-area-inset-bottom bg-white"></div>
      </div>
    </div>
  );
};

export default NavBar;