"use client";

import { MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";

export interface MenuItemOverviewCustomizeProps {
  menuItem: MenuItemType;
  setMenuItemToCustomize: React.Dispatch<React.SetStateAction<MenuItemType | null>>;
}

export default function MenuItemOverviewCustomize({
  menuItem,
  setMenuItemToCustomize,
}: MenuItemOverviewCustomizeProps) {
  return (
    <div className={clsx("flex flex-row w-full justify-center items-center gap-2 my-2")}>
      <button
        onClick={() => setMenuItemToCustomize(menuItem)}
        className={clsx(
          "bg-red-600 hover:bg-orange-700 text-white flex items-center justify-center outline-1 outline-black rounded disabled:opacity-50 px-1"
        )}
      >
        Customize
      </button>
    </div>
  );
}
