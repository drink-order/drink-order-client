"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AddNewDrink = ({ setShowAddNewDrink, onAddNewDrink }) => {
  const router = useRouter();

  const [drink, setDrink] = useState({
    id: "",
    title: "",
    categoryId: "",
    categoryName: "",
    image: "",
    soldCount: 0,
    price: 0.0,
    size: "S, M, L", // Default size
    sugar: "30%, 50%, 70%, 100%", // Default sugar level
    toppings: [], // Array of toppings
    createdAt: "",
    updatedAt: "",
  });

  const [categories, setCategories] = useState([]);
  const [newTopping, setNewTopping] = useState("");
  const [noneTopping, setNoneTopping] = useState(false);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/shop-owner/api/categories", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Fetched categories:", data); // Debugging log
        setCategories(data.categories || data); // Directly set the array to state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      const selectedCategory = categories.find(category => category.id === parseInt(value));
      setDrink((prev) => ({
        ...prev,
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.nameCategory,
      }));
    } else {
      setDrink((prev) => ({
        ...prev,
        [name]: name === "soldCount" || name === "price" ? parseFloat(value) : value,
      }));
    }
  };

  const handleAddTopping = () => {
    if (newTopping.trim() !== "") {
      setDrink((prev) => ({
        ...prev,
        toppings: [...prev.toppings, newTopping.trim()],
      }));
      setNewTopping("");
    }
  };

  const handleRemoveTopping = (index) => {
    setDrink((prev) => ({
      ...prev,
      toppings: prev.toppings.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    const newDrink = {
      ...drink,
      id: `#${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      soldCount: 0, // Ensure soldCount is set to 0
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    console.log("New drink added:", newDrink);

    // Send the newDrink to your backend API
    try {
      const res = await fetch("http://localhost:3000/shop-owner/api/drinks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDrink),
      });

      if (!res.ok) {
        throw new Error(`Failed to add new drink: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Added new drink:", data);

      // Call the callback function to update the products list
      onAddNewDrink(data.drink);
    } catch (error) {
      console.error("Error adding new drink:", error);
    }

    // Reset the form
    setDrink({
      id: "",
      title: "",
      categoryId: "",
      categoryName: "",
      image: "",
      soldCount: 0,
      price: 0.0,
      size: "S, M, L", // Reset to default size
      sugar: "30%, 50%, 70%, 100%", // Reset to default sugar level
      toppings: [],
      createdAt: "",
      updatedAt: "",
    });
    setNoneTopping(false);

    // Close the AddNewDrink form
    setShowAddNewDrink(false);
  };

  const handleBack = () => {
    setShowAddNewDrink(false);
  };

  const handleNoneToppingChange = () => {
    setNoneTopping(!noneTopping);
    setDrink((prev) => ({
      ...prev,
      toppings: noneTopping ? [] : ["None"],
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Add New Drink</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-black">Drink Name</label>
          <input
            type="text"
            name="title"
            value={drink.title}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Category</label>
          <select
            name="categoryId"
            value={drink.categoryId}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameCategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-black">Image URL</label>
          <input
            type="text"
            name="image"
            value={drink.image}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Sold Count</label>
          <input
            type="number"
            name="soldCount"
            value={drink.soldCount}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            disabled // Disable input for soldCount
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Price</label>
          <input
            type="number"
            name="price"
            value={drink.price}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Size</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="size"
                value="None"
                checked={drink.size === "None"}
                onChange={handleChange}
                className="mr-2"
              />
              None
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="size"
                value="S, M, L"
                checked={drink.size === "S, M, L"}
                onChange={handleChange}
                className="mr-2"
              />
              S, M, L
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-black">Sugar Level</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="sugar"
                value="None"
                checked={drink.sugar === "None"}
                onChange={handleChange}
                className="mr-2"
              />
              None
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sugar"
                value="30%, 50%, 70%, 100%"
                checked={drink.sugar === "30%, 50%, 70%, 100%"}
                onChange={handleChange}
                className="mr-2"
              />
              30%, 50%, 70%, 100%
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-black">Topping</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="newTopping"
              value={newTopping}
              onChange={(e) => setNewTopping(e.target.value)}
              className="w-full border p-2 rounded text-black"
              disabled={noneTopping}
            />
            <button
              type="button"
              onClick={handleAddTopping}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={noneTopping}
            >
              Add
            </button>
          </div>
          <ul className="mt-2">
            <li className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="noneTopping"
                  checked={noneTopping}
                  onChange={handleNoneToppingChange}
                  className="mr-2"
                />
                None
              </label>
            </li>
            {drink.toppings
              .filter((topping) => topping !== "None")
              .map((topping, index) => (
                <li key={index} className="flex justify-between items-center">
                  {topping}
                  <button
                    type="button"
                    onClick={() => handleRemoveTopping(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="col-span-2 flex justify-start space-x-4">
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Drink
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewDrink;