"use client"; // Allows for usePathname to be called by rendering client side

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
            <div> Slice is Right Pizzeria</div>

            <div className="flex gap-4">
                <Link href="/" className={pathname === "/" ? "underline" : ""}>Home</Link>
                <Link href="/menu" className={pathname === "/menu" ? "underline" : ""}>Menu</Link>
                <Link href="/contact" className={pathname === "/contact" ? "underline" : ""}>Contact</Link>
                <Link href="/order" className={pathname === "/order" ? "underline" : ""}>Current Order</Link>
            </div>

            <div>
                <Link href="/login" className={pathname === "/login" ? "underline" : ""}>Login</Link>
            </div>

        </header>
    );
}