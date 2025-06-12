"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const FloatingOrderButton = () => {
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickStart, setClickStart] = useState({ x: 0, y: 0 });
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const buttonRef = useRef(null);
  const router = useRouter();

  // Initialize position from localStorage or default
  useEffect(() => {
    const savedPosition = localStorage.getItem('floatingOrderButtonPosition');
    if (savedPosition) {
      const parsed = JSON.parse(savedPosition);
      setPosition(parsed);
    } else {
      // Default position (bottom-right)
      setPosition({ x: window.innerWidth - 120, y: window.innerHeight - 160 });
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (position.x !== null && position.y !== null) {
      localStorage.setItem('floatingOrderButtonPosition', JSON.stringify(position));
    }
  }, [position]);

  // Constrain position to viewport
  const constrainPosition = (x, y) => {
    const buttonWidth = 100; // Approximate button width
    const buttonHeight = 50; // Approximate button height
    const margin = 10;

    const maxX = window.innerWidth - buttonWidth - margin;
    const maxY = window.innerHeight - buttonHeight - margin;

    return {
      x: Math.max(margin, Math.min(x, maxX)),
      y: Math.max(margin, Math.min(y, maxY))
    };
  };

  // Handle window resize to keep button in bounds
  useEffect(() => {
    const handleResize = () => {
      if (position.x !== null && position.y !== null) {
        const constrained = constrainPosition(position.x, position.y);
        if (constrained.x !== position.x || constrained.y !== position.y) {
          setPosition(constrained);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setHasBeenDragged(false);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    setDragStart({ x: startX, y: startY });
    setClickStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Check if this is actual dragging (moved more than 5 pixels)
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - clickStart.x, 2) + Math.pow(e.clientY - clickStart.y, 2)
    );
    
    if (dragDistance > 5) {
      setHasBeenDragged(true);
    }
    
    const constrained = constrainPosition(newX, newY);
    setPosition(constrained);
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      
      // If it was just a click (not a drag), navigate to order status
      if (!hasBeenDragged) {
        handleNavigateToOrderStatus();
      }
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setHasBeenDragged(false);
    const startX = touch.clientX - position.x;
    const startY = touch.clientY - position.y;
    setDragStart({ x: startX, y: startY });
    setClickStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Check if this is actual dragging
    const dragDistance = Math.sqrt(
      Math.pow(touch.clientX - clickStart.x, 2) + Math.pow(touch.clientY - clickStart.y, 2)
    );
    
    if (dragDistance > 5) {
      setHasBeenDragged(true);
    }
    
    const constrained = constrainPosition(newX, newY);
    setPosition(constrained);
  };

  const handleTouchEnd = (e) => {
    if (isDragging) {
      setIsDragging(false);
      
      // If it was just a tap (not a drag), navigate to order status
      if (!hasBeenDragged) {
        handleNavigateToOrderStatus();
      }
    }
  };

  // Add global event listeners for mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart, position, hasBeenDragged]);

  // Your existing order fetching logic
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
    if (activeOrder && !hasBeenDragged) {
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

  // Don't show if loading, no user, no active order, or position not set
  if (isLoading || !user || !activeOrder || position.x === null) {
    return null;
  }

  return (
    <div
      ref={buttonRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className={`text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 ${
          getStatusColor(activeOrder.order_status)
        } ${isDragging ? 'scale-110 shadow-2xl' : ''}`}
      >
        <div className="flex items-center space-x-2">
          {/* Drag indicator (optional) */}
          <div className="flex flex-col space-y-1 opacity-30">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          
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
      </div>
      
      {/* Optional: Reset position button (appears on long press/hover) */}
      {isDragging && (
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            setPosition({ x: window.innerWidth - 120, y: window.innerHeight - 160 });
          }}
        >
          Reset Position
        </div>
      )}
    </div>
  );
};

export default FloatingOrderButton;