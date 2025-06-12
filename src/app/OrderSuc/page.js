"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SuccessAnimate from '../components/SuccessAnimate';
import { useAuth } from '../context/AuthContext';

// Create a content component that uses useSearchParams
const OrderSucContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        console.log('Order success data:', data); // Debug log
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    
    // Poll for order status updates every 10 seconds
    const interval = setInterval(fetchOrderDetails, 10000);
    
    return () => clearInterval(interval);
  }, [orderId, user, router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'text-orange-600 bg-orange-50';
      case 'ready_for_pickup':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing':
        return 'Your order is being prepared';
      case 'ready_for_pickup':
        return 'Your order is ready for pickup!';
      case 'completed':
        return 'Order completed';
      default:
        return 'Processing your order';
    }
  };

  const getSugarLevelDisplay = (sugarLevel) => {
    const levels = {
      '0%': 'No Sugar',
      '25%': 'Light Sweet',
      '50%': 'Half Sweet',
      '75%': 'Less Sweet',
      '100%': 'Regular'
    };
    return levels[sugarLevel] || 'Regular';
  };

  // Helper function to calculate item total price including toppings
  const calculateItemTotal = (item) => {
    const basePrice = parseFloat(item.unit_price) * item.quantity;
    const toppingsTotal = (item.toppings || []).reduce((sum, topping) => {
      return sum + (parseFloat(topping.price) * item.quantity);
    }, 0);
    return basePrice + toppingsTotal;
  };

  // Helper function to get order items (handle both possible API response formats)
  const getOrderItems = (order) => {
    return order.order_items || order.orderItems || [];
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-16">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const orderItems = getOrderItems(order);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Success Animation */}
        <SuccessAnimate />
        
        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600">Order ID: #{order.id}</p>
            {order.customer_name && (
              <p className="text-sm text-gray-500 mt-1">Customer: {order.customer_name}</p>
            )}
          </div>

          {/* Order Status */}
          <div className={`rounded-lg p-4 mb-4 text-center ${getStatusColor(order.order_status)}`}>
            <div className="flex items-center justify-center mb-2">
              {order.order_status === 'preparing' && (
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse mr-2"></div>
              )}
              {order.order_status === 'ready_for_pickup' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-semibold">
                {getStatusText(order.order_status)}
              </span>
            </div>
            {order.order_status === 'preparing' && (
              <p className="text-sm opacity-80">We&apos;ll notify you when it&apos;s ready!</p>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-800">Your Order:</h3>
            {orderItems.map((item, index) => {
              const product = item.product_size?.product || item.productSize?.product;
              const size = item.product_size?.size || item.productSize?.size;
              const itemTotal = calculateItemTotal(item);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">
                          {product?.name || 'Unknown Product'}
                        </h4>
                        <span className="font-medium text-gray-800 ml-4">
                          {item.quantity > 1 ? `${item.quantity} x ` : ''}${parseFloat(item.unit_price).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Size: <span className="font-medium capitalize">{size}</span></p>
                        
                        {/* Sugar Level Display */}
                        {item.sugar_level && (
                          <p>Sugar Level: <span className="font-medium">
                            {getSugarLevelDisplay(item.sugar_level)}
                          </span></p>
                        )}
                        
                        {/* Toppings */}
                        {item.toppings && item.toppings.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-700">Add-ons:</p>
                            <div className="ml-2 space-y-1">
                              {item.toppings.map((topping, tIndex) => (
                                <p key={tIndex} className="text-xs">
                                  • {topping.topping?.name || 'Unknown Topping'} 
                                  <span className="text-gray-500"> (+${parseFloat(topping.price).toFixed(2)} each)</span>
                                  {item.quantity > 1 && (
                                    <span className="text-gray-500"> = ${(parseFloat(topping.price) * item.quantity).toFixed(2)}</span>
                                  )}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
              <span className="text-2xl font-bold text-gray-800">
                ${parseFloat(order.total_price).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Order Time:</span>
              <span>{formatDateTime(order.created_at)}</span>
            </div>
            {user?.role === 'guest' && order.session_id && (
              <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                <span>Table:</span>
                <span>{user.table_number || 'N/A'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          {order.order_status === 'ready_for_pickup' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 font-semibold text-lg">
                  🎉 Ready for Pickup!
                </span>
              </div>
              <p className="text-green-600 text-sm">
                Please visit the counter to collect your order.
              </p>
            </div>
          )}

          {order.order_status === 'preparing' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-orange-600 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-orange-800 font-semibold">
                  Preparing Your Order...
                </span>
              </div>
              <p className="text-orange-600 text-sm">
                We&apos;re working on your delicious drinks! This page will update automatically.
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              // Ensure navbar shows when going back to home
              window.dispatchEvent(new CustomEvent('drinkDetailsClose'));
              router.push('/');
            }}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md"
          >
            Order More Drinks
          </button>

          <button
            onClick={() => router.push('/order')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            View Order History
          </button>
        </div>

        {/* Payment Notice for Guests */}
        {user?.role === 'guest' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-semibold">Payment Required</span>
            </div>
            <p className="text-blue-600 text-sm">
              Please proceed to the counter for payment when your order is ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const OrderSucPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderSucContent />
    </Suspense>
  );
};

export default OrderSucPage;