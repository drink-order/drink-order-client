// "use client";

// import { useState } from "react";

// const Notifications = () => {
//   const [notifData, setNotifData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const sendNotification = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("/send-notification/api/notification");
//       if (!response.ok) throw new Error("Failed to fetch notifications");

//       const data = await response.json();
//       setNotifData((prev) => [...prev, ...data]); // Add new notifications
//     } catch (error) {
//       console.error("Error fetching notifications:", error.message, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Notifications</h1>
//       <button
//         onClick={sendNotification}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         disabled={loading}
//       >
//         {loading ? "Sending..." : "Send Notification"}
//       </button>
//       <div className="mt-6 space-y-4">
//         {notifData.length === 0 ? (
//           <p>No notifications available</p>
//         ) : (
//           notifData.map((notif) => (
//             <div
//               key={notif.id}
//               className="border p-4 rounded shadow-md bg-gray-100"
//             >
//               <h2 className="font-semibold">{notif.title}</h2>
//               <p>{notif.message}</p>
//               <span className="text-sm text-gray-500">{notif.time}</span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;


import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div>
      <Link href="/send-notification/adminPage">AdminPage</Link>
      <br/>
      <Link href="/send-notification/userPage">UserPage</Link>
    </div>
  )
}
