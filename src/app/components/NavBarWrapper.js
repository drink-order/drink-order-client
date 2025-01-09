"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
  const pathname = usePathname();
  const authRoutes = ["/sign-in", "/sign-up", "/admin", "/shop-owner", "/staff"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) return null; // Don't render NavBar for auth routes
  return <NavBar />;
}
