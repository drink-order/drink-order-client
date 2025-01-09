"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importing Next.js useRouter hook for redirect
import { signOut } from 'next-auth/react'; // Import NextAuth's signOut function

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Using the useRouter hook to manage the route

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Use NextAuth's signOut function without redirecting right away
      await signOut({ redirect: false }); // Do not automatically redirect here
      console.log('Successfully signed out');
      // // Manually redirect to /sign-in
      router.push('/sign-in');
    } catch (error) {
      console.error('Error during sign-out', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSignOut} disabled={loading}>
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
