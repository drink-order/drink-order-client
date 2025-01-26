"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const FloatingOrderButton = () => {
  const { data: session } = useSession();
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch order details");

        const data = await response.json();
        if (!data.orderId) {
          console.log("No active order found");
          setIsLoading(false);
          return;
        }

        setOrderId(data.orderId);

        // Fetch the order status from the API
        const fetchOrderStatus = async () => {
          try {
            console.log("Fetching order status...");
            const response = await fetch(`/api/orders?orderId=${data.orderId}`);
            if (!response.ok) {
              throw new Error("Failed to fetch order status");
            }
            const statusData = await response.json();
            console.log("Order status fetched:", statusData);
            setOrderStatus(statusData.status);
          } catch (error) {
            console.error("Error fetching order status:", error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchOrderStatus();
      } catch (error) {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [session]);

  const handleNavigateToOrderSuc = () => {
    router.push(`/OrderSuc?orderId=${orderId}`);
  };

  // Show the button only on the home page and if the order status is not 'PickedUp'
  if (isLoading || !orderId || orderStatus === "PickedUp" || currentPath !== "/") {
    return null;
  }

  return (
    <button
      onClick={handleNavigateToOrderSuc}
      aria-label="View Order Status"
      className="fixed bottom-32 right-8 bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700 z-50"
    >
      View Status
    </button>
  );
};

export default FloatingOrderButton;