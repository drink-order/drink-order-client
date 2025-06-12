"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const { user } = useAuth();

  // Cache duration (30 minutes)
  const CACHE_DURATION = 30 * 60 * 1000;

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!lastFetch) return false;
    return (Date.now() - lastFetch) < CACHE_DURATION;
  }, [lastFetch]);

  // Fetch both products and categories in parallel
  const fetchData = useCallback(async (forceRefresh = false) => {
    // Don't fetch if already loading or cache is valid (unless force refresh)
    if (loading || (!forceRefresh && isCacheValid() && products.length > 0)) {
      return { products, categories };
    }

    if (!user) {
      return { products: [], categories: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      // Fetch both products and categories in parallel
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers,
          credentials: "include",
          // Allow browser caching for 5 minutes
          cache: "default",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          headers,
          credentials: "include",
          cache: "default",
        })
      ]);

      // Check if both requests succeeded
      if (!productsResponse.ok) {
        throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
      }
      if (!categoriesResponse.ok) {
        throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
      }

      const [productsData, categoriesData] = await Promise.all([
        productsResponse.json(),
        categoriesResponse.json()
      ]);

      // Transform products data
      const transformedProducts = (productsData.products || []).map(product => ({
        id: product.id,
        title: product.name,
        image: product.image_url,
        categoryId: product.category_id,
        price: product.sizes && product.sizes.length > 0 
          ? product.sizes[0].price
          : "0.00",
        sizes: product.sizes || [],
        toppings: product.toppings || [],
        category: product.category,
        isAvailable: product.is_available
      }));

      // Transform categories data
      const transformedCategories = (categoriesData.categories || []).map(category => ({
        id: category.id,
        nameCategory: category.name,
        userId: category.user_id,
        createdAt: category.created_at,
        updatedAt: category.updated_at
      }));

      // Filter categories to only include those with products
      const filteredCategories = transformedCategories.filter(category => 
        transformedProducts.some(product => product.categoryId === category.id)
      );

      // Add "All" category at the beginning
      const categoriesWithAll = [
        { id: -1, nameCategory: "All" }, 
        ...filteredCategories
      ];

      setProducts(transformedProducts);
      setCategories(categoriesWithAll);
      setLastFetch(Date.now());

      console.log('Data fetched and cached:', {
        products: transformedProducts.length,
        categories: categoriesWithAll.length,
        timestamp: new Date().toISOString()
      });

      return { 
        products: transformedProducts, 
        categories: categoriesWithAll 
      };

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      return { products: [], categories: [] };
    } finally {
      setLoading(false);
    }
  }, [user, loading, isCacheValid, products, categories]);

  // Auto-fetch on user change (only if no data exists)
  useEffect(() => {
    if (user && products.length === 0 && !loading) {
      fetchData();
    }
  }, [user, products.length, loading, fetchData]);

  // Force refresh function for when new products/categories are added
  const refreshData = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Clear cache (useful for logout)
  const clearCache = useCallback(() => {
    setProducts([]);
    setCategories([]);
    setLastFetch(null);
    setError(null);
  }, []);

  // Get cache info for debugging
  const getCacheInfo = useCallback(() => {
    return {
      hasData: products.length > 0,
      lastFetch: lastFetch ? new Date(lastFetch).toISOString() : null,
      isValid: isCacheValid(),
      expiresIn: lastFetch ? Math.max(0, CACHE_DURATION - (Date.now() - lastFetch)) : 0
    };
  }, [products.length, lastFetch, isCacheValid]);

  const value = {
    // Data
    products,
    categories,
    loading,
    error,
    
    // Actions
    fetchData,
    refreshData,
    clearCache,
    getCacheInfo,
    
    // Cache status
    isCacheValid: isCacheValid(),
    lastFetch
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export default ProductsContext;