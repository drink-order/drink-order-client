"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Use your custom AuthContext
import NotificationCompo from "../components/NotificationCompo";

const Notification = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const router = useRouter();

  useEffect(() => {
    const userRole = user?.role;

    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "shopOwner") {
      router.push("/shop-owner");
    } else if (userRole === "staff") {
      router.push("/staff");
    }
  }, [user, router]);

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-4">
      <NotificationCompo />
    </div>
  );
};

export default Notification;