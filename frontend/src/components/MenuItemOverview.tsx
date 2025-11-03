"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";

export interface MenuItemOverviewProps {
  menuItem: MenuItemType;
}

export default function MenuItemOverview({ menuItem }: MenuItemOverviewProps) {
  return (
    <div
      className={clsx(
        "h-50 flex flex-col items-center justify-center rounded outline-4 outline-black"
      )}
    >
      <OverlayImageWithFadeIn
        menuItemName={menuItem.name}
        wrapperClass="flex-shrink-0 cursor-pointer h-1/2 w-full"
        useOverlay={false}
      />
      <div className="h-1/2 w-full flex flex-col items-center">
        <div className="h-1/4 w-full bg-orange-600 p-1">{menuItem.name}</div>
        <div className="h-1/2 w-full bg-orange-400 p-1">{menuItem.description || " "}</div>
        <div className="h-1/4 w-full bg-orange-600 flex items-center justify-center gap-2">
          {Array.from(menuItem.sizes).map((menuItemSize) => (
            <div key={menuItem.id + menuItemSize.size}>
              {menuItemSize.size === "NONE"
                ? `$${menuItemSize.price.toFixed(2)}`
                : `${menuItemSize.size} - $${menuItemSize.price.toFixed(2)}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
