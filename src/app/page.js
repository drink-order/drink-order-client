"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SearchBar from "./components/SearchBar";
import CategorySelector from "./components/CategorySelector";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/data")
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));
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
        {/* Search Bar */}
        <div className="flex justify-center px-6">
          <SearchBar className="w-full max-w-3xl" />
        </div>

        {/* Category Selector */}
        <div className="mt-6 px-6">
          <CategorySelector categories={categories} />
        </div>

        {/* Spacer or Padding to Allow Scrolling */}
        <div className="p-12"></div>
      </div>

    </div>
  );
}