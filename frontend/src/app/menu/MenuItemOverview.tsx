"use client";

import { MenuItemSize, MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";
import OverlayImageWithFadeIn from "../../components/OverlayImageWithFadeIn";
import MenuItemOverviewSizes from "./MenuItemOverviewSizes";
import MenuItemOverviewAddToCart from "./MenuItemOverviewAddToCart";
import MenuItemOverviewCustomize from "./MenuItemOverviewCustomize";
import { useState } from "react";
import { sortMenuSize } from "@/misc/helper";

export interface MenuItemOverviewCustomProps {
  menuItem: MenuItemType;
  setMenuItemToCustomize: React.Dispatch<React.SetStateAction<MenuItemType | null>>;
}

export default function MenuItemOverview({
  menuItem,
  setMenuItemToCustomize,
}: MenuItemOverviewCustomProps) {
  const initialSize = sortMenuSize(menuItem.sizes)[0];
  if (!initialSize) {
    throw new Error("No Size on Menu Item!");
  }

  const [selectedSize, setSelectedSize] = useState<MenuItemSize | null>(initialSize);

  const showSizes = () => menuItem.sizes.length > 1 && !menuItem.isCustomizable;
  const showAddToCart = () => !menuItem.isCustomizable;
  const showCustomize = () => menuItem.isCustomizable;

  return (
    <div
      className={clsx(
        "w-[250px] flex flex-col items-center justify-between rounded outline-2 outline-black bg-orange-600"
      )}
    >
      <div className="flex justify-center w-full">
        <OverlayImageWithFadeIn
          itemName={menuItem.name}
          wrapperClass="flex-shrink-0 cursor-pointer w-3/4"
        />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full p-1 font-bold">{menuItem.name}</div>
        <div className="w-full bg-orange-400 p-1 text-sm">{menuItem.description || " "}</div>
        {showSizes() && (
          <MenuItemOverviewSizes
            menuItem={menuItem}
            setSelectedSize={setSelectedSize}
            selectedSize={selectedSize}
          />
        )}
        {showAddToCart() && (
          <MenuItemOverviewAddToCart menuItem={menuItem} selectedSize={selectedSize} />
        )}
        {showCustomize() && (
          <MenuItemOverviewCustomize
            menuItem={menuItem}
            setMenuItemToCustomize={setMenuItemToCustomize}
          />
        )}
      </div>
    </div>
  );
}
