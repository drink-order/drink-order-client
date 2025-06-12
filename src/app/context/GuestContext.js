"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const GuestContext = createContext(undefined);

export function GuestProvider({ children }) {
  const [guestSession, setGuestSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if guest session is valid
  const checkGuestSession = useCallback(async () => {
    if (typeof window === 'undefined') return null;

    try {
      const token = localStorage.getItem("guest_token");
      const sessionId = localStorage.getItem("guest_session_id");
      const tableNumber = localStorage.getItem("guest_table_number");
      const expiresAt = localStorage.getItem("guest_expires_at");

      if (!token || !sessionId || !tableNumber || !expiresAt) {
        setGuestSession(null);
        return null;
      }

      // Check if session has expired
      const expireDate = new Date(expiresAt);
      const now = new Date();
      
      if (expireDate <= now) {
        // Session expired - clear localStorage
        clearGuestSession();
        return null;
      }

      // Verify session with backend (optional - you can implement this endpoint)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/guest/verify-session`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const sessionData = {
            token,
            sessionId,
            tableNumber,
            expiresAt
          };
          setGuestSession(sessionData);
          return sessionData;
        } else {
          // Session invalid on backend
          clearGuestSession();
          return null;
        }
      } catch (error) {
        // If verification fails, assume session is still valid based on local data
        console.warn("Could not verify guest session with backend:", error);
        const sessionData = {
          token,
          sessionId,
          tableNumber,
          expiresAt
        };
        setGuestSession(sessionData);
        return sessionData;
      }
    } catch (error) {
      console.error("Guest session check failed:", error);
      clearGuestSession();
      return null;
    }
  }, []);

  // Clear guest session data
  const clearGuestSession = useCallback(() => {
    localStorage.removeItem("guest_token");
    localStorage.removeItem("guest_session_id");
    localStorage.removeItem("guest_table_number");
    localStorage.removeItem("guest_expires_at");
    setGuestSession(null);
  }, []);

  // Initialize guest session check
  useEffect(() => {
    const initializeGuestSession = async () => {
      await checkGuestSession();
      setLoading(false);
    };

    initializeGuestSession();
  }, [checkGuestSession]);

  // Create guest session (called after successful QR scan)
  const createGuestSession = useCallback((sessionData) => {
    localStorage.setItem("guest_token", sessionData.token);
    localStorage.setItem("guest_session_id", sessionData.session_id);
    localStorage.setItem("guest_table_number", sessionData.table_number);
    localStorage.setItem("guest_expires_at", sessionData.expires_at);
    
    setGuestSession({
      token: sessionData.token,
      sessionId: sessionData.session_id,
      tableNumber: sessionData.table_number,
      expiresAt: sessionData.expires_at
    });
  }, []);

  // Get guest session headers for API calls
  const getGuestHeaders = useCallback(() => {
    if (!guestSession?.token) return {};
    
    return {
      'Authorization': `Bearer ${guestSession.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }, [guestSession]);

  // Place order as guest
  const placeGuestOrder = useCallback(async (orderData) => {
    if (!guestSession) {
      throw new Error("No active guest session");
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: getGuestHeaders(),
        credentials: "include",
        body: JSON.stringify({
          ...orderData,
          session_id: guestSession.sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      return await response.json();
    } catch (error) {
      console.error("Error placing guest order:", error);
      throw error;
    }
  }, [guestSession, getGuestHeaders]);

  // Get orders for current session
  const getSessionOrders = useCallback(async () => {
    if (!guestSession) {
      throw new Error("No active guest session");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/session/${guestSession.sessionId}`,
        {
          method: "GET",
          headers: getGuestHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch session orders");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching session orders:", error);
      throw error;
    }
  }, [guestSession, getGuestHeaders]);

  // Logout guest session
  const logoutGuest = useCallback(() => {
    clearGuestSession();
    router.push("/");
  }, [clearGuestSession, router]);

  // Get time remaining in session
  const getTimeRemaining = useCallback(() => {
    if (!guestSession?.expiresAt) return null;
    
    const expireDate = new Date(guestSession.expiresAt);
    const now = new Date();
    const diffMs = expireDate - now;
    
    if (diffMs <= 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, totalMinutes: Math.floor(diffMs / (1000 * 60)) };
  }, [guestSession]);

  const value = {
    guestSession,
    loading,
    isGuest: !!guestSession,
    createGuestSession,
    clearGuestSession,
    checkGuestSession,
    getGuestHeaders,
    placeGuestOrder,
    getSessionOrders,
    logoutGuest,
    getTimeRemaining,
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}