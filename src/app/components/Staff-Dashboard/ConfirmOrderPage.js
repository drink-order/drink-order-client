"use client"
import React from "react";
import { PiEyesDuotone } from "react-icons/pi";

export default function ConfirmOrderPage({ orders, moveToPending }) {


  // Function to add a new order
  // const addNewOrder = () => {
  //   const newOrder = {
  //     id: `#${String(orders.length + 1).padStart(3, "0")}`, // Auto-increment ID
  //     date: new Date().toLocaleDateString(), // Current date
  //     total: "3.99$", // Placeholder total
  //   };
  //   setOrders([newOrder, ...orders]); // Add new order to the top
  // };

  return (
    <div className="p-4">
      <h1 className="p-4 text-2xl text-black font-bold mb-4">All Customers</h1>
      <div className="flex justify-end mb-4">
        <button
          //onClick={addNewOrder}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Add New Order
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-200 text-black text-center bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">INVOICE ID</th>
            <th className="p-2 border">DATE</th>
            <th className="p-2 border">STATUS</th>
            <th className="p-2 border">TOTAL</th>
            <th className="p-2 border">PAYMENT STATUS</th>
            <th className="p-2 border">VIEW</th>
            <th className="p-2 border">DETAIL</th>
          </tr>
        </thead>
        <tbody>
          {!orders || orders.length === 0 ? (
            <tr>
            <td className="p-4 text-gray-500" colSpan="7">
              No order available
            </td>
          </tr>
        ) : (
           orders.map((order) => (
            <tr key={order.id}>
              <td className="p-2 border">{order.id}</td>
              <td className="p-2 border">{order.date}</td>
              <td className="p-2 border">New order</td>
              <td className="p-2 border">{order.total}</td>
              <td className="p-2 border">Unpaid</td>
              <td className="p-2 border text-center">
                <PiEyesDuotone className="inline-block cursor-pointer text-2xl" />
              </td>
              <td className="p-2 border">
                <button 
                  onClick={() => moveToPending(order.id)}
                  className="bg-yellow-400 text-white hover:bg-yellow-500 hover:text-white border px-4 py-1 rounded">
                  Confirm
                </button>
              </td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}


// import React from 'react';

// const ConfirmOrderPage = ({ orders }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full table-auto">
//         <thead>
//           <tr>
//             <th className="px-4 py-2">Order ID</th>
//             <th className="px-4 py-2">Customer</th>
//             <th className="px-4 py-2">Date</th>
//             <th className="px-4 py-2">Status</th>
//             <th className="px-4 py-2">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders && orders.length > 0 ? (
//             orders.map((order, index) => (
//               <tr key={index} className="border-b">
//                 <td className="px-4 py-2">{order.id}</td>
//                 <td className="px-4 py-2">{order.customer}</td>
//                 <td className="px-4 py-2">{order.date}</td>
//                 <td className="px-4 py-2">{order.status}</td>
//                 <td className="px-4 py-2">{order.total}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td className="p-4 text-gray-500" colSpan="5">
//                 No orders available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ConfirmOrderPage;
