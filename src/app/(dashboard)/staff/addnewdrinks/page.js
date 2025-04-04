"use client";
import React, { useState } from "react";

const AddNewDrinks = () => {
  const [drink, setDrink] = useState({
    name: "",
    sugarLevel: "",
    topping: "",
    quantity: 1,
    price: 0.0,
  });
  const [drinks, setDrinks] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid"); // Default to "Unpaid"
  const [message, setMessage] = useState(""); // For user feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDrink((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? parseFloat(value) : value,
    }));
  };

  const addDrink = () => {
    if (!drink.name.trim()) {
      setMessage("Please enter a valid drink name.");
      return;
    }

    if (drink.quantity <= 0 || drink.price <= 0) {
      setMessage("Quantity and Price must be greater than 0.");
      return;
    }

    setDrinks((prev) => [...prev, drink]);
    setDrink({ name: "", sugarLevel: "", topping: "", quantity: 1, price: 0.0 });
    setMessage("Drink added successfully!");
  };

  const submitOrder = () => {
    if (drinks.length === 0) {
      setMessage("Please add at least one drink before submitting the order.");
      return;
    }

    const invoiceId = `#${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
    const currentDate = new Date().toLocaleString();
    const total = drinks.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = {
      id: invoiceId,
      date: currentDate,
      total: `$${total.toFixed(2)}`,
      paymentStatus,
    };

    console.log("Order submitted:", order);

    // Reset the form and drinks list
    setDrinks([]);
    setPaymentStatus("Unpaid");
    setMessage("Order submitted successfully!");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Add New Order</h1>

      {message && (
        <div className="mb-4 p-2 text-white bg-green-500 rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-black">Drink Name</label>
          <input
            type="text"
            name="name"
            value={drink.name}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Sugar Level</label>
          <input
            type="text"
            name="sugarLevel"
            value={drink.sugarLevel}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Topping</label>
          <input
            type="text"
            name="topping"
            value={drink.topping}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Number of Drinks</label>
          <input
            type="number"
            name="quantity"
            value={drink.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Price Per Drink</label>
          <input
            type="number"
            name="price"
            value={drink.price}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full border p-2 rounded text-black"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <button
        onClick={addDrink}
        className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Add More Drink
      </button>

      <h2 className="mt-6 text-lg font-bold text-black">Added Drinks</h2>
      {drinks.length > 0 ? (
        <ul className="mt-2">
          {drinks.map((d, index) => (
            <li key={index} className="border p-2 rounded mb-2 text-black">
              {`${d.quantity}x ${d.name} - $${(d.price * d.quantity).toFixed(2)}`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-black">No drinks added yet.</p>
      )}

      <button
        onClick={submitOrder}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Order
      </button>
    </div>
  );
};

export default AddNewDrinks;
