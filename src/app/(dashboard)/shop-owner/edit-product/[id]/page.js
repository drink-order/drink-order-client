"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditProductForm from '../../components/EditProductForm';

const getProductById = async (id) => {
  try {
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
      if (res.status === 401 || res.status === 403) {
        throw new Error("You don't have permission to view this product");
      }
      if (res.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return { product: null, error: error.message };
  }
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductById(id);
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
      setLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleBack = () => {
    router.push('/shop-owner');
  };

  const handleUpdate = (updatedProduct) => {
    // Navigate back to product management after successful update
    router.push('/shop-owner');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <h3 className="text-red-800 font-medium">Error Loading Product</h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
        <button
          onClick={handleBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <h3 className="text-yellow-800 font-medium">Product Not Found</h3>
          <p className="text-yellow-700 mt-1">The requested product could not be found.</p>
        </div>
        <button
          onClick={handleBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <EditProductForm 
      product={data.product}
      onBack={handleBack} 
      onUpdate={handleUpdate} 
    />
  );
}