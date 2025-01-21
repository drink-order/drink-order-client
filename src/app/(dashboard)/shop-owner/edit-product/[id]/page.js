"use client";
import React, { useState, useEffect } from "react";

const EditProduct = ({ setShowEditProduct, onUpdateProduct, id }) => {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newTopping, setNewTopping] = useState("");
  const [noneTopping, setNoneTopping] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch product details from the API
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/shop-owner/api/drinks/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.statusText}`);
        }
        const data = await res.json();
        if (!data.drink) {
          throw new Error("Product not found");
        }
        setProduct(data.drink);
        setNoneTopping(Array.isArray(data.drink.toppings) && data.drink.toppings.includes("None"));
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      }
    };

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
        setCategories(data.categories || data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      const selectedCategory = categories.find(category => category.id === parseInt(value));
      setProduct((prev) => ({
        ...prev,
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.nameCategory,
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTopping = () => {
    if (newTopping.trim() !== "") {
      setProduct((prev) => ({
        ...prev,
        toppings: [...(prev.toppings || []).filter(topping => topping !== "None"), newTopping.trim()],
      }));
      setNewTopping("");
    }
  };

  const handleRemoveTopping = (index) => {
    setProduct((prev) => ({
      ...prev,
      toppings: (prev.toppings || []).filter((_, i) => i !== index),
    }));
  };

  const handleNoneToppingChange = () => {
    setNoneTopping(!noneTopping);
    setProduct((prev) => ({
      ...prev,
      toppings: noneTopping ? [] : ["None"],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      updatedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch(`http://localhost:3000/shop-owner/api/drinks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!res.ok) {
        throw new Error(`Failed to update product: ${res.statusText}`);
      }
      const data = await res.json();
      onUpdateProduct(data.drink);
      setShowEditProduct(false);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.message);
    }
  };

  const handleBack = () => {
    setShowEditProduct(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-black">Drink Name</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Category</label>
          <select
            name="categoryId"
            value={product.categoryId}
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
            value={product.image}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Sold Count</label>
          <input
            type="number"
            name="soldCount"
            value={product.soldCount}
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
            value={product.price}
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
                checked={product.size === "None"}
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
                checked={product.size === "S, M, L"}
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
                checked={product.sugar === "None"}
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
                checked={product.sugar === "30%, 50%, 70%, 100%"}
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
            {Array.isArray(product.toppings) && product.toppings
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
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;