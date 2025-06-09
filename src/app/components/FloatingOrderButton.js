"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const FloatingOrderButton = () => {
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchActiveOrder = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("auth_token");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log("Orders fetched:", data);
        
        // Find the most recent order that's not completed
        if (data.orders && data.orders.length > 0) {
          const activeOrder = data.orders.find(order => 
            order.order_status === 'preparing' || order.order_status === 'ready_for_pickup'
          );
          
          if (activeOrder) {
            setActiveOrder(activeOrder);
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveOrder();
    
    // Refresh order status every 30 seconds
    const interval = setInterval(fetchActiveOrder, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleNavigateToOrderStatus = () => {
    if (activeOrder) {
      router.push(`/OrderSuc?orderId=${activeOrder.id}&status=${activeOrder.order_status}`);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready_for_pickup':
        return 'Ready';
      case 'completed':
        return 'Completed';
      default:
        return 'View Status';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'ready_for_pickup':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  // Don't show if loading, no user, no active order, or not on home page
  if (isLoading || !user || !activeOrder) {
    return null;
  }

  return (
    <button
      onClick={handleNavigateToOrderStatus}
      className={`fixed bottom-32 right-4 text-white px-4 py-3 rounded-full shadow-lg z-50 flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 ${getStatusColor(activeOrder.order_status)}`}
    >
      <div className="flex items-center space-x-2">
        {/* Status indicator */}
        <div className="flex items-center">
          {activeOrder.order_status === 'preparing' && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
          )}
          {activeOrder.order_status === 'ready_for_pickup' && (
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-semibold text-sm">
            {getStatusText(activeOrder.order_status)}
          </span>
        </div>
        
        {/* Order ID */}
        <span className="text-xs opacity-75">
          #{activeOrder.id}
        </span>
      </div>
    </button>
  );
};

export default FloatingOrderButton;