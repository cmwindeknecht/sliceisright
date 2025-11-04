"use client";

import { useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import { useMenu } from "./context/Menu";
import { sortMenuSize } from "@/misc/helper";
import { Minus, Plus } from "lucide-react";

export interface MenuItemOverviewProps {
  menuItem: MenuItemType;
  setMenuItemToCustomize: React.Dispatch<React.SetStateAction<MenuItemType | null>>;
}

export default function MenuItemOverview({
  menuItem,
  setMenuItemToCustomize,
}: MenuItemOverviewProps) {
  const { addOrderItem } = useMenu();

  const [added, setAdded] = useState<Map<MenuItemSize, number>>(new Map());
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | null>(null);

  const increaseAdded = () => {
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

  const decreaseAdded = () => {
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
        <div className="h-1/8 w-full bg-orange-600 p-1">{menuItem.name}</div>
        <div className="h-4/8 w-full bg-orange-400 p-1 text-sm">{menuItem.description || " "}</div>
        <div className="h-3/8 w-full bg-orange-600 flex flex-col items-end gap-2">
          {menuItem.isCustomizable ? (
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
                  "bg-red-600 hover:bg-orange-700 text-white flex items-center justify-center w-1/3 h-10 outline-1 outline-black rounded disabled:opacity-50 px-1"
                )}
              >
                Customize
              </button>
            </div>
          ) : (
            <div className="flex flex-col w-full justify-between items-center h-full">
              <div className="flex flex-row w-full justify-center items-center gap-2">
                {sortMenuSize(menuItem.sizes).map((menuItemSize) => (
                  <button
                    key={menuItem.id + menuItemSize.size}
                    onClick={() => setSelectedSize(menuItemSize)}
                    className={clsx(
                      selectedSize && selectedSize.size == menuItemSize.size
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-orange-600 hover:bg-orange-700",
                      "outline-1 outline-black text-white px-1 rounded"
                    )}
                  >
                    {menuItemSize.size === "NONE"
                      ? `$${menuItemSize.price.toFixed(2)}`
                      : `${menuItemSize.size} - $${menuItemSize.price.toFixed(2)}`}
                  </button>
                ))}
              </div>
              <div className={clsx("flex flex-row w-full justify-center items-center gap-2")}>
                {!selectedSize || (selectedSize && (added.get(selectedSize) || 0) <= 0) ? (
                  <button
                    onClick={() => increaseAdded()}
                    disabled={selectedSize == null}
                    title={!selectedSize ? "Select a size first" : ""}
                    className={clsx(
                      selectedSize
                        ? "bg-red-600 hover:bg-orange-700 text-white"
                        : "bg-gray-200 text-black",
                      "flex items-center justify-center w-1/3 h-10 outline-1 outline-black rounded disabled:opacity-50 px-1"
                    )}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex flex-row justify-between w-1/3">
                    <button
                      onClick={() => decreaseAdded()}
                      className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <span className="text-white font-bold text-2xl">
                      {selectedSize ? added.get(selectedSize) || 0 : 0}
                    </span>
                    <button
                      onClick={() => increaseAdded()}
                      className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
