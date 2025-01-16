import React from "react";

const order = ({ onClick }) => {
  return (
    <div className="max-w-md mx-auto p-2 border border-gray-300 rounded-lg bg-white shadow-md mb-2">
      {/* Title */}
      <h3 className="text-lg font-semibold flex justify-between items-center">Notification</h3>
     <div
      className="max-w-md mx-auto p-2 border border-gray-300 rounded-lg bg-white shadow-md mb-3 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="bg-orange-500 w-8 h-8 flex items-center justify-center rounded-full text-white">
            {/* Replace with an icon if needed */}
            <span className="text-lg font-bold">#</span>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Order Completed
          </h3>
          <p className="text-sm text-gray-600">
            Your order is ready to pick up
          </p>
          <p className="text-xs text-gray-400 mt-2">2024-12-27 13:02</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default order;
