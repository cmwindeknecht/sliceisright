"use client"

import { useAuth } from "@/components/Auth";
import { useMenu } from "@/components/Menu";
import { Ingredient } from "@/types/Ingredient";
import { MenuItem } from "@/types/MenuItem";
import { useEffect, useState } from "react";
import AddUpdateMenuItem from "./AddUpdateMenuItem";
import AddUpdateIngredient from "./AddUpdateIngredient";

export interface AdminMenuItemProps {
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  setTempMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setTempIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export default function AdminMenuPage() {
  const { user } = useAuth();
  const { getMenuItems, getIngredients } = useMenu();

  const [tempMenuItems, setTempMenuItems] = useState<MenuItem[]>([]);
  const [tempIngredients, setTempIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    (async () => {
      const menuResponse = await getMenuItems();
      if (menuResponse.menuItems != null) {
        setTempMenuItems(menuResponse.menuItems);
      }
      
      const ingredientsResponse = await getIngredients();
      if (ingredientsResponse.ingredients != null) {
        setTempIngredients(ingredientsResponse.ingredients);
      }
    })();
  }, []);
  
  return (
    <div>
      {user == null || !user.isAdmin ? 
      <h1> Forbidden</h1>
      :
      <div >
        <h1 className="text-3xl font-bold text-center m-5">Admin Menu</h1>
        {/* TODO Dropdown to choose whether creating OR updating menu item, creating OR updating ingredient */}
        <div className="flex flex-row justify-between">
          <AddUpdateMenuItem ingredients={tempIngredients} menuItems={tempMenuItems} setTempMenuItems={setTempMenuItems} setTempIngredients={setTempIngredients}/>
          <AddUpdateIngredient ingredients={tempIngredients} menuItems={tempMenuItems} setTempMenuItems={setTempMenuItems} setTempIngredients={setTempIngredients}/>
        </div>
        {tempMenuItems && tempMenuItems.length > 0 && (
          <div>
          <h1 className="text-2x1 font-bold">Menu Items</h1>
          {tempMenuItems.map(menuItem => 
          <div key={Math.random()}>
            {/* TODO Create MenuItem component that is the same as the one in the actual menu 
            - or extends the actual menu and includes shit like can be modified, the menu item id, etc */}
            {menuItem.name} 
          </div>
          )}
          </div>
        )}
        {tempIngredients && tempIngredients.length > 0 && (
          <div>
          <h1 className="text-2x1 font-bold">Ingredients</h1>
          {tempIngredients.map(ingredient => 
          <div key={Math.random()}>
            {/* TODO Create MenuItem component that is the same as the one in the actual menu 
            - or extends the actual menu and includes shit like can be modified, the menu item id, etc */}
            {ingredient.name} 
          </div>
          )}
          </div>
        )}
      </div>
      }
    </div>
  );
}