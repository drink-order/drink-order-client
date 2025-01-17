"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "./firebase"; // Ensure this points to your Firebase initialization file
import { onAuthStateChanged, User } from "firebase/auth";
import { SessionProvider } from "next-auth/react";

type AuthContextType = {
  firebaseUser: User | null; // Firebase user context
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    // Monitor Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser }}>
      {/* Wrap in NextAuth SessionProvider */}
      <SessionProvider>{children}</SessionProvider>
    </AuthContext.Provider>
  );
};

// Hook for accessing Firebase user context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;