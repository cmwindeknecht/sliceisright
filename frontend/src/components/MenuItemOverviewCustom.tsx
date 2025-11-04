"use client";

import { useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType, OrderItem } from "@/types/MenuItem";
import clsx from "clsx";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import { useMenu } from "./context/Menu";
import { sortMenuSize } from "@/misc/helper";
import { Minus, Plus } from "lucide-react";
import PlusMinus from "./PlusMinus";

export interface MenuItemOverviewCustomProps {
  menuItem: MenuItemType;
  setMenuItemToCustomize: React.Dispatch<React.SetStateAction<MenuItemType | null>>;
}

export default function MenuItemOverviewCustom({
  menuItem,
  setMenuItemToCustomize,
}: MenuItemOverviewCustomProps) {
  const { addOrderItem } = useMenu();

  const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem | null>(null);
  const [added, setAdded] = useState<Map<MenuItemSize, number>>(new Map());
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | null>(null);

  const increaseOrderItemQuantity = () => {
    setAdded((prev) => {
      if (selectedSize == null) {
        return prev;
      }

      const newMap = new Map(prev);
      const currentCount = newMap.get(selectedSize) || 0;
      newMap.set(selectedSize, currentCount + 1);
      return newMap;
    });
  };

  const decreaseOrderItemQuantity = () => {
    setAdded((prev) => {
      if (selectedSize == null) {
        return prev;
      }

      const newMap = new Map(prev);
      const currentCount = newMap.get(selectedSize) || 0;
      newMap.set(selectedSize, currentCount - 1);
      return newMap;
    });
  };

  return (
    <div
      className={clsx(
        "h-100 flex flex-col items-center justify-center rounded outline-4 outline-black"
      )}
    >
      <OverlayImageWithFadeIn
        menuItemName={menuItem.name}
        wrapperClass="flex-shrink-0 cursor-pointer h-1/2 w-full"
      />
      <div className="h-1/2 w-full flex flex-col items-center">
        <div className="h-1/8 w-full bg-orange-600 p-1 font-bold">{menuItem.name}</div>
        <div className="h-9/16 w-full bg-orange-400 p-1 text-sm">{menuItem.description || " "}</div>
        <div className="h-5/16 w-full bg-orange-600 flex flex-col items-end gap-2">
          <div className="flex flex-col w-full justify-between items-center h-full">
            {sortMenuSize(menuItem.sizes).map((menuItemSize) => (
              <div
                key={menuItem.id + menuItemSize.size}
                onClick={() => setSelectedSize(menuItemSize)}
                className={clsx(
                  "text-black px-1 rounded flex flex-row items-center justify-between gap-2"
                )}
              >
                {menuItemSize.size === "NONE"
                  ? `$${menuItemSize.price.toFixed(2)}`
                  : `${menuItemSize.size} - $${menuItemSize.price.toFixed(2)}`}
              </div>
            ))}
            <button
              onClick={() => setMenuItemToCustomize(menuItem)}
              className={clsx(
                "bg-red-600 hover:bg-orange-700 text-white flex items-center justify-center w-1/3 h-6 outline-1 outline-black rounded disabled:opacity-50 px-1"
              )}
            >
              Customize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
