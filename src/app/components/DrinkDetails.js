// import React from "react";

// const StickyCardComponent = () => {
//   return (
//     <div className="max-w-lg mx-auto p-4">
//       <div className="bg-white shadow-lg rounded-lg sticky top-4">
//         {/* Product Image */}
//         <img
//           src="/drink.png"
//           alt="Product"
//           className="rounded-t-lg"
//         />

//         {/* Product Details */}
//         <div className="p-4">
//           <h2 className="text-xl font-semibold">Matcha Cheese Cream</h2>
//           <p className="text-gray-600 text-sm mb-4">$2.80/cup</p>

//           {/* Size Options */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">SIZE</h3>
//             <div className="flex space-x-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="size"
//                   className="text-orange-500 focus:ring-0"
//                 />
//                 <span className="text-gray-700 text-sm">Medium</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="size"
//                   className="text-orange-500 focus:ring-0"
//                 />
//                 <span className="text-gray-700 text-sm">Large</span>
//               </label>
//             </div>
//           </div>

//           {/* Sweetness Options */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">SWEETNESS</h3>
//             <div className="space-y-2">
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Normal Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">50% Less Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">75% Normal Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">100% More Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">125% Very Sweet</span>
//               </label>
//             </div>
//           </div>

//           {/* Ice Options */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">ICE</h3>
//             <div className="space-y-2">
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Normal Ice</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">No Ice</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Ice Pack</span>
//               </label>
//             </div>
//           </div>

//           {/* Extra Toppings */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">Extra Topping</h3>
//             <div className="space-y-2">
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Black Sugar Bubble ($0.40)</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Grass Jelly ($0.40)</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Tea Jelly ($0.40)</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Brown Jelly ($0.50)</span>
//               </label>
//             </div>
//           </div>

//           {/* Add to Cart Button */}
//           <div className="mt-4">
//             <button className="w-full bg-orange-500 text-white text-lg font-medium py-2 rounded-lg hover:bg-orange-600">
//               Add to Cart | $2.80
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StickyCardComponent;
// import React, { useState } from "react";

// const StickyCardComponent = () => {
//   const [quantity, setQuantity] = useState(1);
//   const basePrice = 2.80;
//   const totalPrice = (basePrice * quantity).toFixed(2);

//   const handleIncrease = () => setQuantity(quantity + 1);
//   const handleDecrease = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   return (
//     <div className="max-w-lg mx-auto p-4">
//       <div className="bg-white shadow-lg rounded-lg sticky top-4">
//         {/* Product Image */}
//         <img
//           src="/drink.png"
//           alt="Product"
//           className="rounded-t-lg"
//         />

//         {/* Product Details */}
//         <div className="p-4">
//           <h2 className="text-xl font-semibold">Matcha Cheese Cream</h2>
//           <p className="text-gray-600 text-sm mb-4">$2.80/cup</p>

//           {/* Size Options */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">SIZE</h3>
//             <div className="flex space-x-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="size"
//                   className="text-orange-500 focus:ring-0"
//                 />
//                 <span className="text-gray-700 text-sm">Medium</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="size"
//                   className="text-orange-500 focus:ring-0"
//                 />
//                 <span className="text-gray-700 text-sm">Large</span>
//               </label>
//             </div>
//           </div>

//           {/* Sweetness Options */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">SWEETNESS</h3>
//             <div className="space-y-2">
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Normal Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">50% Less Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">75% Normal Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">100% More Sweet</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">125% Very Sweet</span>
//               </label>
//             </div>
//           </div>

//           {/* Ice Options */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">ICE</h3>
//             <div className="space-y-2">
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Normal Ice</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">No Ice</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Ice Pack</span>
//               </label>
//             </div>
//           </div>

//           {/* Extra Toppings */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-2">Extra Topping</h3>
//             <div className="space-y-2">
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Black Sugar Bubble ($0.40)</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Grass Jelly ($0.40)</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Tea Jelly ($0.40)</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
//                 <span className="text-gray-700 text-sm">Brown Jelly ($0.50)</span>
//               </label>
//             </div>
//           </div>

//           {/* Quantity Selector and Add to Cart Button */}
//           <div className="mt-4 flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <button
//                 className="px-2 py-1 border rounded-lg text-orange-500"
//                 onClick={handleDecrease}
//               >
//                 -
//               </button>
//               <span className="text-lg font-medium">{quantity}</span>
//               <button
//                 className="px-2 py-1 border rounded-lg text-orange-500"
//                 onClick={handleIncrease}
//               >
//                 +
//               </button>
//             </div>
//             <button className="flex-1 bg-orange-500 text-white text-lg font-medium py-2 rounded-lg hover:bg-orange-600">
//               Add to Cart | ${totalPrice}
//             </button>
//             <button 
//               className="bg-gray-500 text-white text-lg font-medium py-2 px-4 rounded-lg hover:bg-gray-600"
//               onClick={handleCancel}
//             >
//               x
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StickyCardComponent;
import React, { useState } from "react";

const StickyCardComponent = () => {
  const [quantity, setQuantity] = useState(1);
  const basePrice = 2.80;
  const totalPrice = (basePrice * quantity).toFixed(2);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleCancel = () => {
    setQuantity(1); // Reset the quantity to 1
    // You can also reset other options here if needed
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg sticky top-4">
        {/* Product Image */}
        <img
          src="/drink.png"
          alt="Product"
          className="rounded-t-lg"
        />

        {/* Product Details */}
        <div className="p-4">
          <h2 className="text-xl font-semibold">Matcha Cheese Cream</h2>
          <p className="text-gray-600 text-sm mb-4">$2.80/cup</p>

          {/* Size Options */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">SIZE</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="size"
                  className="text-orange-500 focus:ring-0"
                />
                <span className="text-gray-700 text-sm">Medium</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="size"
                  className="text-orange-500 focus:ring-0"
                />
                <span className="text-gray-700 text-sm">Large</span>
              </label>
            </div>
          </div>

          {/* Sweetness Options */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">SWEETNESS</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">Normal Sweet</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">50% Less Sweet</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">75% Normal Sweet</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">100% More Sweet</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="sweetness" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">125% Very Sweet</span>
              </label>
            </div>
          </div>

          {/* Ice Options */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">ICE</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">Normal Ice</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">No Ice</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="ice" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">Ice Pack</span>
              </label>
            </div>
          </div>

          {/* Extra Toppings */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Extra Topping</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">Black Sugar Bubble ($0.40)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">Grass Jelly ($0.40)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">Tea Jelly ($0.40)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="topping" className="text-orange-500 focus:ring-0" />
                <span className="text-gray-700 text-sm">Brown Jelly ($0.50)</span>
              </label>
            </div>
          </div>

          {/* Quantity Selector and Add to Cart / Cancel Button */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                className="px-2 py-1 border rounded-lg text-orange-500"
                onClick={handleDecrease}
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                className="px-2 py-1 border rounded-lg text-orange-500"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
            <button className="flex-1 bg-orange-500 text-white text-lg font-medium py-2 rounded-lg hover:bg-orange-600">
              Add to Cart | ${totalPrice}
            </button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCardComponent;
