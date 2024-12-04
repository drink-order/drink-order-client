import React from "react";
import { FaHome, FaWallet, FaCog, FaUser } from "react-icons/fa"; // Import React Icons

const NavBar = () => {
  const menuItems = [
    { icon: <FaHome className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />, label: "Home", link: "/" },
    { icon: <FaWallet className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />, label: "Wallet", link: "/wallet" },
    { icon: <FaCog className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />, label: "Settings", link: "/settings" },
    { icon: <FaUser className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />, label: "Profile", link: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {menuItems.map((item, idx) => (
          <button key={idx} type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <a href={item.link} className="text-center">
              {item.icon}
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                {item.label}
              </span>
            </a>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
