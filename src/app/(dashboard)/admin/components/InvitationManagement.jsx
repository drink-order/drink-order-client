"use client";
import React, { useState, useEffect } from "react";
import { HiSearch, HiPlus, HiQrcode, HiTrash, HiClipboard } from "react-icons/hi";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const InvitationManagement = () => {
  const [invitations, setInvitations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/invitations`, {
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
      console.log("API Response:", data); // Debug log to see the structure
      
      // Handle different API response structures
      const invitationsArray = Array.isArray(data) ? data : (data.data || data.invitations || []);
      
      if (!Array.isArray(invitationsArray)) {
        throw new Error("Invalid response format - expected array of invitations");
      }
      
      const invitationsWithDates = invitationsArray.map(invitation => ({
        ...invitation,
        created_at: invitation.created_at || new Date().toISOString(),
        expires_at: invitation.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));
      
      const sortedInvitations = invitationsWithDates.sort((a, b) => 
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
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchInvitations();
    } else if (user && user.role !== "admin") {
      router.push("/");
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

  const handleCreateInvitation = async () => {
    try {
      // First, prompt for table number
      const { value: tableNumber } = await Swal.fire({
        title: 'Create Table Invitation',
        input: 'text',
        inputLabel: 'Table Number',
        inputPlaceholder: 'Enter table number (e.g., T1, A5, 12)',
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
        confirmButtonText: 'Create Invitation',
        cancelButtonText: 'Cancel'
      });

      if (!tableNumber) {
        return; // User cancelled
      }

      setLoading(true);
      
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/invitations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          table_number: tableNumber.trim()
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        
        // Handle specific error cases
        if (res.status === 409) {
          // Table already has an active invitation
          const result = await Swal.fire({
            title: 'Table Already Active',
            text: `Table ${tableNumber} already has an active invitation. Would you like to view the existing invitation or revoke it and create a new one?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'View Existing',
            cancelButtonText: 'Cancel',
            showDenyButton: true,
            denyButtonText: 'Revoke & Create New',
            denyButtonColor: '#d33',
          });

          if (result.isConfirmed) {
            // Scroll to and highlight the existing invitation
            const existingInvitation = errorData.existing_invitation;
            if (existingInvitation) {
              // Find the invitation in the current list and highlight it
              const invitationElement = document.querySelector(`[data-token="${existingInvitation.token}"]`);
              if (invitationElement) {
                invitationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                invitationElement.classList.add('ring-2', 'ring-yellow-400', 'ring-opacity-75');
                setTimeout(() => {
                  invitationElement.classList.remove('ring-2', 'ring-yellow-400', 'ring-opacity-75');
                }, 3000);
              }
            }
            return;
          } else if (result.isDenied) {
            // Revoke the existing invitation and create a new one
            try {
              await handleDeleteInvitation(errorData.existing_invitation.token, errorData.existing_invitation.created_at);
              // Recursively call create invitation after successful deletion
              await handleCreateInvitation();
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
      
      setInvitations(prevInvitations => {
        const updated = [newInvitation, ...prevInvitations];
        return updated.sort((a, b) => {
          if (sortOption === "Newest") {
            return new Date(b.created_at) - new Date(a.created_at);
          } else {
            return new Date(a.created_at) - new Date(b.created_at);
          }
        });
      });
      
      await Swal.fire({
        title: 'Success!',
        html: `
          <div class="text-center">
            <p class="mb-2">Invitation created for <strong>Table ${tableNumber}</strong></p>
            <p class="text-sm text-gray-600">Expires: ${new Date(newInvitation.expires_at).toLocaleDateString()} at ${new Date(newInvitation.expires_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        `,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error creating invitation:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvitation = async (token, created_at) => {
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: `This will permanently revoke the invitation created on ${new Date(created_at).toLocaleDateString()}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, revoke!',
        cancelButtonText: 'Cancel',
      });

      if (confirmed.isConfirmed) {
        setLoading(true);
        
        const authToken = localStorage.getItem("auth_token");
        
        if (!authToken) {
          throw new Error("Authentication token not found");
        }
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/invitations/${token}`, {
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
        
        setInvitations(invitations.filter(invitation => invitation.token !== token));
        
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
    } finally {
      setLoading(false);
    }
  };

  const copyInvitationLink = (invitation) => {
    const tableParam = invitation.table_number ? `&table=${encodeURIComponent(invitation.table_number)}` : '';
    const link = `${window.location.origin}/guest-login?token=${invitation.token}${tableParam}`;
    navigator.clipboard.writeText(link);
    Swal.fire({
      title: 'Link Copied!',
      text: link,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  };

  const generateQRCode = async (token) => {
    try {
      const authToken = localStorage.getItem("auth_token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/invitations/${token}/qrcode`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "image/svg+xml", // Accept SVG directly
        },
        credentials: "include",
      });
      
      console.log("QR Code Response Status:", res.status);
      console.log("QR Code Response Headers:", res.headers.get('content-type'));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log("QR Code Error Response:", errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const contentType = res.headers.get('content-type');
      console.log("Content Type:", contentType);
      
      // Handle SVG response
      if (contentType && contentType.includes('image/svg+xml')) {
        const svgText = await res.text();
        console.log("SVG Response received successfully");
        
        // Create SVG data URL for display and download
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svgText);
        
        // Get the invitation to build the correct URL with table number
        const invitation = invitations.find(inv => inv.token === token);
        const tableParam = invitation?.table_number ? `&table=${encodeURIComponent(invitation.table_number)}` : '';
        const invitationUrl = `${window.location.origin}/guest-login?token=${token}${tableParam}`;
        
        // Show QR code in modal
        await Swal.fire({
          title: 'QR Code for Guest Access',
          html: `
            <div class="text-center">
              <div class="mx-auto mb-4 inline-block" style="max-width: 300px;">
                ${svgText}
              </div>
              <p class="text-sm text-gray-600 mb-2">Guests can scan this QR code to access Table ${invitation?.table_number || 'N/A'}</p>
              <p class="text-xs text-gray-500 break-all">Link: ${invitationUrl}</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Download QR Code',
          cancelButtonText: 'Close',
          width: '450px'
        }).then((result) => {
          if (result.isConfirmed) {
            // Create download link for SVG
            const link = document.createElement('a');
            link.href = svgDataUrl;
            link.download = `table-${invitation?.table_number || 'unknown'}-qr-code.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        });
        
      } else {
        // If it's not SVG, try to handle as JSON (fallback)
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          
          if (!data.qr_code || !data.invitation_url) {
            throw new Error("Invalid QR code response format");
          }
          
          // Show QR code in modal (JSON format)
          await Swal.fire({
            title: 'QR Code for Guest Access',
            html: `
              <div class="text-center">
                <img src="${data.qr_code}" alt="QR Code" class="mx-auto mb-4" style="max-width: 300px;">
                <p class="text-sm text-gray-600 mb-2">Guests can scan this QR code to access the ordering system</p>
                <p class="text-xs text-gray-500 break-all">Link: ${data.invitation_url}</p>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Download QR Code',
            cancelButtonText: 'Close',
            width: '450px'
          }).then((result) => {
            if (result.isConfirmed) {
              const link = document.createElement('a');
              link.href = data.qr_code;
              link.download = `qr-code-${token}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          });
        } catch (parseError) {
          throw new Error(`Unexpected response format. Content-Type: ${contentType}`);
        }
      }
      
    } catch (error) {
      console.error("Error generating QR code:", error);
      
      let errorMessage = 'Failed to generate QR code';
      if (error.message.includes('404')) {
        errorMessage = 'QR code endpoint not found. Please check if the route exists in your Laravel backend.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please check your Laravel backend logs.';
      } else if (error.message.includes('Unexpected response format')) {
        errorMessage = 'Server returned unexpected format. Expected SVG or JSON response.';
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

  const filteredInvitations = invitations.filter((invitation) =>
    invitation.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(invitation.created_at).toLocaleDateString().includes(searchTerm) ||
    (invitation.table_number && invitation.table_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
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
          onClick={fetchInvitations} 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Guest Access Management</h1>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-black">Active Invitations ({filteredInvitations.length})</h2>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search invitations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
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
            {/* Create Button */}
            <button
              onClick={handleCreateInvitation}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <HiPlus className="w-4 h-4" />
              Create Invitation
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredInvitations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">
            {invitations.length === 0 ? "No invitation links created yet." : "No invitations match your search."}
          </p>
          {invitations.length === 0 && (
            <button
              onClick={handleCreateInvitation}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
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
              <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border border-gray-300 font-semibold">Token</th>
                    <th className="p-3 border border-gray-300 font-semibold">Table</th>
                    <th className="p-3 border border-gray-300 font-semibold">Status</th>
                    <th className="p-3 border border-gray-300 font-semibold">Created</th>
                    <th className="p-3 border border-gray-300 font-semibold">Expires</th>
                    <th className="p-3 border border-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((invitation) => (
                    <tr key={invitation.token} className="hover:bg-gray-50" data-token={invitation.token}>
                      <td className="p-3 border border-gray-300 font-mono text-sm">
                        <div className="truncate max-w-32" title={invitation.token}>
                          {invitation.token.substring(0, 12)}...
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
                      <td className="p-3 border border-gray-300 text-xs">
                        <div className="whitespace-nowrap">
                          <div>{new Date(invitation.expires_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(invitation.expires_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => generateQRCode(invitation.token)}
                            className="bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            disabled={loading}
                            title="Generate QR Code"
                          >
                            <HiQrcode className="w-3 h-3" />
                            QR
                          </button>
                          <button
                            onClick={() => copyInvitationLink(invitation)}
                            className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            disabled={loading}
                            title="Copy Invitation Link"
                          >
                            <HiClipboard className="w-3 h-3" />
                            Copy
                          </button>
                          <button
                            onClick={() => handleDeleteInvitation(invitation.token, invitation.created_at)}
                            className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                            disabled={loading}
                          >
                            <HiTrash className="w-3 h-3" />
                            Revoke
                          </button>
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
              <div key={invitation.token} className="bg-white border border-gray-300 rounded-lg p-4" data-token={invitation.token}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-black font-mono text-sm">
                      {invitation.token.substring(0, 16)}...
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        isExpired(invitation.expires_at) 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isExpired(invitation.expires_at) ? 'Expired' : 'Active'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Table: {invitation.table_number || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div>Created: {new Date(invitation.created_at).toLocaleDateString()} at {new Date(invitation.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  <div>Expires: {new Date(invitation.expires_at).toLocaleDateString()} at {new Date(invitation.expires_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => generateQRCode(invitation.token)}
                    className="bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                    title="Generate QR Code"
                  >
                    <HiQrcode className="w-3 h-3" />
                    QR
                  </button>
                  <button
                    onClick={() => copyInvitationLink(invitation)}
                    className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                    title="Copy Link"
                  >
                    <HiClipboard className="w-3 h-3" />
                    Copy
                  </button>
                  <button
                    onClick={() => handleDeleteInvitation(invitation.token, invitation.created_at)}
                    className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <HiTrash className="w-3 h-3" />
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InvitationManagement;