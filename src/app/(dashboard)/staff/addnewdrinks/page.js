"use client";
import React, { useState, useEffect } from "react";

const AddNewDrinks = () => {
  const [drink, setDrink] = useState({
    name: "",
    size: "",
    topping: "",
    quantity: 1,
    price: 0.0,
  });
  const [drinks, setDrinks] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid"); // Default to "Unpaid"
  const [message, setMessage] = useState(""); // For user feedback
  const [products, setProducts] = useState([]);

  // Fetch products with sizes and toppings
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Accept": "application/json",
          },
        });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products);
      } catch (err) {
        setMessage("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

    // Update price when drink name or size changes
useEffect(() => {
  if (drink.name && drink.size) {
    const product = products.find((p) => p.name === drink.name);
    const sizeObj = product?.sizes.find((s) => s.size === drink.size);
    let toppingPrice = 0;
    if (drink.topping) {
      const toppingObj = product?.toppings.find((t) => t.topping.name === drink.topping);
      if (toppingObj) {
        toppingPrice = parseFloat(toppingObj.price);
      }
    }
    setDrink((prev) => ({
      ...prev,
      price: (sizeObj ? parseFloat(sizeObj.price) : 0) + toppingPrice,
    }));
  }
}, [drink.name, drink.size, drink.topping, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDrink((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? parseFloat(value) : value,
    }));
  };

  const addDrink = () => {
    if (!drink.name || !drink.size || drink.quantity <= 0) {
      setMessage("Please select drink, size, and quantity.");
      return;
    }
    setDrinks((prev) => [...prev, drink]);
    setDrink({ name: "", size: "", topping: "", quantity: 1, price: 0.0 });
    setMessage("Drink added successfully!");
  };

    const submitOrder = async () => {
    if (drinks.length === 0) {
      setMessage("Please add at least one drink before submitting the order.");
      return;
    }

    // Build items array for API
    const items = drinks.map((d) => {
      const product = products.find((p) => p.name === d.name);
      const sizeObj = product.sizes.find((s) => s.size === d.size);
      let toppingArr = [];
      if (d.topping) {
        const toppingObj = product.toppings.find((t) => t.topping.name === d.topping);
        if (toppingObj) {
          toppingArr.push({ topping_id: toppingObj.topping.id });
        }
      }
      return {
        product_size_id: sizeObj.id,
        quantity: d.quantity,
        toppings: toppingArr,
      };
    });

    const orderData = { items };

    console.log("drinks:", drinks);
    console.log("items:", items);
    console.log("orderData:", orderData);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        setMessage("Failed to submit order.");
        return;
      }
      setDrinks([]);
      setPaymentStatus("Unpaid");
      setMessage("Order submitted successfully!");
    } catch (error) {
      setMessage("An error occurred while submitting the order.");
    }
  };

  // Get available sizes and toppings for selected drink
  const selectedProduct = products.find((p) => p.name === drink.name);

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
          <select
            name="name"
            value={drink.name}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          >
            <option value="">Select Drink</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-black">Size</label>
          <select
            name="size"
            value={drink.size}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            disabled={!drink.name}
          >
            <option value="">Select Size</option>
            {selectedProduct?.sizes.map((s) => (
              <option key={s.id} value={s.size}>
                {s.size} (${parseFloat(s.price).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-black">Topping</label>
          <select
            name="topping"
            value={drink.topping}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            disabled={!drink.name}
          >
            <option value="">Select Topping</option>
            {selectedProduct?.toppings.map((t) => (
              <option key={t.topping.id} value={t.topping.name}>
                {t.topping.name} (${parseFloat(t.price).toFixed(2)})
              </option>
            ))}
          </select>
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
          <label className="block mb-1 text-black">Total Price</label>
          <input
            type="number"
            name="price"
            value={drink.price}
            readOnly
            className="w-full border p-2 rounded text-black bg-gray-100"
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
              {`${d.quantity}x ${d.name} (${d.size}${d.topping ? ` + ${d.topping}` : ""}) - $${(d.price * d.quantity).toFixed(2)}`}
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
