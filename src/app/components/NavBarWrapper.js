"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
  const pathname = usePathname();
  const showRoutes = ["/", "/order", "/notification", "/account"];
  const isShowRoute = showRoutes.includes(pathname);

  if (!isShowRoute) return null; // Don't render NavBar for auth routes
  return <NavBar />;
}
