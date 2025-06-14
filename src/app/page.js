"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import CategorySelector from "./components/CategorySelector";
import DrinkDetails from "./components/DrinkDetails";
import FloatingOrderButton from "./components/FloatingOrderButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { useProducts } from "./context/ProductsContext";

export default function Home() {
  const { user, loading } = useAuth();
  const { products, categories, loading: productsLoading, error } = useProducts();
  const router = useRouter();
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  // ✅ ALL HOOKS MUST BE HERE - BEFORE ANY CONDITIONAL LOGIC

  // Memoize user name to prevent recalculation
  const userName = useMemo(() => {
    return user?.username || user?.name || "Customer";
  }, [user?.username, user?.name]);

  // All useCallback hooks BEFORE conditional returns
  const handleCardClick = useCallback((drink) => {
    setScrollPosition(window.scrollY);
    setSelectedDrink(drink);
    // Emit event to hide navbar
    window.dispatchEvent(new CustomEvent('drinkDetailsOpen'));
  }, []);

  const handleBack = useCallback(() => {
    setSelectedDrink(null);
    window.scrollTo(0, scrollPosition);
    // Emit event to show navbar
    window.dispatchEvent(new CustomEvent('drinkDetailsClose'));
  }, [scrollPosition]);

  const handleCategoryChange = useCallback((categoryIndex) => {
    setActiveCategory(categoryIndex);
  }, []);

  // Authentication check - redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
      return;
    }
  }, [user, loading, router]);

  // Role-based routing
  useEffect(() => {
    if (!user) return;
    
    const userRole = user?.role;

    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "shop_owner") {
      router.push("/shop-owner");
    } else if (userRole === "staff") {
      router.push("/staff");
    }
  }, [user?.role, router]);

  // ✅ NOW CONDITIONAL LOGIC CAN HAPPEN - AFTER ALL HOOKS

  // Show loading spinner while checking authentication or loading products
  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">
            {loading ? "Loading your experience..." : "Loading menu..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show error state if products failed to load
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Menu</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with clean design */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 sm:px-6 py-4">
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-gray-800">
              Hello, {userName}! 👋
            </span>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">
              What would you like to drink today?
            </span>
          </div>
          <Link href="/account" className="flex-shrink-0">
            <div className="relative">
              <Image
                src={"/user_icon.png"}
                alt="Profile"
                width={44}
                height={44}
                className="rounded-full border-2 border-yellow-500 shadow-md hover:shadow-lg transition-shadow duration-200"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        <div className="px-4 sm:px-6 py-6">
          <CategorySelector
            drinks={products}
            categories={categories}
            onCardClick={handleCardClick}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Full-Screen Drink Details */}
        {selectedDrink && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            <DrinkDetails drink={selectedDrink} onBack={handleBack} />
          </div>
        )}
      </div>
      
      <FloatingOrderButton />
    </div>
  );
}