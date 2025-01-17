"use client";

import { useAuth } from "../../AuthProvider";  // Adjust the path as necessary
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const { firebaseUser } = useAuth(); // Use `firebaseUser` from the context

  return (
    <main className="text-center">
      <h1 className="font-bold text-center mb-5">
        How to Add One-Time Password Phone Authentication
      </h1>

      {firebaseUser ? (
        <h2>Welcome to the App, logged in as User: {firebaseUser?.uid}</h2>
      ) : (
        <h2>You are not logged in</h2>
      )}

      {firebaseUser ? (
        <Button onClick={() => signOut(auth)} className="mt-10">
          Sign Out
        </Button>
      ) : (
        <Link href="/otp">
          <Button className="mt-10">Sign In</Button>
        </Link>
      )}
    </main>
  );
}
