"use client"

import { useAuth } from "@/components/Auth";
import { useMenu } from "@/components/Menu";
import { Ingredient } from "@/types/Ingredient";
import { MenuItem } from "@/types/MenuItem";
import { useEffect, useState } from "react";
import AddMenuItem from "./AddMenuItem";

export default function AdminMenuPage() {
  const { user } = useAuth();
  const { getMenuItems, getIngredients } = useMenu();

  const [tempMenu, setTempMenu] = useState<MenuItem[] | null>(null);
  const [tempIngredients, setTempIngredients] = useState<Ingredient[] | null>(null);

  useEffect(() => {
    (async () => {
      const menuResponse = await getMenuItems();
      setTempMenu(menuResponse.menuItems ?? null);
      const ingredientsResponse = await getIngredients();
      console.log('availableIngredients =', ingredientsResponse.ingredients);
      setTempIngredients(ingredientsResponse.ingredients ?? null);
    })();
  }, []);
  
  return (
    <div>
      {user == null || !user.isAdmin ? 
      <h1> Forbidden</h1>
      :
      <div>
        <h1 className="text-3xl font-bold">Admin Menu</h1>
        <AddMenuItem availableIngredients={tempIngredients}/>
        <div>
          <h2 className="text-2xl font-bold">Add/Update Ingredient</h2> 
        </div>
      </div>
      }
    </div>
  );
}