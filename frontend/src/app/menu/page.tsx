"use client";

import { useMenu } from "@/components/context/Menu";
import MenuItem from "@/components/MenuItem";
import { useEffect } from "react";

export default function MenuPage() {
  const { menuItems, ingredients } = useMenu();

  useEffect(() => {}, [menuItems]);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-center mt-5">Menu</h1>
      <div>
        {menuItems
          ?.filter((menuItem) => menuItem.isAvailable)
          .map((menuItem) => (
            <MenuItem
              key={menuItem.name + menuItem.id}
              menuItem={menuItem}
              ingredients={ingredients}
            />
          ))}
      </div>
    </div>
  );
}
