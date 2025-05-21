"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Extract checkAuth as a reusable function
  const checkAuth = useCallback(async () => {
    if (typeof window === 'undefined') return null; // Server-side check

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setUser(null);
        return null;
      }

      // Verify token with Laravel API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
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
        const userData = await response.json();
        setUser(userData);
        return userData;
      } else {
        // Token invalid - clear localStorage
        localStorage.removeItem("auth_token");
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
      return null;
    }
  }, []);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setLoading(false);
    };

    initializeAuth();
  }, [checkAuth]);

  // Login function
const login = async (email, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }), // updated field name
    });

    const data = await response.json();
    console.log("Login response:", data); // for debugging

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("auth_token", data.token);
    setUser(data.user);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Send OTP function
  const sendOTP = async (phoneNumber) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ phone: phoneNumber }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verify OTP function
  const verifyOTP = async (phoneNumber, otp, userData = null) => {
    try {
      const requestBody = {
        phone: phoneNumber,
        otp: otp,
        ...userData,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // If registration is successful, store the token
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        setUser(data.user);
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Google login function
  const googleLogin = () => {
    // Ensure we're in a browser context
    if (typeof window === 'undefined') return;
    
    const googleLoginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

    // Use a more reliable approach with message events
    const popupWidth = 500;
    const popupHeight = 600;
    const left = window.screenX + (window.outerWidth - popupWidth) / 2;
    const top = window.screenY + (window.outerHeight - popupHeight) / 2;

    const popup = window.open(
      googleLoginUrl,
      "googleLogin",
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
    );

    if (!popup) {
      console.error("Popup blocked or not opened");
      return;
    }

    // Still use polling as a fallback
    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        checkAuth();
      }
    }, 500);

    // Set up message event listener
    const handleMessage = async (event) => {
      // Extract domain from API URL to check origin
      const apiUrlObj = new URL(process.env.NEXT_PUBLIC_API_URL || "");
      const apiDomain = `${apiUrlObj.protocol}//${apiUrlObj.host}`;
      
      // Make sure the message is from our API domain
      if (event.origin !== apiDomain) {
        return;
      }

      // Handle the auth token from message
      if (event.data?.token) {
        localStorage.setItem("auth_token", event.data.token);
        await checkAuth();
        popup?.close();
      }

      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      clearInterval(timer);
      window.removeEventListener("message", handleMessage);
    };
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      if (token) {
        // Call logout endpoint
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state regardless of API response
      localStorage.removeItem("auth_token");
      setUser(null);
      router.push("/sign-in");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        sendOTP,
        verifyOTP,
        googleLogin,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}