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

  // Helper function to check if input is email
  const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Helper function to normalize Cambodian phone number
  const normalizePhoneNumber = (phone) => {
    if (!phone) return phone;
    
    // Remove any spaces, dashes, or other characters except + and digits
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If starts with 0, replace with +855
    if (cleaned.startsWith('0')) {
      return '+855' + cleaned.slice(1);
    }
    
    // If starts with +855, keep as is
    if (cleaned.startsWith('+855')) {
      return cleaned;
    }
    
    // If starts with 855, add +
    if (cleaned.startsWith('855')) {
      return '+' + cleaned;
    }
    
    // If just the number without country code, add +855
    if (cleaned.length >= 8 && cleaned.length <= 9 && !cleaned.includes('+')) {
      return '+855' + cleaned;
    }
    
    return cleaned;
  };

  // Updated login function to handle both email and phone
  const login = async (loginData) => {
    try {
      // Transform the data to match Laravel expectations
      let requestBody;
      
      if (typeof loginData === 'object' && loginData.identifier) {
        // New format: { identifier: "email@example.com" or "012345678", password: "password" }
        const identifier = loginData.identifier.trim();
        
        console.log("=== LOGIN DEBUG ===");
        console.log("Original identifier:", identifier);
        
        if (isEmail(identifier)) {
          requestBody = {
            email: identifier.toLowerCase(),
            password: loginData.password
          };
          console.log("Detected as email");
        } else {
          // Normalize phone number for backend
          const normalizedPhone = normalizePhoneNumber(identifier);
          requestBody = {
            phone: normalizedPhone,
            password: loginData.password
          };
          console.log("Detected as phone, normalized to:", normalizedPhone);
        }
      } else if (typeof loginData === 'string') {
        // Old format: login(email, password) - keep for backward compatibility
        const email = loginData;
        const password = arguments[1];
        requestBody = { email, password };
        console.log("Legacy email format");
      } else {
        // Direct object format: { email: "...", password: "..." } or { phone: "...", password: "..." }
        requestBody = loginData;
        console.log("Direct object format");
      }

      console.log("Request body being sent:", requestBody);
      console.log("==================");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message,
          errors: data.errors
        };
      }

      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
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
        return { 
          success: false, 
          error: data.message,
          errors: data.errors
        };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Send OTP function - updated to include password parameter
  const sendOTP = async (phoneNumber, name, password = null) => {
    try {
      const requestBody = { 
        phone: phoneNumber,
        name: name
      };
      
      // Add password if provided (for registration flow)
      if (password) {
        requestBody.password = password;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-otp`,
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
        return { 
          success: false, 
          error: data.message,
          errors: data.errors
        };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verify OTP function - updated to include password
  const verifyOTP = async (phoneNumber, otp, userData = null) => {
    try {
      const requestBody = {
        phone: phoneNumber,
        otp: otp,
      };
      
      // If userData is provided, it's for registration
      if (userData) {
        requestBody.name = userData.name;
        
        // Get password from sessionStorage if available
        const tempPassword = sessionStorage.getItem('temp_registration_password');
        if (tempPassword) {
          requestBody.password = tempPassword;
          // Clear the temporary password
          sessionStorage.removeItem('temp_registration_password');
        }
      }

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
        return { 
          success: false, 
          error: data.message,
          errors: data.errors
        };
      }

      // If verification is successful, store the token and user
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        setUser(data.user);
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: error.message };
    }
  };

  // Google login function
  const googleLogin = () => {
    if (typeof window === 'undefined') return;
    
    const googleLoginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    
    // Only store redirect URL if it's not a sign-in related page
    const currentPath = window.location.pathname;
    if (currentPath !== '/sign-in' && currentPath !== '/sign-up' && currentPath !== '/auth/callback') {
      localStorage.setItem('auth_redirect_url', currentPath);
    } else {
      // Remove any existing redirect URL if we're on auth pages
      localStorage.removeItem('auth_redirect_url');
    }
    
    window.location.href = googleLoginUrl;
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