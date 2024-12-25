"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SearchBar from "./components/SearchBar";
import CategorySelector from "./components/CategorySelector";
import StickyCartButton from "./components/StickyCartButton";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <div>Hello, Thona</div>
        <Image
          src="/drink.png"
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full border-solid border-primary border-2"
        />
      </div>

      {/* Search Bar */}
      <div className="flex justify-center px-6">
        <SearchBar className="w-full max-w-3xl" />
      </div>

      {/* Category Selector */}
      <div className="mt-6 px-6">
        <CategorySelector categories={categories} />
      </div>
    </div>
  );
}