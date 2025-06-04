"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (token) {
        try {
          localStorage.setItem('auth_token', token);
          await checkAuth();
          
          // Always redirect to home (simplest approach)
          setTimeout(() => {
            router.push('/');
          }, 500);
          
        } catch (err) {
          console.error('Error during auth callback:', err);
          router.push('/sign-in?error=' + encodeURIComponent('Authentication failed'));
        }
      } else if (error) {
        console.error('Google auth error:', error);
        router.push('/sign-in?error=' + encodeURIComponent(error));
      } else {
        router.push('/sign-in?error=' + encodeURIComponent('Invalid authentication response'));
      }
    };

    const timer = setTimeout(handleCallback, 100);
    return () => clearTimeout(timer);
  }, [searchParams, router, checkAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing authentication...</h2>
        <p className="text-gray-600">Please wait while we sign you in.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}