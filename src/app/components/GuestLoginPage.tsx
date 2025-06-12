import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const GuestLogin = () => {
  const [loading, setLoading] = useState(false);
  const [invitationInfo, setInvitationInfo] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const tableFromUrl = searchParams.get('table');
    
    if (token) {
      checkInvitationValidity(token, tableFromUrl);
    } else {
      Swal.fire({
        title: 'Invalid Link',
        text: 'No invitation token found in the URL.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/');
      });
    }
  }, [searchParams, router]);

  const checkInvitationValidity = async (token, tableFromUrl) => {
    try {
      setLoading(true);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/invitation/${token}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to validate invitation');
      }

      const data = await res.json();
      console.log('Invitation data:', data);
      
      setInvitationInfo({
        ...data,
        token,
        tableFromUrl
      });

      // If we have table number (either from invitation or URL), auto-login
      const tableNumber = data.table_number || tableFromUrl;
      if (tableNumber) {
        await autoLogin(token, tableNumber, data);
      }

    } catch (error) {
      console.error('Error checking invitation:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/');
      });
    } finally {
      setLoading(false);
    }
  };

  const autoLogin = async (token, tableNumber, invitationData) => {
    try {
      setLoading(true);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/invitation/${token}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_number: tableNumber
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to authenticate');
      }

      const authData = await res.json();
      console.log('Authentication successful:', authData);

      // Store authentication data
      localStorage.setItem('auth_token', authData.token);
      localStorage.setItem('table_number', authData.table_number);
      localStorage.setItem('session_id', authData.session_id);
      localStorage.setItem('user_role', 'guest');

      // Show success message
      await Swal.fire({
        title: 'Welcome!',
        html: `
          <div class="text-center">
            <p class="mb-2">Successfully logged in to <strong>Table ${authData.table_number}</strong></p>
            <p class="text-sm text-gray-600">You can now browse the menu and place orders</p>
            <p class="text-xs text-gray-500 mt-2">Session expires: ${new Date(authData.expires_at).toLocaleString()}</p>
          </div>
        `,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });

      // Redirect to home page
      router.push('/'); // Redirect to home page after successful login

    } catch (error) {
      console.error('Auto-login failed:', error);
      
      // If auto-login fails, show manual table input
      showManualTableInput(token, invitationData);
    } finally {
      setLoading(false);
    }
  };

  const showManualTableInput = async (token, invitationData) => {
    const { value: tableNumber } = await Swal.fire({
      title: 'Enter Table Number',
      html: `
        <div class="text-center mb-4">
          <p class="text-sm text-gray-600 mb-2">Welcome to ${invitationData.restaurant || 'Restaurant'}</p>
          <p class="text-xs text-gray-500">Please enter your table number to continue</p>
        </div>
      `,
      input: 'text',
      inputLabel: 'Table Number',
      inputPlaceholder: 'Enter your table number (e.g., 1, A5, T12)',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Please enter a table number';
        }
        if (value.length > 10) {
          return 'Table number too long (max 10 characters)';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel'
    });

    if (tableNumber) {
      await autoLogin(token, tableNumber.trim(), invitationData);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating guest access...</p>
          {invitationInfo && (
            <p className="text-sm text-gray-500 mt-2">
              Table {invitationInfo.table_number || invitationInfo.tableFromUrl || '...'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // This component mainly handles the logic - the UI is mostly loading states and SweetAlert modals
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Guest Access</h1>
        <p className="text-gray-600">Processing your invitation...</p>
      </div>
    </div>
  );
};

export default GuestLogin;