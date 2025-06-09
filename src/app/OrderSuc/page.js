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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Success Animation */}
        <SuccessAnimate />
        
        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Details</h2>
            <p className="text-gray-600">Order ID: #{order.id}</p>
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
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-800">Order Items:</h3>
            {order.order_items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.product_size.product.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Size: {item.product_size.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    {item.toppings && item.toppings.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Toppings: {item.toppings.map(t => t.topping.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ${parseFloat(item.unit_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total:</span>
              <span className="text-xl font-bold text-gray-800">
                ${parseFloat(order.total_price).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Order Time:</span>
              <span>{formatDateTime(order.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => {
              // Ensure navbar shows when going back to home
              window.dispatchEvent(new CustomEvent('drinkDetailsClose'));
              router.push('/');
            }}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Order More Drinks
          </button>
          
          {order.order_status === 'ready_for_pickup' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold mb-2">
                🎉 Your order is ready for pickup!
              </p>
              <p className="text-green-600 text-sm">
                Please visit the shop to collect your order.
              </p>
            </div>
          )}
        </div>
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