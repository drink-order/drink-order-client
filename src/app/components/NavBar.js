import React from "react";
import { FaHome, FaWallet, FaCog, FaUser } from "react-icons/fa";

const NavBar = () => {
  const menuItems = [
    { icon: <FaHome className="w-5 h-5 mb-2 text-gray2  group-hover:text-blue-600" />, label: "Home", link: "/" },
    { icon: <FaWallet className="w-5 h-5 mb-2 text-gray2 group-hover:text-blue-600" />, label: "Wallet", link: "/wallet" },
    { icon: <FaCog className="w-5 h-5 mb-2 text-gray2 group-hover:text-blue-600" />, label: "Settings", link: "/settings" },
    { icon: <FaUser className="w-5 h-5 mb-2 text-gray2 group-hover:text-blue-600" />, label: "Profile", link: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {menuItems.map((item, idx) => (
          <a key={idx} href={item.link} className="flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
            {item.icon}
            <span className="text-sm text-gray group-hover:text-blue-600">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
