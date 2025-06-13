"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";

const AddNewDrinks = () => {
  const router = useRouter();
  const [drink, setDrink] = useState({
    name: "",
    size: "",
    topping: "",
    quantity: 1,
    price: 0.0,
  });
  const [drinks, setDrinks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products with sizes and toppings
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Accept": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update price when drink name, size, or topping changes
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
    
    // Reset dependent fields when main selection changes
    if (name === "name") {
      setDrink((prev) => ({
        ...prev,
        [name]: value,
        size: "",
        topping: "",
        price: 0.0,
      }));
    } else if (name === "size") {
      setDrink((prev) => ({
        ...prev,
        [name]: value,
        topping: "",
      }));
    } else {
      setDrink((prev) => ({
        ...prev,
        [name]: name === "quantity" ? parseInt(value) || 1 : value,
      }));
    }
  };

  const addDrink = () => {
    setError("");
    
    if (!drink.name || !drink.size || drink.quantity <= 0) {
      setError("Please select drink, size, and quantity.");
      return;
    }
    
    const newDrink = {
      ...drink,
      id: Date.now(), // Temporary ID for display
      totalPrice: drink.price * drink.quantity,
    };
    
    setDrinks((prev) => [...prev, newDrink]);
    setDrink({ name: "", size: "", topping: "", quantity: 1, price: 0.0 });
    
    Swal.fire({
      title: 'Added!',
      text: 'Drink added to order successfully!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const removeDrink = (id) => {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
  };

  const submitOrder = async () => {
    if (drinks.length === 0) {
      setError("Please add at least one drink before submitting the order.");
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

    try {
      setSubmitLoading(true);
      setError("");
      
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
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit order.");
      }

      const result = await res.json();
      
      setDrinks([]);
      
      await Swal.fire({
        title: 'Success!',
        text: `Order #${result.order?.id || 'N/A'} submitted successfully!`,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Navigate back to staff dashboard
      router.push("/staff");
      
    } catch (error) {
      console.error("Error submitting order:", error);
      setError(error.message || "An error occurred while submitting the order.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Calculate total order amount
  const totalOrderAmount = drinks.reduce((sum, drink) => sum + drink.totalPrice, 0);

  // Get available sizes and toppings for selected drink
  const selectedProduct = products.find((p) => p.name === drink.name);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Add New Order</h1>
          <button
            onClick={() => router.push("/staff")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
        <p className="text-gray-600 mt-2">Create a new order by selecting drinks and adding them to the order list.</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Add Drink Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Add Drink to Order</h2>
          
          <div className="space-y-4">
            {/* Drink Selection */}
            <div>
              <label className="block mb-1 text-black font-medium">Select Drink *</label>
              <select
                name="name"
                value={drink.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a drink...</option>
                {products.filter(p => p.is_available).map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block mb-1 text-black font-medium">Size *</label>
              <select
                name="size"
                value={drink.size}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!drink.name}
                required
              >
                <option value="">Choose size...</option>
                {selectedProduct?.sizes.map((s) => (
                  <option key={s.id} value={s.size}>
                    {s.size === 'none' ? 'Standard' : s.size.charAt(0).toUpperCase() + s.size.slice(1)} - ${parseFloat(s.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Topping Selection */}
            <div>
              <label className="block mb-1 text-black font-medium">Topping (Optional)</label>
              <select
                name="topping"
                value={drink.topping}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!drink.name}
              >
                <option value="">No topping</option>
                {selectedProduct?.toppings.filter(t => t.topping.is_available).map((t) => (
                  <option key={t.topping.id} value={t.topping.name}>
                    {t.topping.name} (+${parseFloat(t.price).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block mb-1 text-black font-medium">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={drink.quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="50"
                  required
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className="block mb-1 text-black font-medium">Unit Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={drink.price.toFixed(2)}
                    readOnly
                    className="w-full border border-gray-300 p-3 pl-8 rounded-md text-black bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Total for this drink */}
            {drink.name && drink.size && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <span className="text-black font-medium">Total for this item:</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${(drink.price * drink.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={addDrink}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={!drink.name || !drink.size || drink.quantity <= 0}
            >
              <HiPlus className="w-5 h-5" />
              Add to Order
            </button>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>
          
          {drinks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No drinks added yet.</p>
              <p className="text-sm text-gray-400 mt-2">Add drinks using the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drinks.map((d, index) => (
                <div key={d.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{d.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {d.size === 'none' ? 'Standard' : d.size.charAt(0).toUpperCase() + d.size.slice(1)}
                        {d.topping && ` • Topping: ${d.topping}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {d.quantity} × ${d.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black">${d.totalPrice.toFixed(2)}</span>
                      <button
                        onClick={() => removeDrink(d.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove item"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-black">Order Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${totalOrderAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {drinks.length} item{drinks.length !== 1 ? 's' : ''} • {drinks.reduce((sum, d) => sum + d.quantity, 0)} drink{drinks.reduce((sum, d) => sum + d.quantity, 0) !== 1 ? 's' : ''}
                </p>
              </div>

              <button
                onClick={submitOrder}
                disabled={submitLoading}
                className={`w-full px-4 py-3 rounded-md text-white font-medium transition-colors duration-200 ${
                  submitLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {submitLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting Order...
                  </div>
                ) : (
                  'Submit Order'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewDrinks;