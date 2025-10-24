"use client";

import { useMenu } from "@/components/context/Menu";
import { useEffect, useState } from "react";
import MenuItem from "@/components/MenuItem";

export default function MenuPage() {
  const { getMenuItems, menuItems, getIngredients, ingredients } = useMenu();

  useEffect(() => {
    (async () => {
      await getMenuItems();
      await getIngredients();
    })();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-center mt-5">Menu</h1>
      <div>
        {menuItems.length > 0 &&
          ingredients.length > 0 &&
          menuItems?.map((menuItem) => (
            <MenuItem
              key={menuItem.name + menuItem.id}
              menuItem={menuItem}
              allIngredients={ingredients}
            />
          ))}
      </div>
    </div>
  );
}
