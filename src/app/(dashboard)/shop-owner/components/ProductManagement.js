"use client";
import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import { useProducts } from "../../../context/ProductsContext";
import Swal from "sweetalert2";

const ProductManagement = () => {
  // Get products from context instead of local state
  const { 
    products: contextProducts, 
    loading: contextLoading, 
    error: contextError, 
    refreshData 
  } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showAddNewDrink, setShowAddNewDrink] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper function to fix image URLs
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8000${imageUrl}`;
  };

  // Helper function to sort products
  const sortProducts = (productsArray, sortType) => {
    return [...productsArray].sort((a, b) => {
      if (sortType === "ID Ascending") {
        return a.id - b.id;
      } else if (sortType === "ID Descending") {
        return b.id - a.id;
      }
      return 0;
    });
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

  // Convert context products to the format expected by this component
  const convertedProducts = contextProducts.map(product => ({
    id: product.id,
    name: product.title, // Convert title back to name for admin interface
    image_url: product.image,
    category_id: product.categoryId,
    sizes: product.sizes,
    toppings: product.toppings,
    category: product.category,
    is_available: product.isAvailable,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString()
  }));

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
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

        // Refresh the context data to update the cache
        await refreshData();
  
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
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : '',
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error("Failed to fetch product details");
      }

      const data = await res.json();
      console.log("Fetched product for edit:", data.product);
      setEditProduct(data.product);
      setShowEditProduct(true);
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to load product details for editing',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewDrink = async (newProduct) => {
    console.log("Product added:", newProduct);
    
    // Refresh the context data to include the new product
    await refreshData();
    
    setShowAddNewDrink(false);
    
    Swal.fire({
      title: 'Success!',
      text: 'Product added successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleUpdateProduct = async (updatedProduct) => {
    console.log("Product updated:", updatedProduct);
    
    // Refresh the context data to reflect the update
    await refreshData();
    
    setShowEditProduct(false);
    setEditProduct(null);
    
    Swal.fire({
      title: 'Success!',
      text: 'Product updated successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleBackToList = () => {
    setShowAddNewDrink(false);
    setShowEditProduct(false);
    setEditProduct(null);
  };

  // Sort and filter products
  const sortedProducts = sortProducts(convertedProducts, sortOption);
  const filteredProducts = sortedProducts.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxLength) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // If showing add form
  if (showAddNewDrink) {
    return (
      <AddProductForm 
        onBack={handleBackToList} 
        onAdd={handleAddNewDrink} 
      />
    );
  }

  // If showing edit form
  if (showEditProduct && editProduct) {
    return (
      <EditProductForm
        product={editProduct}
        onBack={handleBackToList}
        onUpdate={handleUpdateProduct}
      />
    );
  }

  // Main product list view
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Product Management</h1>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">All Products ({filteredProducts.length})</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ID Ascending">Sort by: ID Ascending</option>
              <option value="ID Descending">Sort by: ID Descending</option>
            </select>
            <button
              onClick={() => setShowAddNewDrink(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              disabled={loading || contextLoading}
            >
              Add New Product
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
              disabled={loading || contextLoading}
              title="Refresh product list"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {(loading || contextLoading) ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : contextError ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-500">Error: {contextError}</p>
          <button 
            onClick={refreshData} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">
            {convertedProducts.length === 0 ? "No products found. Add your first product!" : "No products match your search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border border-gray-300 font-semibold">ID</th>
                <th className="p-3 border border-gray-300 font-semibold">Name</th>
                <th className="p-3 border border-gray-300 font-semibold">Category</th>
                <th className="p-3 border border-gray-300 font-semibold">Image</th>
                <th className="p-3 border border-gray-300 font-semibold">Sizes & Prices</th>
                <th className="p-3 border border-gray-300 font-semibold">Toppings</th>
                <th className="p-3 border border-gray-300 font-semibold">Available</th>
                <th className="p-3 border border-gray-300 font-semibold">Created</th>
                <th className="p-3 border border-gray-300 font-semibold">Updated</th>
                <th className="p-3 border border-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const sizeText = product.sizes?.map((s) => 
                  `${s.size === 'none' ? 'Standard' : s.size.charAt(0).toUpperCase() + s.size.slice(1)} - $${parseFloat(s.price).toFixed(2)}`
                ).join(", ") || "N/A";
                
                const toppingsList = product.toppings?.map((t) => t.topping?.name).filter(Boolean) || [];
                const toppingsText = toppingsList.length > 0 ? toppingsList.join(", ") : "None";
                const shouldTruncateToppings = toppingsText.length > 30;

                const imageUrl = getImageUrl(product.image_url);

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-300 font-medium">{product.id}</td>
                    <td className="p-3 border border-gray-300">{product.name}</td>
                    <td className="p-3 border border-gray-300">{product.category?.name || product.category?.nameCategory || "N/A"}</td>
                    <td className="p-3 border border-gray-300">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover mx-auto rounded border"
                          onError={(e) => {
                            console.error("Failed to load image:", imageUrl);
                            e.target.parentElement.innerHTML = '<span class="text-gray-400 text-sm">Image not found</span>';
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-300 text-sm">{sizeText}</td>
                    <td className="p-3 border border-gray-300 text-sm">
                      {shouldTruncateToppings ? (
                        <span 
                          title={toppingsText}
                          className="cursor-help"
                        >
                          {truncateText(toppingsText, 30)}
                        </span>
                      ) : (
                        toppingsText
                      )}
                    </td>
                    <td className="p-3 border border-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-300 text-xs">
                      <div className="whitespace-nowrap">
                        {formatDateTime(product.created_at)}
                      </div>
                    </td>
                    <td className="p-3 border border-gray-300 text-xs">
                      <div className="whitespace-nowrap">
                        {formatDateTime(product.updated_at)}
                      </div>
                    </td>
                    <td className="p-3 border border-gray-300">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors duration-200"
                          disabled={loading || contextLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors duration-200"
                          disabled={loading || contextLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;