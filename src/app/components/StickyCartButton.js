"use client";

import React, { useState, useEffect, useRef } from 'react';

const StickyCartButton = ({ cart, total, setCart, setTotal }) => {
  const [showCartModal, setShowCartModal] = useState(false);
  const cartModalRef = useRef(null);

  const removeFromCart = (item) => {
    const updatedCart = cart.filter((i) => i.id !== item.id);
    setCart(updatedCart);
    setTotal(total - item.price);
  };

  useEffect(() => {
    if (product) {
      addToCart(product);
      setCart([...cart, product]);
      setTotal(total + product.price);
    }
  }, [product]);

  const toggleCartModal = () => {
    setShowCartModal(!showCartModal);
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


  return (
    <div>
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-50 bg-yellow-600 text-white flex justify-between items-center px-6 py-4 shadow-lg h-14">
          <div className="flex items-center">
            <span className="bg-white text-yellow-600 font-bold px-4 py-2 rounded-full text-lg mr-4">
              {cart.length}
            </span>
            <span className="text-lg font-semibold" onClick={toggleCartModal}>
              View Your Cart
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold mr-6">${total.toFixed(2)}</span>
            <button
              onClick={toggleCartModal}
              className="bg-white text-yellow-600 px-4 py-2 rounded-full hover:bg-yellow-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div ref={cartModalRef} className="bg-white w-full max-w-lg p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            <ul>
              {cart.map((item, index) => (
                <li key={item.id || index} className="flex justify-between items-center mb-2">
                  <span>{item.title}</span>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleCartModal}
              className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyCartButton;