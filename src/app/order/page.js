"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const Order = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const userRole = user?.role;
    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "shopOwner") {
      router.push("/shop-owner");
    } else if (userRole === "staff") {
      router.push("/staff");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready_for_pickup':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
      <div className="max-w-md mx-auto">
        {!selectedOrder ? (
          // Order History List
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Order History</h1>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => {
                      // Ensure navbar shows when going to home
                      window.dispatchEvent(new CustomEvent('drinkDetailsClose'));
                      router.push('/');
                    }}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Start Ordering
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{formatDateTime(order.created_at)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                        {getStatusText(order.order_status)}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.order_items.slice(0, 2).map(item => item.product_size.product.name).join(', ')}
                            {order.order_items.length > 2 && ` +${order.order_items.length - 2} more`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">${parseFloat(order.total_price).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">View Details →</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Order Details View
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={handleBackToList}
                className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">Order Details</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Order #{selectedOrder.id}</h2>
                  <p className="text-gray-600">{formatDateTime(selectedOrder.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.order_status)}`}>
                  {getStatusText(selectedOrder.order_status)}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-800">Items Ordered:</h3>
                {selectedOrder.order_items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">
                          {item.product_size.product.name}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Size: <span className="font-medium">{item.product_size.size}</span></p>
                          <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                          <p>Unit Price: <span className="font-medium">${parseFloat(item.unit_price).toFixed(2)}</span></p>
                          {item.toppings && item.toppings.length > 0 && (
                            <p>Toppings: <span className="font-medium">
                              {item.toppings.map(t => `${t.topping.name} (+${parseFloat(t.price).toFixed(2)})`).join(', ')}
                            </span></p>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-800">
                          ${(parseFloat(item.unit_price) * item.quantity + 
                             (item.toppings?.reduce((sum, t) => sum + parseFloat(t.price), 0) || 0) * item.quantity
                            ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-gray-800">
                    ${parseFloat(selectedOrder.total_price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {selectedOrder.order_status === 'ready_for_pickup' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-semibold">Your order is ready for pickup!</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  // Ensure navbar shows when going to home
                  window.dispatchEvent(new CustomEvent('drinkDetailsClose'));
                  router.push('/');
                }}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Order More Drinks
              </button>

              {selectedOrder.order_status === 'completed' && (
                <button
                  onClick={() => {
                    // Navigate to reorder functionality - could copy this order
                    window.dispatchEvent(new CustomEvent('drinkDetailsClose'));
                    router.push('/');
                  }}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Reorder This
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;