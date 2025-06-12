"use client";

import React, { useState, useEffect } from "react";
import CounterInput from "./CounterInput";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi";

const DrinkDetails = ({ drink, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSugarLevel, setSelectedSugarLevel] = useState("100%");
  const [canOrder, setCanOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Sugar level options
  const sugarLevels = [
    { value: "0%", label: "No Sugar", description: "Perfect for health-conscious choices" },
    { value: "25%", label: "Light Sweet", description: "Just a hint of sweetness" },
    { value: "50%", label: "Half Sweet", description: "Balanced and refreshing" },
    { value: "75%", label: "Less Sweet", description: "Mildly sweet taste" },
    { value: "100%", label: "Regular", description: "Full sweetness as intended" }
  ];

  // Initialize with first available size
  useEffect(() => {
    if (drink.sizes && drink.sizes.length > 0) {
      setSelectedSize(drink.sizes[0]);
    }
  }, [drink]);

  useEffect(() => {
    const initialize = async () => {
      setErrorMessage("");

      if (!user) {
        setErrorMessage("You need to be logged in to place an order.");
        return;
      }

      // For demo purposes, assume user can always order
      setCanOrder(true);
    };

    initialize();
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!canOrder) {
      setErrorMessage("You are too far from the shop to place an order.");
      return;
    }

    if (!selectedSize) {
      setErrorMessage("Please select a size.");
      return;
    }

    setLoading(true);
    try {
      // Get session data from localStorage (only for guests)
      const sessionId = user?.role === 'guest' ? localStorage.getItem("session_id") : null;
      const tableNumber = user?.role === 'guest' ? localStorage.getItem("table_number") : null;
      
      console.log("Session data:", { sessionId, tableNumber, userRole: user?.role });
      
      // Format order data according to your Laravel API structure
      const orderData = {
        items: [{
          product_size_id: selectedSize.id,
          quantity: quantity,
          sugar_level: selectedSugarLevel,
          toppings: selectedToppings.map(topping => ({
            topping_id: topping.topping.id
          }))
        }]
      };

      // Add session data for guest users with proper validation
      if (user?.role === 'guest') {
        if (!sessionId || !tableNumber) {
          setErrorMessage("Session information is missing. Please refresh and try again.");
          return;
        }
        orderData.session_id = sessionId;
        orderData.table_number = parseInt(tableNumber);
        orderData.customer_name = user.name || "Guest Customer";
      }
      
      console.log("Sending order data:", orderData);
      
      // Send to your Laravel API
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Order API error:", errorData);
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();
      console.log("Order response:", result);
      
      setSuccessMessage("Order placed successfully!");
      
      // Redirect to order success page with order ID
      setTimeout(() => {
        router.push(`/OrderSuc?orderId=${result.order.id}&status=${result.order.order_status}`);
      }, 1500);
      
    } catch (error) {
      console.error("Order error:", error);
      setErrorMessage(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleToppingToggle = (topping) => {
    setSelectedToppings(prev => {
      const isSelected = prev.some(t => t.id === topping.id);
      if (isSelected) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleSugarLevelSelect = (level) => {
    setSelectedSugarLevel(level);
  };

  const calculateTotalPrice = () => {
    let total = selectedSize ? parseFloat(selectedSize.price) : parseFloat(drink.price);
    
    selectedToppings.forEach(topping => {
      total += parseFloat(topping.price);
    });
    
    return (total * quantity).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative bg-yellow-500 text-white">
        <div className="flex items-center justify-between p-4 pt-12">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1 mx-4 truncate">
            {drink.title}
          </h1>
          
          <div className="w-10 h-10"></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Product Image */}
        <div className="relative bg-yellow-500 pb-12">
          <div className="flex justify-center px-8">
            <div className="relative">
              <img
                src={drink.image || "/default-drink.jpg"}
                alt={drink.title}
                className="w-56 h-56 object-cover rounded-3xl shadow-xl border-4 border-white"
                onError={(e) => {
                  if (e.target.src !== `${window.location.origin}/default-drink.jpg`) {
                    e.target.src = "/default-drink.jpg";
                  }
                }}
              />
              {!drink.isAvailable && (
                <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                  <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold text-sm">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="px-6 space-y-8 pb-32">

          {/* Size Selection */}
          {drink.sizes && drink.sizes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 pt-4">Choose Size</h3>
              <div className="grid grid-cols-1 gap-3">
                {drink.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => handleSizeSelect(size)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selectedSize?.id === size.id
                        ? 'border-yellow-400 bg-yellow-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-yellow-200 hover:bg-yellow-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-gray-800 capitalize">
                          {size.size}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Perfect for {size.size === 'small' ? 'a quick boost' : size.size === 'medium' ? 'regular enjoyment' : 'sharing or extra energy'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-800">
                          ${parseFloat(size.price).toFixed(2)}
                        </span>
                        {selectedSize?.id === size.id && (
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-2 ml-auto">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Level Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Sugar Level</h3>
            <div className="grid grid-cols-1 gap-3">
              {sugarLevels.map((level, index) => (
                <button
                  key={index}
                  onClick={() => handleSugarLevelSelect(level.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    selectedSugarLevel === level.value
                      ? 'border-yellow-400 bg-yellow-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-yellow-200 hover:bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-800">
                        {level.label} ({level.value})
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {level.description}
                      </p>
                    </div>
                    <div className="text-right">
                      {selectedSugarLevel === level.value && (
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          {drink.toppings && drink.toppings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Add Toppings</h3>
              <div className="grid grid-cols-1 gap-3">
                {drink.toppings.map((toppingItem, index) => {
                  const isSelected = selectedToppings.some(t => t.id === toppingItem.id);
                  return (
                    <button
                      key={index}
                      onClick={() => handleToppingToggle(toppingItem)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-yellow-200 hover:bg-yellow-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-gray-800">
                            {toppingItem.topping.name}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            Add extra flavor to your drink
                          </p>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-800">
                            +${parseFloat(toppingItem.price).toFixed(2)}
                          </span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected 
                              ? 'bg-yellow-400 border-yellow-400' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-600 font-medium">{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-green-600 font-medium">{successMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="bg-white border-t border-gray-200 p-6 space-y-4">
        {/* Quantity and Total */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Total Price</span>
            <div className="text-2xl font-bold text-gray-800">
              ${calculateTotalPrice()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Sugar: {sugarLevels.find(level => level.value === selectedSugarLevel)?.label}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Quantity</span>
            <CounterInput value={quantity} onChange={setQuantity} />
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !selectedSize || !drink.isAvailable}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
            loading || !selectedSize || !drink.isAvailable
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 shadow-lg hover:shadow-xl transform active:scale-95'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Placing Order...
            </div>
          ) : !selectedSize ? (
            'Please Select a Size'
          ) : !drink.isAvailable ? (
            'Currently Unavailable'
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
};

export default DrinkDetails;