"use client";


import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const StickyCartButton = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showCartModal, setShowCartModal] = useState(false);
  const cartModalRef = useRef(null);

  const products = [
    { id: 1, name: 'Chicken Rice', price: 4.5 },
    { id: 2, name: 'Pork Rice', price: 4.8 },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
    setTotal((prevTotal) => prevTotal + item.price);
  };

  const removeFromCart = (item) => {
    setCart(cart.filter((i) => i.id !== item.id));
    setTotal((prevTotal) => prevTotal - item.price);
  };

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
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-500">Price: ${product.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-50 bg-yellow-600 text-white flex justify-between items-center px-6 py-4 shadow-lg h-20">
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
              className="bg-yellow-800 hover:bg-yellow-900 px-6 py-3 rounded-lg text-lg"
            >
              Go to Cart
            </button>
          </div>
        </div>
      )}

      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            ref={cartModalRef}
            className="bg-white w-full rounded-t-lg shadow-lg animate-slide-up"
          >
            <div className="px-6 py-4 border-b">
              <h2 className="text-2xl font-bold">Your Cart</h2>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-gray-500">Price: ${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyCartButton;




