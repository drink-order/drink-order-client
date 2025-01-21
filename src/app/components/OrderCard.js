// import React from "react";

// const OrderCard = () => {
//   // Define the list of products and their details
//   const products = [
//     {
//       name: "Brown Crystal Milk Tea",
//       sweetness: "Normal Sweet",
//       size: "L",
//       quantity: 1,
//       price: 1.82,
//       image: "/drink.png", // Ensure this path points to your public folder
//     },
//     {
//         name: "Brown Crystal Milk Tea",
//         sweetness: "Normal Sweet",
//         size: "L",
//         quantity: 1,
//         price: 1.82,
//         image: "/drink.png", // Ensure this path points to your public folder
//       },
//       {
        
//         name: "Brown Crystal Milk Tea",
//         sweetness: "Normal Sweet",
//         size: "L",
//         quantity: 1,
//         price: 1.82,
//         image: "/drink.png", // Ensure this path points to your public folder
//       },
    
//   ];

//   return (
//     <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-lg mb-4">
//       <h3 className="text-xl font-semibold  text-gray-800 mb-4">
//         Order History
//       </h3>
//       {/* Product List */}
//       {products.map((product, index) => (
//         <div
//           key={index}
//           className="flex items-center p-4 border border-gray-300 rounded-lg bg-white shadow-lg mb-2"
//         >
//           {/* Product Image */}
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-16 h-16 rounded-md object-cover"
//           />
//           {/* Product Details */}
//           <div className="flex-1 px-4">
//             <h4 className="font-medium text-lg text-gray-800">{product.name}</h4>
//             <p className="text-sm text-gray-500">
//               Sweetness: {product.sweetness}
//             </p>
//             <p className="text-sm text-gray-500">Size: {product.size}</p>
//             <p className="text-sm text-gray-500">Quantity: x{product.quantity}</p>
//           </div>
//           {/* Product Price */}
//           <div className="text-right">
//             <p className="text-lg font-bold text-gray-800">
//               ${product.price.toFixed(2)}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OrderCard;
import React from "react";

const OrderCard = ({ onOrderClick }) => {
  const products = [
    {
      id: 1,
      name: "Brown Crystal Milk Tea",
      sweetness: "Normal Sweet",
      size: "L",
      quantity: 1,
      price: 1.82,
      image: "/drink.png",
      orderDate: "2025-01-20 10:30 AM",
    },
    {
      id: 2,
      name: "Brown Crystal Milk Tea",
      sweetness: "Normal Sweet",
      size: "L",
      quantity: 1,
      price: 1.82,
      image: "/drink.png",
      orderDate: "2025-01-20 11:00 AM",
    },
    {
      id: 3,
      name: "Brown Crystal Milk Tea",
      sweetness: "Normal Sweet",
      size: "L",
      quantity: 1,
      price: 1.82,
      image: "/drink.png",
      orderDate: "2025-01-20 11:30 AM",
    },
  ];

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-lg mb-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Order History</h3>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onOrderClick(product)} // Pass the product to the click handler
          className="cursor-pointer flex items-center p-4 border border-gray-300 rounded-lg bg-white shadow-lg mb-2 hover:bg-gray-100 transition"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-md object-cover"
          />
          <div className="flex-1 px-4">
            <h4 className="font-medium text-lg text-gray-800">{product.name}</h4>
            <p className="text-sm text-gray-500">Sweetness: {product.sweetness}</p>
            <p className="text-sm text-gray-500">Size: {product.size}</p>
            <p className="text-sm text-gray-500">Quantity: x{product.quantity}</p>
            <p className="text-sm text-gray-500">Ordered On: {product.orderDate}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderCard;
