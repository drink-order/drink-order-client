// "use client";
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaClipboardCheck, FaCoffee } from "react-icons/fa";
// import { PiNotificationBold, PiHandWavingBold } from "react-icons/pi";
// import { GiSandsOfTime } from "react-icons/gi";

// export default function Sidebar() {
//   // const [orders, setOrders] = useState({
//   //   confirm: [],
//   //   pending: [],
//   //   completed: [],
//   // });

//   const [activeButton, setActiveButton] = useState("confirm");

//   const handleButtonClick = (button) => {
//     setActiveButton(button);
//   };

//   return (
//       <div className="flex h-full">
//         {/* Sidebar */}
//         <div className="min-h-screen w-60 bg-gray-100 shadow-lg flex flex-col fixed">
//           <div className="p-4">
//             <h1 className="ml-2 text-lg text-black font-bold flex justify-left">
//               <span className="mr-2 p-1">
//                 <FaCoffee />
//               </span>
//               NAME SHOP
//             </h1>
//           </div>
//           <div className="flex-grow">
//             <ul className="space-y-2 p-4">
//               <li>
//                 <Link
//                   to="/confirm"
//                   className={`w-full flex items-center px-3 py-2 rounded-md ${
//                     activeButton === "confirm" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
//                   }`}
//                   onClick={() => handleButtonClick("confirm")}
//                 >
//                   <span className="mr-2">
//                     <PiNotificationBold />
//                   </span>
//                   Confirm Order
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/pending"
//                   className={`w-full flex items-center px-3 py-2 rounded-md ${
//                     activeButton === "pending" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
//                   }`}
//                   onClick={() => handleButtonClick("pending")}
//                 >
//                   <span className="mr-2">
//                     <GiSandsOfTime />
//                   </span>
//                   Pending
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/complete"
//                   className={`w-full flex items-center px-3 py-2 rounded-md ${
//                     activeButton === "completed" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
//                   }`}
//                   onClick={() => handleButtonClick("complete")}
//                 >
//                   <span className="mr-2">
//                     <FaClipboardCheck />
//                   </span>
//                   Complete Order
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <Link
//             to="profile"
//             className={`p-4 flex items-center space-x-3 w-full text-left ${
//               activeButton === "profile" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
//             }`}
//             onClick={() => handleButtonClick("profile")}
//           >
//             <img src="./chillguy.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
//             <div>
//               <p className="font-bold">Admin</p>
//               <p className="text-sm">Project Manager</p>
//             </div>
//           </Link>
//         </div>

//         {/* Main Content */}
//         <div className="flex-grow bg-gray-100 p-4 ml-60 min-h-screen">
//           <h1 className="text-lg text-black flex item-center">
//             Hello Admin{" "}
//             <span className="ml-2 p-1">
//               <PiHandWavingBold />
//             </span>
//             ,
//           </h1>
//         </div>
//       </div>
//   );
// }


"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import next/link for routing
import { FaClipboardCheck, FaCoffee } from "react-icons/fa";
import { PiNotificationBold, PiHandWavingBold } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";

export default function Sidebar() {
  const [activeButton, setActiveButton] = useState("confirm");

      // const [orders, setOrders] = useState({
      //   confirm: [
      //     { id: "#001", date: "26/11/24:5:02", total: "5.50$" },
      //     { id: "#002", date: "26/11/24:4:34", total: "4.99$" },
      //   ],
      //   pending: [],
      //   completed: [],
      // });

      // const moveOrder = (id, from, to) => {
      //   const orderToMove = orders[from].find((order) => order.id === id);
      //   setOrders((prevOrders) => ({
      //     ...prevOrders,
      //     [from]: prevOrders[from].filter((order) => order.id !== id),
      //     [to]: [orderToMove, ...prevOrders[to]],
      //   }));
      // };
  

  const handleButtonClick = (button) => {
    setActiveButton(button);
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
            NAME SHOP
          </h1>
        </div>
        <div className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <Link
                href="/staff" // Use Next.js Link with href
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeButton === "confirm" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
                }`}
                onClick={() => handleButtonClick("confirm")}
              >
                <span className="mr-2">
                  <PiNotificationBold />
                </span>
                New Order
              </Link>
            </li>
            <li>
              <Link
                href="/staff/pending" // Use Next.js Link with href
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeButton === "pending" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
                }`}
                onClick={() => handleButtonClick("pending")}
              >
                <span className="mr-2">
                  <GiSandsOfTime />
                </span>
                Ready for Pickup
              </Link>
            </li>
            <li>
              <Link
                href="/staff/complete" // Use Next.js Link with href
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeButton === "completed" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
                }`}
                onClick={() => handleButtonClick("completed")}
              >
                <span className="mr-2">
                  <FaClipboardCheck />
                </span>
                Completed
              </Link>
            </li>
          </ul>
        </div>
        <Link
          href="/staff/profile" // Use Next.js Link with href
          className={`p-4 flex items-center space-x-3 w-full text-left ${
            activeButton === "profile" ? "bg-yellow-400 text-white" : "text-gray-700 hover:text-white hover:bg-yellow-400"
          }`}
          onClick={() => handleButtonClick("profile")}
        >
          <img src="./chillguy.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">Admin</p>
            <p className="text-sm">Project Manager</p>
          </div>
        </Link>
      </div>

      {/* Main Content
      <div className="flex-grow bg-gray-100 p-4 ml-60 min-h-screen">
        <h1 className="text-lg text-black flex item-center">
          Hello Admin{" "}
          <span className="ml-2 p-1">
            <PiHandWavingBold />
          </span>
          ,
        </h1>
      </div> */}
    </div>
  );
}
