"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { getSession } from 'next-auth/react';
import CardBox from './CardBox';

const StickyCartButton = () => {
  const { cart, total, removeFromCart, setCart, addToCart, calculateTotal } = useCart();
  const { addOrder, getLatestOrderId } = useOrder();
  const [showCartModal, setShowCartModal] = useState(false);
  const cartModalRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const toggleCartModal = () => {
    setShowCartModal((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (cartModalRef.current && !cartModalRef.current.contains(event.target)) {
      setShowCartModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      setShowCartModal(false); // Close the modal if the cart is empty
    }
  }, [cart]);

  const handleQuantityChange = async (item, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) => {
        if (cartItem.id === item.id) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });
      calculateTotal(updatedCart);
      return updatedCart;
    });

    // Call the API to persist the change
    try {
      await fetch('/api/tocart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemId: item.id, quantity: newQuantity }),
      });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId); // Call the removeFromCart function to update the UI
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((cartItem) => cartItem.id !== itemId);
        calculateTotal(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderId = await addOrder(userId, cart); // Get the generated orderId directly from addOrder
      if (orderId) {
        // Call the API to delete all items from the cart
        await fetch(`/api/tocart?userId=${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        setCart([]); // Clear the cart
        calculateTotal([]);
        router.push(`/OrderSuc?orderId=${orderId}`); // Use the same orderId here
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };  

  return (
    <div>
      {cart && cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-50 bg-yellow-600 text-white flex justify-between items-center px-6 py-4 h-14">
          <div className="flex items-center">
            <span className="bg-white text-yellow-600 font-bold px-4 py-2 rounded-full text-lg mr-4">
              {cart.length}
            </span>
            <span className="text-lg font-semibold cursor-pointer" onClick={toggleCartModal}>
              View Your Cart
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold mr-6">${total.toFixed(2)}</span>
            <button
              onClick={toggleCartModal}
              className="bg-white text-yellow-600 px-4 py-2 rounded-full hover:bg-yellow-700"
            >
              View
            </button>
          </div>
        </div>
      )}

      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div ref={cartModalRef} className="bg-white w-full max-w-lg p-4 rounded-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            <ul>
              {cart && cart.map((item, index) => (
                <li key={`${item.id}-${index}`} className="mb-2">
                  <CardBox
                    id={item.id}
                    name={item.title}
                    description={`Size: ${item.size}, Sugar: ${item.sugar}, Toppings: ${Array.isArray(item.toppings) ? item.toppings.join(', ') : ''}`}
                    price={item.price}
                    originalPrice={item.originalPrice || item.price}
                    image={item.image}
                    quantity={item.quantity}
                    onRemove={handleRemoveItem}
                    onQuantityChange={(newQuantity) => handleQuantityChange(item, newQuantity)}
                  />
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
              <div>
                <button
                  onClick={handleCheckout}
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 mr-2"
                >
                  Checkout
                </button>
                <button
                  onClick={toggleCartModal}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyCartButton;