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
        {/* TODO Dropdown to choose whether creating OR updating menu item, creating OR updating ingredient */}
        <AddMenuItem availableIngredients={tempIngredients} setTempMenu={setTempMenu}/>
        {tempMenu?.length && tempMenu.map(menuItem => 
          <div>
            {/* TODO Create MenuItem component that is the same as the one in the actual menu 
            - or extends the actual menu and includes shit like can be modified, the menu item id, etc */}
            {menuItem.name} 
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">Update Ingredient</h2> 
        </div>
        {tempIngredients?.length && tempIngredients.map(ingredient => 
          <div>
            {/* TODO Create Ingredient component that is the same as the one in the actual menu 
            - or extends the actual menu and includes shit like can be doubled, the ingredient id, etc */}
            {ingredient.name}
          </div>
        )}
      </div>
      }
    </div>
  );
}