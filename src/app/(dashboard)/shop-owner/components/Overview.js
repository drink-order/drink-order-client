"use client";
import React, { useState, useEffect } from "react";

const Overview = () => {
  const [dashboardData, setDashboardData] = useState({
    staff_count: 0,
    products: { total: 0, available: 0 },
    orders: { completed: 0 },
    revenue: { total: 0 },
    popular_products: [],
    recent_orders: [],
    chart_data: { orders_by_date: [] }
  });
  const [timeFrame, setTimeFrame] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [singleDate, setSingleDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get period label
  const getPeriodLabel = () => {
    switch(timeFrame) {
      case 'day': return 'Today';
      case 'week': return 'This week';
      case 'month': return 'This month';
      case 'year': return 'This year';
      case 'single': return `On ${singleDate}`;
      case 'custom': return `${startDate} to ${endDate}`;
      default: return '';
    }
  };

  useEffect(() => {
   const fetchDashboardData = async () => {
     try {
       setLoading(true);
       setError(null);

       const token = localStorage.getItem("auth_token");

       // Determine the actual period and dates to send to the backend
       let periodToSend = timeFrame;
       let startParam = startDate;
       let endParam = endDate;

       if (timeFrame === 'single' && singleDate) {
         // When 'single' is selected, treat it as a custom range for the backend
         periodToSend = 'custom';
         startParam = singleDate;
         endParam = singleDate;
       }

       let url = `${process.env.NEXT_PUBLIC_API_URL}/dashboard?period=${periodToSend}`;

       if (periodToSend === 'custom' && startParam && endParam) {
         url += `&start_date=${startParam}&end_date=${endParam}`;
       }
       // The 'else if' for singleDate is no longer needed here as it's handled by 'custom'

       const res = await fetch(url, {
         method: "GET",
         headers: {
           "Authorization": `Bearer ${token}`,
           "Accept": "application/json",
           "Content-Type": "application/json",
         },
         credentials: "include",
       });

       if (!res.ok) {
         throw new Error(`Failed to fetch dashboard data: ${res.statusText}`);
       }

       const data = await res.json();
       setDashboardData(data);
     } catch (error) {
       console.error("Error fetching dashboard data:", error);
       setError(error.message);
     } finally {
       setLoading(false);
     }
   };

    // Only fetch if we have required dates for custom/single periods
    // This condition needs to be adjusted slightly to account for the new logic
    if (timeFrame === 'custom' && (!startDate || !endDate)) {
      return;
    }
    // If timeFrame is 'single', we still need singleDate
    if (timeFrame === 'single' && !singleDate) {
        return;
    }


    fetchDashboardData();
  }, [timeFrame, startDate, endDate, singleDate]); // Dependencies remain the same

  if (loading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      
      {/* Time Frame Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Time Period:</label>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="border rounded-md px-3 py-2 mr-4"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
          <option value="single">Single Date</option>
          <option value="custom">Custom Range</option>
        </select>

        {/* Single Date Picker */}
        {timeFrame === 'single' && (
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Select Date:</label>
            <input
              type="date"
              value={singleDate}
              onChange={(e) => setSingleDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
          </div>
        )}

        {/* Custom Date Range Pickers */}
        {timeFrame === 'custom' && (
          <div className="mt-2 flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* Show message for incomplete custom/single selection */}
        {timeFrame === 'custom' && (!startDate || !endDate) && (
          <p className="text-sm text-gray-500 mt-2">Please select both start and end dates</p>
        )}
        {timeFrame === 'single' && !singleDate && (
          <p className="text-sm text-gray-500 mt-2">Please select a date</p>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Staff Count</h3>
          <p className="text-2xl font-bold text-blue-600">{dashboardData.staff_count}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl font-bold text-green-600">{dashboardData.products.total}</p>
          <p className="text-sm text-gray-600">({dashboardData.products.available} available)</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Completed Orders</h3>
          <p className="text-2xl font-bold text-purple-600">{dashboardData.orders.completed}</p>
          <p className="text-sm text-gray-600">({timeFrame === 'all' ? 'All time' : getPeriodLabel()})</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-yellow-600">
            ${Number(dashboardData.revenue.total || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">({timeFrame === 'all' ? 'All time' : getPeriodLabel()})</p>
        </div>
      </div>

      {/* Popular Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Popular Products</h3>
          {dashboardData.popular_products.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.popular_products.map((product, index) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="font-medium">{index + 1}. {product.name}</span>
                  <span className="text-gray-600">{product.total_quantity} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
          {dashboardData.recent_orders.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.recent_orders.map((order) => (
                <div key={order.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Order #{order.id}</span>
                    <span className="text-gray-600">${order.total_price}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.user?.name || 'Guest'} - {order.order_status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent orders</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;