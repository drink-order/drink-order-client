"use client";
import React, { useState } from "react";
import NotificationCompo from "../components/NotificationCompo";
import OrderSummary from "../components/OrderSummary";
import OrderInfo from "../components/OrderInfo";

const Page = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleNotificationClick = () => {
    setShowDetails(true); // Show OrderSummary and OrderInfo when clicked
  };

  return (
    <div className="p-4">
      {!showDetails ? (
        // Show NotificationCompo if details are not visible
        <NotificationCompo onClick={handleNotificationClick} />
      ) : (
        // Show OrderSummary and OrderInfo if details are visible
        <div>
          <OrderSummary />
          <OrderInfo />
        </div>
      )}
    </div>
  );
};

export default Page;