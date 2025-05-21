"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Import your custom auth hook

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth(); // Use your custom auth hook

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Use your custom logout function
      await logout();
      console.log('Successfully signed out');
      // The router.push is now handled in your logout function
      // so you don't need to redirect manually here
    } catch (error) {
      console.error('Error during sign-out', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSignOut} 
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}