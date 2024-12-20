// import React from "react";
// import { PiEyesDuotone } from "react-icons/pi";

// export default function PendingPage({ orders, moveToCompleted }) {

//   return (
//     <div className="p-4">
//       <h1 className="p-4 text-2xl text-black font-bold mb-4">All Customers</h1>
//       <table className="w-full border-collapse border border-gray-200 text-black text-center">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2 border">INVOICE ID</th>
//             <th className="p-2 border">DATE</th>
//             <th className="p-2 border">STATUS</th>
//             <th className="p-2 border">TOTAL</th>
//             <th className="p-2 border">PAYMENT STATUS</th> 
//             <th className="p-2 border">VIEW</th>
//             <th className="p-2 border">DETAIL</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.length === 0 ? (
//             <tr>
//             <td className="p-4 text-gray-500" colSpan="7">
//               No order available
//             </td>
//           </tr>
//           ) : (
//             orders.map((order) => (
//             <tr key={order.id}>
//               <td className="p-2 border">{order.id}</td>
//               <td className="p-2 border">{order.date}</td>
//               <td className="p-2 border">Preparing</td>
//               <td className="p-2 border">{order.total}</td>
//               <td className="p-2 border">Unpaid</td>
//               <td className="p-2 border text-center">
//                 <PiEyesDuotone className="inline-block cursor-pointer text-2xl" />
//               </td>
//               <td className="p-2 border">
//                 <button 
//                   onClick={() => moveToCompleted(order.id)}
//                   className="bg-yellow-400 text-white hover:bg-yellow-500 hover:text-white border px-4 py-1 rounded">
//                   Ready
//                 </button>
//               </td>
//             </tr>
//           )))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React from "react";
import { PiEyesDuotone } from "react-icons/pi";

const PendingPage = ({ orders, moveToCompleted }) => {
  const renderTableRows = () => {
    if (!orders || orders.length === 0) {
      return (
        <tr>
          <td className="p-4 text-gray-500" colSpan="7">
            No orders available
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <tr key={order.id}>
        <td className="p-2 border">{order.id}</td>
        <td className="p-2 border">{order.date}</td>
        <td className="p-2 border">Preparing</td>
        <td className="p-2 border">{order.total}</td>
        <td className="p-2 border">Unpaid</td>
        <td className="p-2 border text-center">
          <PiEyesDuotone className="inline-block cursor-pointer text-2xl" />
        </td>
        <td className="p-2 border">
          <button
            onClick={() => moveToCompleted(order.id)}
            className="bg-yellow-400 text-white hover:bg-yellow-500 px-4 py-1 rounded"
          >
            Ready
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4">
      <h1 className="p-4 text-2xl text-black font-bold mb-4">All Customers</h1>
      <table className="w-full border-collapse border border-gray-200 text-black text-center">
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
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
};

export default PendingPage;
