"use client";

import { useMenu } from "@/components/Menu";
import { useEffect } from "react";

export default function MenuPage() {
  const { getMenuItems, menuItems } = useMenu();

  useEffect(() => {
    (async () => {
      await getMenuItems();
    })();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">MenuPage {menuItems?.length}</h1>
    </div>
  );
}
