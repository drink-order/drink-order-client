"use client";
import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import AddNewDrink from "./AddNewDrink";
import EditProduct from "../edit-product/[id]/page";
import Swal from "sweetalert2";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showAddNewDrink, setShowAddNewDrink] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("auth_token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("You don't have permission to view products");
          }
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error loading products: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
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
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: "This will permanently delete the product.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
  
      if (confirmed.isConfirmed) {
        setLoading(true);
  
        const token = localStorage.getItem("auth_token");
  
        if (!token) {
          throw new Error("Authentication token not found");
        }
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        if (!res.ok) {
          throw new Error("Failed to delete product");
        }
  
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  
        setLoading(false);
  
        await Swal.fire({
          title: 'Deleted!',
          text: 'The product has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setLoading(false);
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
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="p-4">
      {showAddNewDrink ? (
        <AddNewDrink setShowAddNewDrink={setShowAddNewDrink} onAddNewDrink={handleAddNewDrink} />
      ) : showEditProduct ? (
        <EditProduct
          setShowEditProduct={setShowEditProduct}
          onUpdateProduct={handleUpdateProduct}
          id={editProductId}
        />
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">All Products</h2>
              <div className="flex items-center space-x-4">
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
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="ID Ascending">Sort by: ID Ascending</option>
                  <option value="ID Descending">Sort by: ID Descending</option>
                </select>
                <button
                  onClick={() => setShowAddNewDrink(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add New Product
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Sizes</th>
                  <th className="p-2 border">Toppings</th>
                  <th className="p-2 border">Created At</th>
                  <th className="p-2 border">Updated At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const sizeText = product.sizes?.map((s) => `${s.size} - $${parseFloat(s.price).toFixed(2)}`).join(", ") || "N/A";
                  const toppingsList = product.toppings?.map((t) => t.topping?.name).filter(Boolean) || [];
                  const toppingsText = toppingsList.join(", ");
                  const shouldTruncateToppings = toppingsText.length > 20;

                  return (
                    <tr key={product.id}>
                      <td className="p-2 border">{product.id}</td>
                      <td className="p-2 border">{product.name}</td>
                      <td className="p-2 border">{product.category?.name || "N/A"}</td>
                      <td className="p-2 border">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover mx-auto" />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="p-2 border">{sizeText}</td>
                      <td className="p-2 border">
                        {toppingsList.length === 0 ? (
                          "None"
                        ) : shouldTruncateToppings ? (
                          <span className="tooltip">
                            {truncateText(toppingsText, 20)}
                            <span className="tooltiptext">{toppingsText}</span>
                          </span>
                        ) : (
                          toppingsText
                        )}
                      </td>
                      <td className="p-2 border">{new Date(product.created_at).toLocaleDateString()}</td>
                      <td className="p-2 border">{new Date(product.updated_at).toLocaleDateString()}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="bg-yellow-400 text-white hover:bg-yellow-500 px-4 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 text-white hover:bg-red-600 px-4 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ProductManagement;
