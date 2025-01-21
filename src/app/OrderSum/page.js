// "use client";

// import React from 'react';
// import OrderSummary from '../components/OrderSummary';
// import OrderInfo from '../components/OrderInfo';

// export const Page = () => {
//   const handleCheckout = () => {
//     // Logic for checkout functionality
//     alert('Proceeding to Checkout!');
//   };

//   return (
//     <div className="p-4">
//       <OrderSummary />
//       <OrderInfo />
//       <button
//         onClick={handleCheckout}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Checkout
//       </button>
//     </div>
//   );
// };

// export default Page;
"use client";

import React, { useState } from 'react';
import OrderSummary from '../components/OrderSummary';
import OrderInfo from '../components/OrderInfo';
import SuccessAnimate from '../components/SuccessAnimate';
import OrderStatusButton from '../components/OrderStatusButton';

export const Page = () => {
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  const handleCheckout = () => {
    // Simulate checkout completion
    setIsCheckoutComplete(true);
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      {!isCheckoutComplete ? (
        // Show OrderSummary, OrderInfo, and Checkout button initially
        <>
          <OrderSummary />
          <OrderInfo />
          <button
            onClick={handleCheckout}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Checkout
          </button>
        </>
      ) : (
        // Show SuccessAnimate and OrderStatusButton after checkout
        <>
          <SuccessAnimate />
          <OrderStatusButton />
        </>
      )}
    </div>
  );
};

export default Page;
