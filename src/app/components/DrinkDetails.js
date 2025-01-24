"use client";

import React, { useState, useEffect } from "react";
import DrinkOption from "./DrinkOption";
import CounterInput from "./CounterInput";
import Button from "./Button";
import { getSession } from 'next-auth/react';
import { useCart } from '../context/CartContext';

const DrinkDetails = ({ drink, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    size: "",
    sugar: "",
    toppings: [],
  });
  const [canOrder, setCanOrder] = useState(false);
  const [message, setMessage] = useState('Checking your location...');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        setMessage('You need to be logged in to place an order.');
        return;
      }
      setUserId(session.user.id);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      } else {
        setMessage('Geolocation is not supported by your browser.');
      }

      function successCallback(position) {
        const { latitude, longitude } = position.coords;

        fetch('/shop-location/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude, longitude }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 'success') {
              setCanOrder(true);
            } else {
              setMessage(data.message);
            }
          })
          .catch(() => {
            setMessage('Error connecting to the server. Please try again later.');
          });
      }

      function errorCallback(error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setMessage('You denied the request for location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setMessage('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setMessage('The request to get your location timed out.');
            break;
          default:
            setMessage('An unknown error occurred.');
            break;
        }
      }
    };

    checkSession();
  }, []);

  const handleAddToCart = async () => {
    if (!userId) {
      // Redirect to login page if user is not logged in
      router.push('/sign-in');
      return;
    }

    if (!canOrder) {
      setMessage('You are too far from the shop to place an order.');
      return;
    }

    setLoading(true);
    const orderData = { ...drink, quantity, ...selectedOptions };
    try {
      // Post order to API
      const response = await fetch('/api/tocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, orderData }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const newOrder = await response.json();
      addToCart(newOrder); // Add to cart context
      setOrderSuccess(true);
      setMessage('Order placed successfully!');
      onBack(); // Call the onBack prop to go back
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (options) => {
    setSelectedOptions(options);
  };

  const isAddToCartDisabled = !selectedOptions.size || !selectedOptions.sugar || selectedOptions.toppings.length === 0;

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <button
          className="text-xl text-black"
          onClick={onBack}
          aria-label="Go Back"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold">{drink.title}</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 p-4 space-y-6">
        <div className="flex justify-center mb-4">
          {/* Drink Image */}
          <img
            src={drink.image || "/default-drink.png"}
            alt={drink.title}
            className="rounded-lg w-36 h-36 object-cover"
          />
        </div>

        {/* Drink Options */}
        <DrinkOption
          sizeOptions={drink.size ? drink.size.split(", ") : []}
          sugarOptions={drink.sugar ? drink.sugar.split(", ") : []}
          toppingOptions={drink.toppings || []}
          onOptionChange={handleOptionChange}
        />

        <div className="flex justify-between items-center mt-4">
          <CounterInput value={quantity} onChange={setQuantity} />
          <Button
            onClick={handleAddToCart}
            className="bg-primary text-white px-3 py-1 rounded-full hover:bg-yellow-600"
            disabled={loading || isAddToCartDisabled}
          >
            {loading ? 'Placing Order...' : 'Add to Cart'}
          </Button>
        </div>

        {!canOrder && <p className="text-red-500 mt-4">{message}</p>}
        {orderSuccess && <p className="text-green-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default DrinkDetails;