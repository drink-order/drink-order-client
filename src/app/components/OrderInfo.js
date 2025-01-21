"use client";
import React from "react";

const OrderInfo = () => {
  const orderDetails = {
    orderNo: "78725191612-47187021",
    orderTime: "2024-12-27 12:45:32",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetails.orderNo);
    alert("Order number copied to clipboard!");
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-5">Order Information</h3>

      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">Order No.</span>
        <div className="flex items-center">
          <span className="text-gray-700">{orderDetails.orderNo}</span>
          <button
            onClick={handleCopy}
            className="ml-3 px-2 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
          >
            COPY
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium">Order Time</span>
        <span className="text-gray-700">{orderDetails.orderTime}</span>
      </div>
    </div>
  );
};

export default OrderInfo;
