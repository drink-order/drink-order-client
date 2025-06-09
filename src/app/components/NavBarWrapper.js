"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
  const pathname = usePathname();
  const [isDrinkDetailsOpen, setIsDrinkDetailsOpen] = useState(false);
  
  // Routes where navbar should be shown
  const showRoutes = ["/", "/order", "/notification", "/account", "/OrderSuc"];
  const isShowRoute = showRoutes.includes(pathname);

  // Reset drink details state when navigating to different pages
  useEffect(() => {
    if (pathname === "/" || pathname === "/order" || pathname === "/notification" || pathname === "/account") {
      setIsDrinkDetailsOpen(false);
    }
  }, [pathname]);

  // Listen for drink details modal state
  useEffect(() => {
    const handleDrinkDetailsOpen = () => setIsDrinkDetailsOpen(true);
    const handleDrinkDetailsClose = () => setIsDrinkDetailsOpen(false);
    
    // Listen for custom events that indicate drink details is open/closed
    window.addEventListener('drinkDetailsOpen', handleDrinkDetailsOpen);
    window.addEventListener('drinkDetailsClose', handleDrinkDetailsClose);
    
    return () => {
      window.removeEventListener('drinkDetailsOpen', handleDrinkDetailsOpen);
      window.removeEventListener('drinkDetailsClose', handleDrinkDetailsClose);
    };
  }, []);

  // Don't render NavBar if:
  // 1. Not on a show route
  // 2. Drink details modal is open (only on home page)
  if (!isShowRoute || (pathname === "/" && isDrinkDetailsOpen)) return null;
  
  return <NavBar />;
}