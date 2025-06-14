"use client";
import React, { useState, useEffect } from "react";
import { PiEyesDuotone, PiCheckCircle } from "react-icons/pi";
import { HiSearch, HiRefresh } from "react-icons/hi";
import { MdVisibility, MdReceipt, MdCheckCircle } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import Swal from "sweetalert2";

const Completed = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?status=completed`, {
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
      console.log("Fetched completed orders:", data);
      
      // Transform and sort orders - handle proper backend structure
      const transformedOrders = (data.orders || data)
        .filter(order => order.order_status === "completed")
        .map(order => ({
          ...order,
          formattedDate: formatDateTime(order.created_at),
          formattedTotal: `${parseFloat(order.total_price || 0).toFixed(2)}`,
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
          <small>Unit Price: ${parseFloat(item.unit_price || 0).toFixed(2)}</small>
        </div>
      `).join('') || '<p>No items found</p>';

      Swal.fire({
        title: `Order #${order.id} - Completed`,
        html: `
          <div style="text-align: left;">
            <p><strong>Customer:</strong> ${order.customer_name || order.user?.name || order.user?.username || 'Guest'}</p>
            <p><strong>Order Number:</strong> ${order.order_number || 'N/A'}</p>
            <p><strong>Date:</strong> ${formatDateTime(order.created_at)}</p>
            <p><strong>Status:</strong> <span style="background: #D1FAE5; color: #047857; padding: 2px 8px; border-radius: 12px; font-size: 12px;">✓ Completed</span></p>
            <p><strong>Total:</strong> ${parseFloat(order.total_price || 0).toFixed(2)}</p>
            <hr style="margin: 16px 0;">
            <h4>Order Items:</h4>
            ${itemsHtml}
            <hr style="margin: 16px 0;">
            <p style="color: #047857;"><strong>✓ This order has been completed and delivered.</strong></p>
          </div>
        `,
        width: '600px',
        confirmButtonText: 'Close',
        confirmButtonColor: '#10B981',
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

  const generateReceipt = async (orderId) => {
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

      // Calculate totals - handle backend structure properly
      const items = order.order_items || order.orderItems || [];
      const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.unit_price) * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax example
      const total = order.total_price || (subtotal + tax);

      // Generate receipt HTML
      const receiptHtml = `
        <div style="font-family: 'Courier New', monospace; max-width: 300px; margin: 0 auto; background: white; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-bottom: 15px;">
            <h2 style="margin: 0; font-size: 18px;">COFFEE SHOP</h2>
            <p style="margin: 5px 0; font-size: 12px;">Thank you for your order!</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 2px 0;"><strong>Order #:</strong> ${order.id}</p>
            <p style="margin: 2px 0;"><strong>Order Number:</strong> ${order.order_number || 'N/A'}</p>
            <p style="margin: 2px 0;"><strong>Date:</strong> ${formatDateTime(order.created_at)}</p>
            <p style="margin: 2px 0;"><strong>Customer:</strong> ${order.customer_name || order.user?.name || order.user?.username || 'Guest'}</p>
          </div>

          <div style="border-bottom: 1px dashed #333; padding-bottom: 10px; margin-bottom: 10px;">
            ${items.map(item => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${item.product_size?.product?.name || 'Unknown'}</span>
                  <span>${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</span>
                </div>
                <div style="font-size: 11px; color: #666;">
                  ${item.product_size?.size === 'none' ? 'Standard' : (item.product_size?.size || 'Standard')} x ${item.quantity}
                  <br>Sugar: ${sugarLevelLabels[item.sugar_level] || item.sugar_level || 'Regular'}
                  ${item.toppings?.length > 0 ? `<br>+ ${item.toppings.map(t => t.topping?.name).join(', ')}` : ''}
                </div>
              </div>
            `).join('') || '<p>No items</p>'}
          </div>

          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #333; padding-top: 5px; margin-top: 5px;">
              <span>TOTAL:</span>
              <span>${parseFloat(total).toFixed(2)}</span>
            </div>
          </div>

          <div style="text-align: center; border-top: 2px dashed #333; padding-top: 10px; font-size: 11px;">
            <p style="margin: 5px 0;">Status: COMPLETED ✓</p>
            <p style="margin: 5px 0;">Thank you for your business!</p>
            <p style="margin: 5px 0;">Please come again!</p>
          </div>
        </div>
      `;

      Swal.fire({
        title: 'Order Receipt',
        html: receiptHtml,
        width: '400px',
        showCancelButton: true,
        confirmButtonText: 'Print Receipt',
        cancelButtonText: 'Close',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
      }).then((result) => {
        if (result.isConfirmed) {
          // Create a new window for printing
          const printWindow = window.open('', '_blank');
          printWindow.document.write(`
            <html>
              <head><title>Order Receipt #${order.id}</title></head>
              <body style="margin: 0; padding: 20px;">
                ${receiptHtml}
                <script>window.print(); window.close();</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      });

    } catch (error) {
      console.error('Error generating receipt:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to generate receipt',
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
          <FiCheckCircle className="text-green-600" />
          Completed Orders
        </h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">All Completed Orders ({filteredOrders.length})</h2>
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
            {orders.length === 0 ? "No completed orders found." : "No orders match your search."}
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
                        <div className="text-xs text-green-600">
                          +{order.items.length - 2} more...
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                      <MdCheckCircle className="w-3 h-3" />
                      Completed
                    </span>
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
                        View
                      </button>
                      <button
                        onClick={() => generateReceipt(order.id)}
                        className="bg-gray-500 text-white hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                        disabled={loading}
                      >
                        <MdReceipt className="w-4 h-4" />
                        Receipt
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

export default Completed;