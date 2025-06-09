"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CategorySelector from "./components/CategorySelector";
import DrinkDetails from "./components/DrinkDetails";
import StickyCartButton from "./components/StickyCartButton";
import FloatingOrderButton from "./components/FloatingOrderButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { cart } = useCart();
  const [drinks, setDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Authentication check - redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("You don't have permission to view products");
          }
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch drinks: ${response.statusText} - ${errorText}`
          );
        }
        
        const data = await response.json();
        console.log("Fetched drinks:", data.products);
        
        // Transform API data to match component expectations
        const transformedProducts = (data.products || []).map(product => ({
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
        
        setDrinks(transformedProducts);
      } catch (error) {
        console.error("Error fetching drinks:", error);
        if (error.message.includes("permission")) {
          router.push("/sign-in");
        }
      }
    };

    if (user) {
      fetchDrinks();
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    
    const userRole = user?.role;

    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "shopOwner") {
      router.push("/shop-owner");
    } else if (userRole === "staff") {
      router.push("/staff");
    }
  }, [user, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user?.username || user?.name || "Customer";

  const handleCardClick = (drink) => {
    setScrollPosition(window.scrollY);
    setSelectedDrink(drink);
    // Emit event to hide navbar
    window.dispatchEvent(new CustomEvent('drinkDetailsOpen'));
  };

  const handleBack = () => {
    setSelectedDrink(null);
    window.scrollTo(0, scrollPosition);
    // Emit event to show navbar
    window.dispatchEvent(new CustomEvent('drinkDetailsClose'));
  };

  const handleCategoryChange = (categoryIndex) => {
    setActiveCategory(categoryIndex);
  };

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
            drinks={drinks}
            onCardClick={handleCardClick}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Full-Screen Drink Details */}
        {selectedDrink ? (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            <DrinkDetails drink={selectedDrink} onBack={handleBack} />
          </div>
        ) : (
          <>
            {/* Bottom padding for cart button */}
            <div className={`${cart && cart.length > 0 ? "pb-24" : "pb-4"}`}></div>
            <StickyCartButton />
          </>
        )}
      </div>
      
      <FloatingOrderButton />
    </div>
  );
}