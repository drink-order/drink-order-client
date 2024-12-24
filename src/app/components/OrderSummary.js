import React from "react";

const OrderSummary = () => {
  // Define the list of products and their details
  const products = [
    {
      name: "Brown Crystal Milk Tea",
      sweetness: "Normal Sweet",
      size: "L",
      quantity: 1,
      price: 1.82,
      image: "/drink.png", // Replace with your image path
    },
    {
      name: "Brown Crystal Milk Tea",
      sweetness: "Normal Sweet",
      size: "L",
      quantity: 1,
      price: 1.82,
      image: "/drink.png", // Replace with your image path
    },
    {
      name: "Brown Crystal Milk Tea",
      sweetness: "Normal Sweet",
      size: "L",
      quantity: 1,
      price: 1.82,
      image: "/drink.png", // Replace with your image path
    },
  ];

  // Calculate total price
  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-md mx-auto">
      {/* Product List */}
      {products.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between mb-2"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-md mr-4"
          />
          <div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.sweetness}</p>
            <p className="text-sm text-gray-500">{product.size}</p>
            <p className="text-sm text-gray-500">x{product.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}

      {/* Total Section */}
      <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-4">
        <p>Total</p>
        <p>${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderSummary;
