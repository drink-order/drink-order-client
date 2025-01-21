"use client";
import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import AddNewDrink from "./AddNewDrink";
import EditProduct from "../edit-product/[id]/page";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showAddNewDrink, setShowAddNewDrink] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/shop-owner/api/drinks", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Fetched products:", data); // Debugging log
        const sortedProducts = data.drinks.sort((a, b) => a.id - b.id);
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedProducts = [...products].sort((a, b) => {
      if (option === "ID Ascending") {
        return a.id - b.id;
      } else if (option === "ID Descending") {
        return b.id - a.id;
      }
    });
    setProducts(sortedProducts);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/shop-owner/api/drinks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete product: ${res.statusText}`);
      }
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (id) => {
    setEditProductId(id);
    setShowEditProduct(true);
  };

  const handleAddNewDrink = (newDrink) => {
    setProducts((prevProducts) => [...prevProducts, newDrink]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="p-4">
      {showAddNewDrink ? (
        <AddNewDrink setShowAddNewDrink={setShowAddNewDrink} onAddNewDrink={handleAddNewDrink} />
      ) : showEditProduct ? (
        <EditProduct setShowEditProduct={setShowEditProduct} onUpdateProduct={handleUpdateProduct} id={editProductId} />
      ) : (
        <>
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">All Products</h2>
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Sort Dropdown */}
                <div>
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="ID Ascending">Sort by: ID Ascending</option>
                    <option value="ID Descending">Sort by: ID Descending</option>
                  </select>
                </div>
                {/* Add New Product Button */}
                <button
                  onClick={() => setShowAddNewDrink(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add New Product
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Sold Count</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Size</th>
                <th className="p-2 border">Sugar Level</th>
                <th className="p-2 border">Toppings</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Updated At</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const toppings = Array.isArray(product.toppings) ? product.toppings.filter(topping => topping !== "None") : [];
                const toppingsText = toppings.join(", ");
                const shouldTruncate = toppingsText.length > 20;

                return (
                  <tr key={product.id}>
                    <td className="p-2 border">{product.id}</td>
                    <td className="p-2 border">{product.title}</td>
                    <td className="p-2 border">{product.categoryName}</td>
                    <td className="p-2 border">
                      <img src={product.image} alt={product.title} className="w-16 h-16 object-cover mx-auto" />
                    </td>
                    <td className="p-2 border">{product.soldCount}</td>
                    <td className="p-2 border">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                    <td className="p-2 border relative group">
                      {product.size === "S, M, L" ? (
                        <span className="tooltip">
                          Default
                          <span className="tooltiptext">{product.size}</span>
                        </span>
                      ) : (
                        product.size
                      )}
                    </td>
                    <td className="p-2 border relative group">
                      {product.sugar === "30%, 50%, 70%, 100%" ? (
                        <span className="tooltip">
                          Default
                          <span className="tooltiptext">{product.sugar}</span>
                        </span>
                      ) : (
                        product.sugar
                      )}
                    </td>
                    <td className="p-2 border relative group">
                      {toppings.length === 0 ? (
                        "None"
                      ) : shouldTruncate ? (
                        <span className="tooltip">
                          {truncateText(toppingsText, 20)}
                          <span className="tooltiptext">{toppingsText}</span>
                        </span>
                      ) : (
                        toppingsText
                      )}
                    </td>
                    <td className="p-2 border">{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 border">{new Date(product.updatedAt).toLocaleDateString()}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="bg-yellow-400 text-white hover:bg-yellow-500 hover:text-white border px-4 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white hover:bg-red-600 hover:text-white border px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ProductManagement;