"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { SessionProvider } from "next-auth/react";

// Update context type to use `firebaseUser` instead of `user`
type AuthContextType = {
  firebaseUser: User | null;
};

const AuthContext = createContext<AuthContextType>({ firebaseUser: null });

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user || null);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser }}>
      {/* Wrap everything in the NextAuth SessionProvider */}
      <SessionProvider>{children}</SessionProvider>
    </AuthContext.Provider>
  );
};

// Custom hook to access Firebase user authentication context
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
