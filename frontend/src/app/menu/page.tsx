"use client";

import { useMenu } from "@/components/Menu";
import { useEffect } from "react";

export default function MenuPage() {
  const {getMenuItems, getIngredients} = useMenu();

  useEffect(() => {
    (async () => {
      await getMenuItems();
      await getIngredients();
    })();
  }, []);
  
  return (
    <div>
      <h1 className="text-3xl font-bold">MenuPage</h1>
    </div>
  );
}