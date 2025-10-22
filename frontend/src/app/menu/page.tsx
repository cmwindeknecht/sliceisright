"use client";

import { useMenu } from "@/components/Menu";
import { useEffect, useState } from "react";
import MenuItem from "@/components/MenuItem";

export default function MenuPage() {
  const { getMenuItems, menuItems } = useMenu();

  useEffect(() => {
    (async () => {
      await getMenuItems();
    })();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold">Menu</h1>
      <div>
        {menuItems?.map((menuItem) => (
          <MenuItem key={menuItem.name + menuItem.id} menuItem={menuItem} />
        ))}
      </div>
    </div>
  );
}
