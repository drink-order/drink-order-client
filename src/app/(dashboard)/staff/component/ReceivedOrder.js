"use client";
import React, { useState, useEffect } from "react";
import { PiEyesDuotone, PiCookingPot } from "react-icons/pi";
import { HiSearch, HiRefresh, HiPlus } from "react-icons/hi";
import { MdVisibility, MdFastfood } from "react-icons/md";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const ReceivedOrder = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: 'preparing', label: 'Preparing', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ];

  // Sugar level display mapping
  const sugarLevelLabels = {
    '0%': 'No Sugar',
    '25%': 'Light Sweet',
    '50%': 'Half Sweet', 
    '75%': 'Less Sweet',
    '100%': 'Regular'
  };

  // Helper function to format date with time
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Helper function to sort orders
  const sortOrders = (ordersArray, sortType) => {
    return [...ordersArray].sort((a, b) => {
      if (sortType === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortType === "Oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortType === "ID Ascending") {
        return a.id - b.id;
      } else if (sortType === "ID Descending") {
        return b.id - a.id;
      } else if (sortType === "Amount High-Low") {
        return parseFloat(b.total_price) - parseFloat(a.total_price);
      } else if (sortType === "Amount Low-High") {
        return parseFloat(a.total_price) - parseFloat(b.total_price);
      }
      return 0;
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?status=preparing`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You don't have permission to view orders");
        }
        throw new Error(`Failed to fetch orders: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Fetched orders:", data);
      
      // Transform and sort orders - handle proper backend structure
      const transformedOrders = (data.orders || data)
        .filter(order => order.order_status === "preparing")
        .map(order => ({
          ...order,
          formattedDate: formatDateTime(order.created_at),
          formattedTotal: `$${parseFloat(order.total_price || 0).toFixed(2)}`,
          // Use correct relationship name from backend
          items: order.order_items || order.orderItems || [],
          customer_name: order.customer_name || order.user?.name || order.user?.username || 'Guest'
        }));

      const sortedOrders = sortOrders(transformedOrders, sortOption);
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [sortOption]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    // Sort current orders with new option
    const sortedOrders = sortOrders(orders, option);
    setOrders(sortedOrders);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          order_status: newStatus
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, order_status: newStatus }
            : order
        )
      );

      // Show success message
      const statusLabel = statusOptions.find(opt => opt.value === newStatus)?.label || newStatus;
      Swal.fire({
        title: 'Success!',
        text: `Order #${orderId} status updated to ${statusLabel}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      // If moved to different status, remove from current view
      if (newStatus !== 'preparing') {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      }

    } catch (error) {
      console.error('Error updating order status:', error);
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

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await res.json();
      const order = data.order || data;

      // Format order items for display - handle backend structure properly
      const items = order.order_items || order.orderItems || [];
      const itemsHtml = items.map(item => `
        <div style="text-align: left; margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
          <strong>${item.product_size?.product?.name || 'Unknown Product'}</strong><br>
          <small>Size: ${item.product_size?.size === 'none' ? 'Standard' : (item.product_size?.size || 'Standard')} | Quantity: ${item.quantity}</small><br>
          <small>Sugar Level: ${sugarLevelLabels[item.sugar_level] || item.sugar_level || 'Regular'}</small><br>
          ${item.toppings?.length > 0 ? `<small>Toppings: ${item.toppings.map(t => t.topping?.name).join(', ')}</small><br>` : ''}
          <small>Unit Price: $${parseFloat(item.unit_price || 0).toFixed(2)}</small>
        </div>
      `).join('') || '<p>No items found</p>';

      Swal.fire({
        title: `Order #${order.id} Details`,
        html: `
          <div style="text-align: left;">
            <p><strong>Customer:</strong> ${order.customer_name || order.user?.name || order.user?.username || 'Guest'}</p>
            <p><strong>Order Number:</strong> ${order.order_number || 'N/A'}</p>
            <p><strong>Date:</strong> ${formatDateTime(order.created_at)}</p>
            <p><strong>Status:</strong> <span style="background: #FEF3C7; color: #92400E; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Preparing</span></p>
            <p><strong>Total:</strong> $${parseFloat(order.total_price || 0).toFixed(2)}</p>
            <hr style="margin: 16px 0;">
            <h4>Order Items:</h4>
            ${itemsHtml}
          </div>
        `,
        width: '600px',
        confirmButtonText: 'Close',
        confirmButtonColor: '#3085d6',
      });

    } catch (error) {
      console.error('Error fetching order details:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load order details',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) =>
    String(order.id).includes(searchTerm) ||
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black flex items-center gap-2">
          <PiCookingPot className="text-yellow-600" />
          Order Management
        </h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">Preparing Orders ({filteredOrders.length})</h2>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Newest">Sort by: Newest</option>
              <option value="Oldest">Sort by: Oldest</option>
              <option value="ID Ascending">Sort by: ID Ascending</option>
              <option value="ID Descending">Sort by: ID Descending</option>
              <option value="Amount High-Low">Sort by: Amount High-Low</option>
              <option value="Amount Low-High">Sort by: Amount Low-High</option>
            </select>
            {/* Add New Order Button */}
            <button
              onClick={() => router.push("/staff/addnewdrinks")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              <HiPlus className="w-4 h-4" />
              Add New Order
            </button>
            {/* Refresh Button */}
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
              title="Refresh orders"
            >
              <HiRefresh className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={fetchOrders} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">
            {orders.length === 0 ? "No preparing orders found." : "No orders match your search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border border-gray-300 font-semibold">Order ID</th>
                <th className="p-3 border border-gray-300 font-semibold">Order Number</th>
                <th className="p-3 border border-gray-300 font-semibold">Customer</th>
                <th className="p-3 border border-gray-300 font-semibold">Date & Time</th>
                <th className="p-3 border border-gray-300 font-semibold">Items</th>
                <th className="p-3 border border-gray-300 font-semibold">Status</th>
                <th className="p-3 border border-gray-300 font-semibold">Total</th>
                <th className="p-3 border border-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 font-medium">#{order.id}</td>
                  <td className="p-3 border border-gray-300 font-medium">
                    {order.order_number || 'N/A'}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {order.customer_name}
                  </td>
                  <td className="p-3 border border-gray-300 text-sm">
                    <div className="whitespace-nowrap">
                      {order.formattedDate}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300 text-sm">
                    <div className="max-w-48 overflow-hidden">
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600 truncate">
                          {item.product_size?.product?.name || 'Unknown'} x{item.quantity}
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <div className="text-xs text-blue-600">
                          +{order.items.length - 2} more...
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <select 
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border border-gray-300 font-medium">
                    {order.formattedTotal}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order.id)}
                        className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                        disabled={loading}
                      >
                        <MdVisibility className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReceivedOrder;