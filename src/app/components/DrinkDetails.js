"use client";

import React, { useState, useEffect } from "react";
import DrinkOption from "./DrinkOption";
import CounterInput from "./CounterInput";
import Button from "./Button";
import { getSession } from "next-auth/react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

const DrinkDetails = ({ drink, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    size: "",
    sugar: "",
    toppings: [],
  });
  const [canOrder, setCanOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      setErrorMessage(""); // Clear any previous errors
      const session = await getSession();

      if (!session) {
        setErrorMessage("You need to be logged in to place an order.");
        return;
      }
      setUserId(session.user.id);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch("/shop-location/api/location", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ latitude, longitude }),
              });
              const data = await response.json();
              if (data.status === "success") {
                setCanOrder(true);
              } else {
                setErrorMessage(data.message);
              }
            } catch (error) {
              setErrorMessage("Error connecting to the server. Please try again later.");
            }
          },
          (error) => {
            handleLocationError(error);
          }
        );
      } else {
        setErrorMessage("Geolocation is not supported by your browser.");
      }
    };

    initialize();
  }, []);

  const handleLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setErrorMessage("You denied the request for location access.");
        break;
      case error.POSITION_UNAVAILABLE:
        setErrorMessage("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setErrorMessage("The request to get your location timed out.");
        break;
      default:
        setErrorMessage("An unknown error occurred while fetching your location.");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      router.push("/sign-in"); // Redirect to login page
      return;
    }

    if (!canOrder) {
      setErrorMessage("You are too far from the shop to place an order.");
      return;
    }

    setLoading(true);
    const orderData = { ...drink, quantity, ...selectedOptions };
    try {
      await addToCart(orderData); // Call the context's addToCart function
      setSuccessMessage("Order placed successfully!");
      onBack(); // Go back to the previous screen
    } catch (error) {
      setErrorMessage("Failed to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (options) => {
    setSelectedOptions(options);
  };

  const isAddToCartDisabled = !selectedOptions.size || !selectedOptions.sugar || selectedOptions.toppings.length === 0;

  const totalPrice = (drink.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b bg-gray-100">
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
            className="rounded-lg w-36 h-36 object-cover shadow-lg"
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
            className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700"
            disabled={loading || isAddToCartDisabled}
          >
            {loading ? "Placing Order..." : "Add to Cart"}
          </Button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold">Total Price: ${totalPrice}</span>
        </div>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>
    </div>
  );
};

export default DrinkDetails;