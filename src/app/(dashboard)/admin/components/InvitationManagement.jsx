"use client";
import React, { useState, useEffect } from "react";
import { HiSearch, HiPlus, HiQrcode, HiTrash, HiClipboard, HiRefresh } from "react-icons/hi";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const InvitationManagement = () => {
  const [invitations, setInvitations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Separate state for refresh
  const { user } = useAuth();
  const router = useRouter();

  // Check if user has permission (matching your existing backend roles)
  const hasCreatePermission = user && ['admin', 'shop_owner'].includes(user.role);
  const hasViewPermission = user && ['admin', 'shop_owner', 'staff'].includes(user.role);

  const fetchInvitations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Use your existing endpoint structure
      const endpoint = user.role === 'admin' 
        ? '/admin/invitations' 
        : user.role === 'shop_owner' 
        ? '/shop/invitations' 
        : '/staff/invitations';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You don't have permission to access this resource");
        }
        throw new Error(`Failed to fetch invitations: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("API Response:", data);
      
      // Your backend returns array directly (based on your controller)
      const invitationsArray = Array.isArray(data) ? data : [];
      
      if (!Array.isArray(invitationsArray)) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format - expected array of invitations");
      }
      
      // Ensure all invitations have required fields with defaults
      const invitationsWithDefaults = invitationsArray.map(invitation => ({
        ...invitation,
        // Map your backend fields to frontend expectations
        id: invitation.id || invitation.token,
        token: invitation.token,
        table_number: invitation.table_number || 'N/A',
        created_at: invitation.created_at || new Date().toISOString(),
        expires_at: invitation.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        user_id: invitation.user_id,
        role: invitation.role || 'guest'
      }));
      
      const sortedInvitations = invitationsWithDefaults.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setInvitations(sortedInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setError(error.message);
      
      if (error.message.includes("Authentication") || error.message.includes("permission")) {
        router.push("/sign-in");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (!hasViewPermission) {
        router.push("/");
        return;
      }
      fetchInvitations();
    }
  }, [user, router]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedInvitations = [...invitations].sort((a, b) => {
      if (option === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });
    setInvitations(sortedInvitations);
  };

  const validateTableNumber = (tableNumber) => {
    if (!tableNumber || tableNumber.trim() === '') {
      return 'Please enter a table number';
    }
    if (tableNumber.length > 10) {
      return 'Table number too long (max 10 characters)';
    }
    return null;
  };

const handleCreateInvitation = async () => {
  if (!hasCreatePermission) {
    Swal.fire({
      title: 'Access Denied',
      text: 'You do not have permission to create invitations',
      icon: 'error'
    });
    return;
  }

  try {
    // Prompt for table number
    const { value: tableNumber } = await Swal.fire({
      title: 'Create Table Invitation',
      input: 'text',
      inputLabel: 'Table Number',
      inputPlaceholder: 'Enter table number (e.g., T1, A5, 12)',
      inputValidator: validateTableNumber,
      showCancelButton: true,
      confirmButtonText: 'Create Invitation',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const input = Swal.getInput();
        if (input) {
          input.focus();
          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              Swal.clickConfirm();
            }
          });
        }
      }
    });

    if (!tableNumber) {
      return; // User cancelled
    }

    setCreating(true);
    
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      throw new Error("Authentication token not found");
    }
    
    // Use your existing endpoint
    const endpoint = user.role === 'admin' ? '/admin/invitations' : '/shop/invitations';
    
    // FIXED: Send the request body that matches your backend expectations
    const requestBody = {
      table_number: tableNumber.trim()
      // Remove the role field - let your backend set it
      // Your backend controller sets role: 'guest' internally
    };

    console.log('Creating invitation with:', requestBody);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      
      // Handle your backend's 409 conflict response
      if (res.status === 409) {
        const result = await Swal.fire({
          title: 'Table Already Active',
          html: `
            <div class="text-center">
              <p class="mb-3">Table <strong>${tableNumber}</strong> already has an active invitation.</p>
              <p class="text-sm text-gray-600">What would you like to do?</p>
            </div>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'View Existing',
          cancelButtonText: 'Cancel',
          showDenyButton: true,
          denyButtonText: 'Revoke & Create New',
          denyButtonColor: '#d33',
        });

        if (result.isConfirmed) {
          // Highlight existing invitation
          const existingInvitation = errorData.existing_invitation;
          if (existingInvitation) {
            highlightInvitation(existingInvitation.token);
          }
          return;
        } else if (result.isDenied) {
          // Revoke existing and create new
          try {
            await handleDeleteInvitation(errorData.existing_invitation.token, false);
            setTimeout(() => handleCreateInvitation(), 500);
            return;
          } catch (revokeError) {
            throw new Error(`Failed to revoke existing invitation: ${revokeError.message}`);
          }
        } else {
          return; // User cancelled
        }
      }
      
      throw new Error(errorData.message || "Failed to create invitation");
    }
    
    const newInvitation = await res.json();
    console.log('New invitation created:', newInvitation);
    
    // Your backend returns the invitation object directly
    // Add to state with proper structure
    const invitationWithDefaults = {
      ...newInvitation,
      id: newInvitation.id || newInvitation.token,
      token: newInvitation.token,
      table_number: newInvitation.table_number,
      created_at: newInvitation.created_at,
      expires_at: newInvitation.expires_at,
      user_id: newInvitation.user_id
    };
    
    setInvitations(prevInvitations => {
      const updated = [invitationWithDefaults, ...prevInvitations];
      return updated.sort((a, b) => {
        if (sortOption === "Newest") {
          return new Date(b.created_at) - new Date(a.created_at);
        } else {
          return new Date(a.created_at) - new Date(b.created_at);
        }
      });
    });
    
    // Success message
    await Swal.fire({
      title: 'Success!',
      html: `
        <div class="text-center">
          <p class="mb-2">Invitation created for <strong>Table ${tableNumber}</strong></p>
          <p class="text-sm text-gray-600">Token: <code class="bg-gray-100 px-2 py-1 rounded">${newInvitation.token.substring(0, 8)}...</code></p>
        </div>
      `,
      icon: 'success',
      timer: 4000,
      showConfirmButton: true,
      confirmButtonText: 'Great!'
    });

    // Highlight the new invitation
    setTimeout(() => highlightInvitation(newInvitation.token), 100);
    
  } catch (error) {
    console.error("Error creating invitation:", error);
    
    // Better error handling for database constraint errors
    let errorMessage = error.message;
    if (error.message.includes('SQLSTATE[23514]') || error.message.includes('check constraint')) {
      errorMessage = 'Database configuration error. Please contact your administrator.';
    } else if (error.message.includes('user_invitations_role_check')) {
      errorMessage = 'Invalid role configuration. Please check your database settings.';
    }
    
    Swal.fire({
      title: 'Error!',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  } finally {
    setCreating(false);
  }
};

  const highlightInvitation = (token) => {
    const invitationElement = document.querySelector(`[data-token="${token}"]`);
    if (invitationElement) {
      invitationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      invitationElement.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-75', 'bg-blue-50');
      setTimeout(() => {
        invitationElement.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-75', 'bg-blue-50');
      }, 3000);
    }
  };

  const handleDeleteInvitation = async (token, showConfirmation = true) => {
    if (!hasCreatePermission) {
      Swal.fire({
        title: 'Access Denied',
        text: 'You do not have permission to revoke invitations',
        icon: 'error'
      });
      return;
    }

    try {
      const invitation = invitations.find(inv => inv.token === token);
      
      if (showConfirmation) {
        const confirmed = await Swal.fire({
          title: 'Are you sure?',
          html: `
            <div class="text-center">
              <p>This will permanently revoke the invitation for:</p>
              <p class="mt-2"><strong>Table ${invitation?.table_number || 'N/A'}</strong></p>
              <p class="text-sm text-gray-600">Created: ${new Date(invitation?.created_at).toLocaleDateString()}</p>
            </div>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, revoke!',
          cancelButtonText: 'Cancel',
        });

        if (!confirmed.isConfirmed) {
          return;
        }
      }

      const authToken = localStorage.getItem("auth_token");
      
      if (!authToken) {
        throw new Error("Authentication token not found");
      }
      
      // Use your existing revoke endpoint
      const endpoint = user.role === 'admin' ? `/admin/invitations/${token}` : `/shop/invitations/${token}`;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to revoke invitation");
      }
      
      // Remove from state
      setInvitations(invitations.filter(invitation => invitation.token !== token));
      
      if (showConfirmation) {
        await Swal.fire({
          title: 'Revoked!',
          text: 'The invitation has been revoked.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error revoking invitation:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const copyInvitationLink = (invitation) => {
    const tableParam = invitation.table_number ? `&table=${encodeURIComponent(invitation.table_number)}` : '';
    const link = `${window.location.origin}/guest-login?token=${invitation.token}${tableParam}`;
    
    navigator.clipboard.writeText(link).then(() => {
      Swal.fire({
        title: 'Link Copied!',
        html: `
          <div class="text-center">
            <p class="mb-2">Invitation link copied to clipboard</p>
            <p class="text-xs bg-gray-100 p-2 rounded break-all">${link}</p>
          </div>
        `,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        width: '400px'
      });
    }).catch(() => {
      // Fallback for older browsers
      Swal.fire({
        title: 'Copy Link',
        input: 'text',
        inputValue: link,
        inputAttributes: {
          readonly: true,
          style: 'font-size: 12px;'
        },
        text: 'Copy the link below:',
        showConfirmButton: true,
        confirmButtonText: 'Close'
      });
    });
  };

  const generateQRCode = async (token) => {
    try {
      const authToken = localStorage.getItem("auth_token");
      
      // Use your existing QR endpoint
      const endpoint = user.role === 'admin' 
        ? `/admin/invitations/${token}/qrcode` 
        : `/shop/invitations/${token}/qrcode`;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "image/svg+xml", // Your backend returns SVG
        },
        credentials: "include",
      });
      
      console.log("QR Code Response Status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log("QR Code Error Response:", errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const contentType = res.headers.get('content-type');
      console.log("Content Type:", contentType);
      
      // Handle SVG response (your backend returns this)
      if (contentType && contentType.includes('image/svg+xml')) {
        const svgText = await res.text();
        console.log("SVG Response received successfully");
        
        // Create SVG data URL for download
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
        
        // Get the invitation details
        const invitation = invitations.find(inv => inv.token === token);
        const tableParam = invitation?.table_number ? `&table=${encodeURIComponent(invitation.table_number)}` : '';
        const invitationUrl = `${window.location.origin}/guest-login?token=${token}${tableParam}`;
        
        // Show QR code in modal
        await Swal.fire({
          title: `QR Code - Table ${invitation?.table_number || 'N/A'}`,
          html: `
            <div class="text-center">
              <div class="mx-auto mb-4 inline-block p-4 bg-white border rounded-lg" style="max-width: 320px;">
                ${svgText}
              </div>
              <p class="text-sm text-gray-600 mb-2">Guests can scan this QR code to access the ordering system</p>
              <p class="text-xs text-gray-500 break-all bg-gray-100 p-2 rounded">${invitationUrl}</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Download SVG',
          cancelButtonText: 'Close',
          width: '500px'
        }).then((result) => {
          if (result.isConfirmed) {
            // Download SVG
            const link = document.createElement('a');
            link.href = svgDataUrl;
            link.download = `table-${invitation?.table_number || 'unknown'}-qr-code.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            Swal.fire({
              title: 'Downloaded!',
              text: 'QR code has been downloaded as SVG file',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
        
      } else {
        // Fallback: If backend returns different format, try to handle as redirect
        if (res.redirected) {
          // Backend is redirecting to Google Charts (your fallback)
          window.open(res.url, '_blank');
        } else {
          throw new Error(`Unexpected content type: ${contentType}`);
        }
      }
      
    } catch (error) {
      console.error("Error generating QR code:", error);
      
      let errorMessage = 'Failed to generate QR code';
      if (error.message.includes('404')) {
        errorMessage = 'QR code endpoint not found. Please contact your administrator.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const filteredInvitations = invitations.filter((invitation) =>
    invitation.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(invitation.created_at).toLocaleDateString().includes(searchTerm) ||
    (invitation.table_number && invitation.table_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasViewPermission) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-500">Access denied. You don't have permission to view invitations.</p>
      </div>
    );
  }

  if (loading && invitations.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading invitations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => fetchInvitations()} 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
        >
          <HiRefresh className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Guest Access Management</h1>
            <p className="text-gray-600 mt-1">Create and manage table invitations for guests</p>
          </div>
          <button
            onClick={() => fetchInvitations(true)}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center gap-2"
            disabled={refreshing}
            title="Refresh invitations"
          >
            <HiRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-black">
            Active Invitations ({filteredInvitations.length})
            {invitations.filter(inv => !isExpired(inv.expires_at)).length !== invitations.length && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({invitations.filter(inv => !isExpired(inv.expires_at)).length} active)
              </span>
            )}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by token, table, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Newest">Sort by: Newest</option>
              <option value="Oldest">Sort by: Oldest</option>
            </select>
            
            {/* Create Button - Only show for admin/shop_owner */}
            {hasCreatePermission && (
              <button
                onClick={handleCreateInvitation}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={creating}
              >
                <HiPlus className="w-4 h-4" />
                {creating ? 'Creating...' : 'Create Invitation'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredInvitations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {invitations.length === 0 ? "No invitations created yet" : "No invitations match your search"}
          </h3>
          <p className="text-gray-600 mb-4">
            {invitations.length === 0 
              ? "Create your first table invitation to get started" 
              : "Try adjusting your search terms"
            }
          </p>
          {invitations.length === 0 && hasCreatePermission && (
            <button
              onClick={handleCreateInvitation}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              disabled={creating}
            >
              Create Your First Invitation
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border border-gray-300 font-semibold">Token</th>
                    <th className="p-3 border border-gray-300 font-semibold">Table</th>
                    <th className="p-3 border border-gray-300 font-semibold">Status</th>
                    <th className="p-3 border border-gray-300 font-semibold">Created</th>
                    <th className="p-3 border border-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((invitation) => (
                    <tr 
                      key={invitation.token} 
                      className={`hover:bg-gray-50 transition-colors ${
                        isExpired(invitation.expires_at) ? 'opacity-60' : ''
                      }`} 
                      data-token={invitation.token}
                    >
                      <td className="p-3 border border-gray-300 font-mono text-sm">
                        <div className="flex items-center justify-center">
                          <span className="truncate max-w-32" title={invitation.token}>
                            {invitation.token.substring(0, 12)}...
                          </span>
                          <button
                            onClick={() => copyInvitationLink(invitation)}
                            className="ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Copy token"
                          >
                            <HiClipboard className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {invitation.table_number || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isExpired(invitation.expires_at) 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isExpired(invitation.expires_at) ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-300 text-xs">
                        <div className="whitespace-nowrap">
                          <div>{new Date(invitation.created_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(invitation.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => generateQRCode(invitation.token)}
                            className="bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1 disabled:opacity-50"
                            disabled={isExpired(invitation.expires_at)}
                            title="Generate QR Code"
                          >
                            <HiQrcode className="w-3 h-3" />
                            QR
                          </button>
                          <button
                            onClick={() => copyInvitationLink(invitation)}
                            className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            title="Copy Invitation Link"
                          >
                            <HiClipboard className="w-3 h-3" />
                            Copy
                          </button>
                          {/* Only show revoke button for users with create permission */}
                          {hasCreatePermission && (
                            <button
                              onClick={() => handleDeleteInvitation(invitation.token, invitation.created_at)}
                              className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            >
                              <HiTrash className="w-3 h-3" />
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-3">
            {filteredInvitations.map((invitation) => (
              <div 
                key={invitation.token} 
                className={`bg-white border border-gray-300 rounded-lg p-4 transition-all ${
                  isExpired(invitation.expires_at) ? 'opacity-60' : ''
                }`} 
                data-token={invitation.token}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-black font-mono text-sm">
                        {invitation.token.substring(0, 16)}...
                      </h3>
                      <button
                        onClick={() => copyInvitationLink(invitation)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Copy token"
                      >
                        <HiClipboard className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        isExpired(invitation.expires_at) 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isExpired(invitation.expires_at) ? 'Expired' : 'Active'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Table: {invitation.table_number || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(invitation.created_at).toLocaleDateString()} at {new Date(invitation.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => generateQRCode(invitation.token)}
                    className="bg-green-500 text-white hover:bg-green-600 px-3 py-2 rounded text-sm flex items-center gap-1 disabled:opacity-50 transition-colors"
                    disabled={isExpired(invitation.expires_at)}
                    title="Generate QR Code"
                  >
                    <HiQrcode className="w-4 h-4" />
                    QR Code
                  </button>
                  <button
                    onClick={() => copyInvitationLink(invitation)}
                    className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded text-sm flex items-center gap-1 transition-colors"
                    title="Copy Link"
                  >
                    <HiClipboard className="w-4 h-4" />
                    Copy Link
                  </button>
                  {/* Only show revoke button for users with create permission */}
                  {hasCreatePermission && (
                    <button
                      onClick={() => handleDeleteInvitation(invitation.token, invitation.created_at)}
                      className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded text-sm flex items-center gap-1 transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Statistics Footer */}
      {invitations.length > 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{invitations.length}</div>
              <div className="text-sm text-gray-600">Total Invitations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {invitations.filter(inv => !isExpired(inv.expires_at)).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {invitations.filter(inv => isExpired(inv.expires_at)).length}
              </div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(invitations.map(inv => inv.table_number)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Tables</div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for better styling */}
      <style jsx global>{`
        .swal2-input {
          text-transform: uppercase;
        }
        .swal2-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .swal2-html-container {
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default InvitationManagement;