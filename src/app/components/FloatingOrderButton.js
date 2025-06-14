"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useNotificationContext } from "../context/NotificationContext";

const FloatingOrderButton = () => {
  const { user } = useAuth();
  const { activeOrder, refreshData } = useNotificationContext(); // ← Now works!
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickStart, setClickStart] = useState({ x: 0, y: 0 });
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const buttonRef = useRef(null);
  const router = useRouter();

  // Initialize position
  useEffect(() => {
    const savedPosition = localStorage.getItem('floatingOrderButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      setPosition({ x: window.innerWidth - 120, y: window.innerHeight - 160 });
    }
  }, []);

  // Save position changes
  useEffect(() => {
    if (position.x !== null && position.y !== null) {
      localStorage.setItem('floatingOrderButtonPosition', JSON.stringify(position));
    }
  }, [position]);

  // Force refresh when component mounts to ensure we have latest data
  useEffect(() => {
    if (user && refreshData) {
      refreshData();
    }
  }, [user, refreshData]);

  // Constrain position to viewport
  const constrainPosition = (x, y) => {
    const buttonWidth = 100;
    const buttonHeight = 50;
    const margin = 10;

    const maxX = window.innerWidth - buttonWidth - margin;
    const maxY = window.innerHeight - buttonHeight - margin;

    return {
      x: Math.max(margin, Math.min(x, maxX)),
      y: Math.max(margin, Math.min(y, maxY))
    };
  };

  // Handle window resize
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
    
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - clickStart.x, 2) + Math.pow(e.clientY - clickStart.y, 2)
    );
    
    if (dragDistance > 5) {
      setHasBeenDragged(true);
    }
    
    const constrained = constrainPosition(newX, newY);
    setPosition(constrained);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      if (!hasBeenDragged) {
        handleNavigateToOrderStatus();
      }
    }
  };

  // Touch handlers
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
    
    const dragDistance = Math.sqrt(
      Math.pow(touch.clientX - clickStart.x, 2) + Math.pow(touch.clientY - clickStart.y, 2)
    );
    
    if (dragDistance > 5) {
      setHasBeenDragged(true);
    }
    
    const constrained = constrainPosition(newX, newY);
    setPosition(constrained);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      
      if (!hasBeenDragged) {
        handleNavigateToOrderStatus();
      }
    }
  };

  // Global event listeners
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

  const handleNavigateToOrderStatus = () => {
    if (activeOrder && !hasBeenDragged) {
      router.push(`/OrderSuc?orderId=${activeOrder.id}&status=${activeOrder.order_status}`);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Preparing';
      case 'ready_for_pickup': return 'Ready';
      case 'completed': return 'Completed';
      default: return 'View Status';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-orange-500 hover:bg-orange-600';
      case 'ready_for_pickup': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  // Debug logging (remove in production)
  console.log('FloatingOrderButton Debug:', { 
    user: !!user, 
    activeOrder, 
    position 
  });

  // Don't show if no user, no active order, or position not set
  if (!user || !activeOrder || position.x === null) {
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
          {/* Drag indicator */}
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
    </div>
  );
};

export default FloatingOrderButton;