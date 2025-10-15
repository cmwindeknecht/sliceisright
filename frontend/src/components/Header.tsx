"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Auth";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-orange-600 from-50% to-red-600 to-50% text-white p-4 flex justify-center items-center relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_0_0_3px_black,_0_0_5px_black]">
      <div className="absolute left-4" >Slice is Right Pizzeria</div>

      <div className="flex gap-4">
        <Link href="/" className={`hover:font-bold ${mounted && pathname === "/" ? "underline" : ""}`}>Home</Link>
        <Link href="/menu" className={`hover:font-bold ${mounted && pathname === "/menu" ? "underline" : ""}`}>Menu</Link>
        <Link href="/contact" className={`hover:font-bold ${mounted && pathname === "/contact" ? "underline" : ""}`}>Contact</Link>
        <Link href="/order" className={`hover:font-bold ${mounted && pathname === "/order" ? "underline" : ""}`}>Current Order</Link>
      </div>

      <div className="flex items-center gap-4 absolute right-4">
        {!user ? (
          <Link href="/login" className={`${pathname === "/login" ? "underline" : ""} hover:font-bold`}>Login</Link>
        ) : (
          <>
            <Link href="/account" className="hover:outline-1">
              <div className="flex items-center flex-col">
                <div className="text-3xl">🍕</div>
                <div className="text-xs"> {user.email.split('@')[0].slice(0, 20)} </div>
              </div>
            </Link>
            <button
              onClick={logout}
              className="bg-orange-600 px-2 py-1 rounded hover:bg-orange-700 outline-1 [text-shadow:_0_0_3px_black,_0_0_5px_black]"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
