"use client";

import { useState } from "react";
import { MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";
import { useMenu } from "./context/Menu";
import { Minus, Plus } from "lucide-react";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";

export interface MenuItemOverviewSimpleProps {
  menuItem: MenuItemType;
}

export default function MenuItemOverviewSimple({ menuItem }: MenuItemOverviewSimpleProps) {
  const { addOrderItem } = useMenu();

  const [added, setAdded] = useState<number>(0);

  return (
    <div
      className={clsx(
        "h-60 flex flex-col items-center justify-center rounded outline-4 outline-black"
      )}
    >
      <div className="h-full w-full flex flex-col items-center">
        <OverlayImageWithFadeIn
          imageUrl={menuItem.imageUrl}
          menuItemName={menuItem.name}
          wrapperClass="flex-shrink-0 cursor-pointer h-1/2 w-full"
        />
        <div className="h-3/16 w-full bg-orange-600 p-1">{menuItem.name}</div>
        <div className="h-1/16 w-full bg-orange-400 p-1 text-sm" />
        <div className="h-5/8 w-full bg-orange-600 flex flex-col items-center justify-end gap-2">
          <div
            onClick={() => setAdded((prev) => prev + 1)}
            className={clsx(
              "text-black px-1 rounded flex flex-row items-center justify-between gap-2"
            )}
          >
            ${menuItem.sizes[0].price.toFixed(2)}
          </div>
          <div className={clsx("flex flex-row w-full justify-center items-center gap-2")}>
            {added <= 0 ? (
              <button
                onClick={() => setAdded((prev) => prev + 1)}
                className={clsx(
                  "bg-red-600 hover:bg-orange-700 text-white",
                  "flex items-center justify-center w-1/2 h-10 outline-1 outline-black rounded disabled:opacity-50 px-1"
                )}
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex flex-row justify-between w-1/3">
                <button
                  onClick={() => setAdded((prev) => prev - 1)}
                  className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="text-white font-bold text-2xl">{added}</span>
                <button
                  onClick={() => setAdded((prev) => prev + 1)}
                  className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
