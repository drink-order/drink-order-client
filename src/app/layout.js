import AuthProvider from "../AuthProvider";
import NavBarWrapper from "./components/NavBarWrapper";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from './context/CartContext';
import localFont from "next/font/local";
import "./globals.css";
import { OrderProvider } from "./context/OrderContext";

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

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased pd-16`}
        >
          <OrderProvider>
            <CartProvider>
              {children}
              <NavBarWrapper />
              <Toaster />
            </CartProvider>
          </OrderProvider>
        </body>
      </html>
    </AuthProvider>
  );
}