"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Auth";

export default function Header() {
  const pathname = usePathname();
  const { jwtToken, logout } = useAuth();

  

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <div>Slice is Right Pizzeria</div>

      <div className="flex gap-4">
        <Link href="/" className={pathname === "/" ? "underline" : ""}>Home</Link>
        <Link href="/menu" className={pathname === "/menu" ? "underline" : ""}>Menu</Link>
        <Link href="/contact" className={pathname === "/contact" ? "underline" : ""}>Contact</Link>
        <Link href="/order" className={pathname === "/order" ? "underline" : ""}>Current Order</Link>
      </div>

      <div className="flex items-center gap-4">
        {!jwtToken ? (
          <Link href="/login" className={pathname === "/login" ? "underline" : ""}>Login</Link>
        ) : (
          <>
            <button
              onClick={logout}
              className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
            <Link href="/account">
              <img
                src="/window.svg" 
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
