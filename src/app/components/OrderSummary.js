import React from "react";
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

const OrderSummary = () => {
  const { cart } = useCart();
  const router = useRouter();

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, product) => total + Number(product.price) * product.quantity,
    0
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md mb-2">
      {/* Title */}
      <h3 className="text-lg font-semibold mb-5">Order Summary</h3>

      {/* Product List */}
      {cart.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between mb-4"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-md mr-4"
          />
          <div>
            <h4 className="font-medium text-lg">{product.title}</h4>
            <p className="text-sm text-gray-500">Size: {product.size}</p>
            <p className="text-sm text-gray-500">Sugar: {product.sugar}</p>
            <p className="text-sm text-gray-500">Toppings: {product.toppings.join(', ')}</p>
            <p className="text-sm text-gray-500">Quantity: x{product.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>
        </div>
      ))}

      {/* Total Section */}
      <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-4">
        <p>Total</p>
        <p>${totalPrice.toFixed(2)}</p>
      </div>

      {/* Back Button */}
      <div className="mt-4">
        <button
          onClick={handleBack}
          className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;