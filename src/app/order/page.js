// "use client";

// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';

// const Order = () => {
//   const { data: session } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     const userRole = session?.user?.role;

//     if (userRole === 'admin') {
//       router.push('/admin');
//     } else if (userRole === 'shopOwner') {
//       router.push('/shop-owner');
//     } else if (userRole === 'staff') {
//       router.push('/staff');
//     }
//   }, [session, router]);

//   return (
//     <div>Order</div>
//   );
// };

// export default Order;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OrderCard from "../components/OrderCard";
import OrderSummary from "../components/OrderSummary";
import OrderInfo from "../components/OrderInfo";

const Order = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const userRole = session?.user?.role;

    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "shopOwner") {
      router.push("/shop-owner");
    } else if (userRole === "staff") {
      router.push("/staff");
    }
  }, [session, router]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order); // Save the clicked order's details
  };

  return (
    <div>
      {!selectedOrder ? (
        // Display OrderCard and OrderSummary when no order is selected
        <>
          <OrderCard onOrderClick={handleOrderClick} />
        </>
      ) : (
        // Display OrderInfo when an order is selected
        <div>
          <OrderSummary />
          <OrderInfo />
        </div>
      )}
    </div>
  );
};

export default Order;
