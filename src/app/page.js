"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CategorySelector from "./components/CategorySelector";
import DrinkDetails from "./components/DrinkDetails";
import StickyCartButton from "./components/StickyCartButton";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart } = useCart();
  const [drinks, setDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch("/api/drinks");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch drinks: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        setDrinks(data);
      } catch (error) {
        console.error("Error fetching drinks:", error);
      }
    };

    fetchDrinks();
  }, []);

  useEffect(() => {
    const userRole = session?.user?.role;

    if (userRole === 'admin') {
      router.push('/admin');
    } else if (userRole === 'shopOwner') {
      router.push('/shop-owner');
    } else if (userRole === 'staff') {
      router.push('/staff');
    }
  }, [session, router]);

  const userName = session?.user?.username || session?.user?.name || 'Customer';

  const handleCardClick = (drink) => {
    setScrollPosition(window.scrollY);
    setSelectedDrink(drink);
  };

  const handleBack = () => {
    setSelectedDrink(null);
    window.scrollTo(0, scrollPosition);
  };

  const handleCategoryChange = (categoryIndex) => {
    setActiveCategory(categoryIndex);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <div>
          {`Hello, ${userName}`}
        </div>
        <Link href="/account">
          <Image
            src={'/user_icon.png'}
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full border-solid border-primary border-2"
          />
        </Link>
      </div>

      <div className="flex-1">
        <div className="mt-6 px-6">
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
            {/* Spacer or Padding to Allow Scrolling */}
            <div className={`p-12 ${cart && cart.length > 0 ? 'pb-24' : ''}`}></div>
            {/* Sticky Cart Button */}
            <StickyCartButton />
          </>
        )}
      </div>
    </div>
  );
}