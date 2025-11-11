"use client";

import { useEffect, useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";
import { sortMenuSize } from "@/misc/helper";

export interface MenuItemOverviewSizesProps {
  menuItem: MenuItemType;
}

export default function MenuItemOverviewSizes({ menuItem }: MenuItemOverviewSizesProps) {
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | null>(null);

  useEffect(() => {
    const size: MenuItemSize | undefined = sortMenuSize(menuItem.sizes).shift();

    if (!size) {
      throw new Error("No sizes are avaialble in menu item passed to MenuItemOverviewSize");
    }

    setSelectedSize(size);
  }, []);

  return (
    <div className="flex flex-row w-full justify-center items-center gap-2 my-2">
      {sortMenuSize(menuItem.sizes).map((menuItemSize) => (
        <button
          key={menuItem.id + menuItemSize.size}
          onClick={() => setSelectedSize(menuItemSize)}
          className={clsx(
            selectedSize && selectedSize.size == menuItemSize.size
              ? "bg-red-600 hover:bg-red-700 outline-2 outline-green-700"
              : "bg-gray-600 hover:bg-orange-700",
            "outline-1 outline-black text-white px-1 rounded, text-sm"
          )}
        >
          {menuItemSize.size === "NONE"
            ? `$${menuItemSize.price.toFixed(2)}`
            : `${menuItemSize.size} - $${menuItemSize.price.toFixed(2)}`}
        </button>
      ))}
    </div>
  );
}
