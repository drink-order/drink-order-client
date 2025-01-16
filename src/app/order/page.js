"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Order = () => {
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

  return (
    <div>Order</div>
  );
};

export default Order;