"use client";
import React, { useState, useEffect } from "react";

const ProductForm = ({ product = null, onBack, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    is_available: true,
    image: null,
    price: "",
  });
  
  const [categories, setCategories] = useState([]);
  const [availableToppings, setAvailableToppings] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [hasSizes, setHasSizes] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Image preview states
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  useEffect(() => {
    // Initialize form data from product (for edit mode)
    if (isEdit && product) {
      initializeFormData();
    }
    // Fetch categories and toppings
    fetchSelectData();
  }, [isEdit, product]);

  const initializeFormData = () => {
    if (!product) return;

    setFormData({
      name: product.name || "",
      category_id: product.category_id || "",
      is_available: product.is_available ?? true,
      image: null,
      price: "",
    });

    // Set current image URL if exists
    if (product.image_url) {
      const imageUrl = product.image_url.startsWith('http') 
        ? product.image_url 
        : `http://localhost:8000${product.image_url}`;
      setCurrentImageUrl(imageUrl);
    }

    // Set up sizes
    if (product.sizes && product.sizes.length > 0) {
      const productSizes = product.sizes.filter(size => size.size !== 'none');
      if (productSizes.length > 0) {
        setHasSizes(true);
        setSizes(productSizes.map(size => ({
          id: size.id,
          size: size.size,
          price: size.price.toString()
        })));
      } else {
        // Single price product
        const singlePrice = product.sizes.find(size => size.size === 'none');
        if (singlePrice) {
          setFormData(prev => ({ ...prev, price: singlePrice.price.toString() }));
        }
      }
    }

    // Set up toppings
    if (product.toppings && product.toppings.length > 0) {
      setSelectedToppings(product.toppings.map(pt => ({
        id: pt.id,
        topping_id: pt.topping.id,
        price: pt.price.toString()
      })));
    }
  };

  const fetchSelectData = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem("auth_token");
      
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };

      const fetchOptions = { headers, credentials: "include", cache: "no-store" };

      // Fetch categories and toppings in parallel
      const [categoriesRes, toppingsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, fetchOptions),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/toppings`, fetchOptions)
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || categoriesData);
      }

      if (toppingsRes.ok) {
        const toppingsData = await toppingsRes.json();
        setAvailableToppings(toppingsData.toppings || toppingsData);
      }
    } catch (error) {
      console.error("Error fetching select data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              name === "category_id" ? parseInt(value) || "" : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      setError(null);
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setSizes(updatedSizes);
  };

  const addSize = () => {
    const sizeOrder = ["small", "medium", "large"];
    const usedSizes = sizes.map(s => s.size);
    const nextSize = sizeOrder.find(size => !usedSizes.includes(size));
    
    if (nextSize) {
      setSizes([...sizes, { size: nextSize, price: "" }]);
    }
  };

  const removeSize = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
    if (updatedSizes.length === 0) {
      setHasSizes(false);
    }
  };

  const handleToppingChange = (toppingId) => {
    const exists = selectedToppings.find(t => t.topping_id === toppingId);
    if (exists) {
      setSelectedToppings(selectedToppings.filter(t => t.topping_id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, { 
        topping_id: toppingId, 
        price: ""
      }]);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!formData.category_id) {
      setError("Please select a category");
      return false;
    }
    if (hasSizes) {
      if (sizes.length === 0) {
        setError("Please add at least one size or switch to single price mode");
        return false;
      }
      for (let size of sizes) {
        if (!size.price || parseFloat(size.price) < 0) {
          setError(`Please enter a valid price for ${size.size} size`);
          return false;
        }
      }
    } else {
      if (!formData.price || parseFloat(formData.price) < 0) {
        setError("Please enter a valid price");
        return false;
      }
    }
    for (let topping of selectedToppings) {
      if (!topping.price || parseFloat(topping.price) < 0) {
        const toppingName = availableToppings.find(t => t.id === topping.topping_id)?.name || 'topping';
        setError(`Please enter a valid price for ${toppingName}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      const formDataToSend = new FormData();
      
      // Add _method for edit mode (Laravel PUT via POST)
      if (isEdit) {
        formDataToSend.append('_method', 'PUT');
      }
      
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('category_id', formData.category_id.toString());
      formDataToSend.append('is_available', formData.is_available ? '1' : '0');
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Add sizes or single price
      if (hasSizes && sizes.length > 0) {
        sizes.forEach((size, index) => {
          if (size.id && isEdit) {
            formDataToSend.append(`sizes[${index}][id]`, size.id.toString());
          }
          formDataToSend.append(`sizes[${index}][size]`, size.size);
          formDataToSend.append(`sizes[${index}][price]`, (parseFloat(size.price) || 0).toString());
        });
      } else if (formData.price) {
        formDataToSend.append('price', (parseFloat(formData.price) || 0).toString());
      }

      // Add toppings
      selectedToppings.forEach((topping, index) => {
        if (topping.id && isEdit) {
          formDataToSend.append(`toppings[${index}][id]`, topping.id.toString());
        }
        formDataToSend.append(`toppings[${index}][topping_id]`, topping.topping_id.toString());
        formDataToSend.append(`toppings[${index}][price]`, (parseFloat(topping.price) || 0).toString());
      });

      // Determine URL and method based on mode
      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/products`;
      
      const method = isEdit ? "POST" : "POST"; // Both use POST (edit uses _method=PUT)

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: "include",
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 422 && errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
        }
        if (res.status === 401 || res.status === 403) {
          throw new Error(`You don't have permission to ${isEdit ? 'update' : 'create'} this product`);
        }
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} product: ${res.statusText}`);
      }

      const data = await res.json();
      
      // Call the onSubmit callback with the result
      onSubmit(data.product);
      
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} product:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: "",
      is_available: true,
      image: null,
      price: "",
    });
    setSizes([]);
    setSelectedToppings([]);
    setHasSizes(false);
    setError(null);
    setImagePreview(null);
    setCurrentImageUrl(null);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (dataLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block mb-1 text-black font-medium">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black focus:ring-2 focus:ring-blue-500"
              required
              maxLength={255}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-black font-medium">Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameCategory || category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-black font-medium">
              {isEdit ? 'Update Image' : 'Product Image'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
            />
            <p className="text-sm text-gray-500 mt-1">Max size: 2MB</p>
            
            {/* Image Preview Section */}
            <div className="mt-3">
              {imagePreview && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 font-medium">New Image Preview:</p>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <img 
                    src={imagePreview}
                    alt="New image preview" 
                    className="max-h-40 max-w-full rounded border object-cover"
                  />
                </div>
              )}
              
              {!imagePreview && isEdit && currentImageUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Current Image:</p>
                  <img 
                    src={currentImageUrl}
                    alt="Current product" 
                    className="max-h-40 max-w-full rounded border object-cover"
                    onError={(e) => {
                      console.error("Failed to load current image:", currentImageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {!imagePreview && !currentImageUrl && (
                <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500 text-sm">No image selected</p>
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <label className="flex items-center text-black cursor-pointer">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                className="mr-2 w-4 h-4"
              />
              <span className="font-medium">Product Available</span>
            </label>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-6 border-t pt-4">
          <label className="flex items-center text-black mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSizes}
              onChange={(e) => {
                setHasSizes(e.target.checked);
                if (!e.target.checked) setSizes([]);
              }}
              className="mr-2 w-4 h-4"
            />
            <span className="font-medium">Has different sizes</span>
          </label>

          {!hasSizes ? (
            <div className="max-w-md">
              <label className="block mb-1 text-black font-medium">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full border border-gray-300 p-2 pl-8 rounded-md text-black focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-black font-semibold">Size Options</h3>
                <button
                  type="button"
                  onClick={addSize}
                  className={`px-3 py-1 rounded text-sm ${
                    sizes.length >= 3 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={sizes.length >= 3}
                >
                  Add Size {sizes.length >= 3 ? "(Max)" : ""}
                </button>
              </div>
              
              {sizes.map((size, index) => (
                <div key={index} className="flex gap-2 mb-3 items-center bg-gray-50 p-3 rounded">
                  <div className="w-24">
                    <select
                      value={size.size}
                      onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                      className="w-full border p-2 rounded text-black"
                      disabled={isEdit} // Disable changing size in edit mode
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={size.price}
                      onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full border p-2 pl-8 rounded text-black focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toppings Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-black font-semibold mb-3">Available Toppings</h3>
          
          {availableToppings.length === 0 ? (
            <p className="text-gray-600">No toppings available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableToppings.map((topping) => {
                const isSelected = selectedToppings.find(t => t.topping_id === topping.id);
                return (
                  <div key={topping.id} className="border rounded p-3 hover:border-gray-300">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handleToppingChange(topping.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-black font-medium flex-1">{topping.name}</span>
                      {isSelected && (
                        <div className="relative w-20">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={isSelected.price}
                            onChange={(e) => {
                              const updatedToppings = selectedToppings.map(t =>
                                t.topping_id === topping.id 
                                  ? { ...t, price: e.target.value }
                                  : t
                              );
                              setSelectedToppings(updatedToppings);
                            }}
                            step="0.01"
                            min="0"
                            className="w-full border p-1 pl-5 rounded text-black text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 border-t pt-4 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {isEdit ? 'Cancel' : 'Back'}
          </button>
          
          {!isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Reset Form
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading 
              ? (isEdit ? "Updating..." : "Adding...") 
              : (isEdit ? "Update Product" : "Add Product")
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;