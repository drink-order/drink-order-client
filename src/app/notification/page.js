"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import NotificationCompo from "../components/NotificationCompo";

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
  }, [session, router]); const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="p-4">
        <NotificationCompo />
    </div>
  );
};

export default Notification;