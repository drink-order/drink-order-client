"use client";
import { signOut } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';

const Signout = () => {
  return (
    <button className="bg-red-500 text-white rounded-md px-6 py-2 shadow-md " onClick={() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/sign-in`
    }) }>
        Sign Out
    </button>
  )
}

export default Signout