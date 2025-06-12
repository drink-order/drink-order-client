"use client";

import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { GuestProvider } from "./context/GuestContext";
import NavBarWrapper from "./components/NavBarWrapper";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "@/components/ui/toaster";
import { registerServiceWorker } from "../utils/serviceWorkerRegistration";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker on client side only
    if (typeof window !== 'undefined') {
      registerServiceWorker().catch(console.error);
    }
  }, []);

  return null;
}

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <head>
        <title>One Cup</title>
        <meta name="description" content="Order your favorite drinks" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pd-16`}
      >
        <ServiceWorkerRegistration />
        <AuthProvider>
          <GuestProvider>
            <ProductsProvider>
              <OrderProvider>
                <CartProvider>
                  <NotificationProvider>
                    {children}
                    <NavBarWrapper />
                    <Toaster />
                  </NotificationProvider>
                </CartProvider>
              </OrderProvider>
            </ProductsProvider>
          </GuestProvider>
        </AuthProvider>
      </body>
    </html>
  );
}