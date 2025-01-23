"use client";
import React, { useState, useEffect } from "react";

const Overview = () => {
  const [staffCount, setStaffCount] = useState(0);
  const [totalDrinks, setTotalDrinks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [timeFrame, setTimeFrame] = useState("day");

  useEffect(() => {
    // Fetch all users and filter to get staff count
    const fetchStaffCount = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.statusText}`);
        }
        const data = await res.json();
        const staffMembers = data.filter(user => user.role === "staff");
        setStaffCount(staffMembers.length);
      } catch (error) {
        console.error("Error fetching staff count:", error);
      }
    };

    // Fetch total drinks from the API
    const fetchTotalDrinks = async () => {
      try {
        const res = await fetch("http://localhost:3000/shop-owner/api/drinks");
        if (!res.ok) {
          throw new Error(`Failed to fetch total drinks: ${res.statusText}`);
        }
        const data = await res.json();
        setTotalDrinks(data.drinks.length);
      } catch (error) {
        console.error("Error fetching total drinks:", error);
      }
    };

    // Fetch total orders based on the selected time frame
    const fetchTotalOrders = async () => {
      try {
        const res = await fetch(`/api/total-orders?timeFrame=${timeFrame}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch total orders: ${res.statusText}`);
        }
        const data = await res.json();
        setTotalOrders(data.count);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    fetchStaffCount();
    fetchTotalDrinks();
    fetchTotalOrders();
  }, [timeFrame]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Staff Count</h3>
          <p className="text-2xl">{staffCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Drinks</h3>
          <p className="text-2xl">{totalDrinks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{totalOrders}</p>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="mt-2 border rounded-md px-2 py-1"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Overview;