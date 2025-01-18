"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import NotificationCompo from "../components/NotificationCompo";
import OrderSummary from "../components/OrderSummary";
import OrderInfo from "../components/OrderInfo";

const Notification = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const userRole = session?.user?.role;

    if (userRole === 'admin') {
      router.push('/admin');
    } else if (userRole === 'shopOwner') {
      router.push('/shop-owner');
    } else if (userRole === 'staff') {
      router.push('/staff');
    }
  }, [session, router]);

  const [showDetails, setShowDetails] = useState(false);

  const handleNotificationClick = () => {
    setShowDetails(true); // Show OrderSummary and OrderInfo when clicked
  };

  return (
    <div className="p-4">
      {!showDetails ? (
        // Show NotificationCompo if details are not visible
        <NotificationCompo onClick={handleNotificationClick} />
      ) : (
        // Show OrderSummary and OrderInfo if details are visible
        <div>
          <OrderSummary />
          <OrderInfo />
        </div>
      )}
    </div>
  );
};

export default Notification;