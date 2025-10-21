"use client";

import { useAuth } from "@/components/Auth";
import { useMenu } from "@/components/Menu";
import { Ingredient } from "@/types/Ingredient";
import { MenuItem } from "@/types/MenuItem";
import { useEffect, useState } from "react";
import AddUpdateMenuItem from "./AddUpdateMenuItem";
import AddUpdateIngredient from "./AddUpdateIngredient";
import MenuItemAdmin from "@/components/MenuItemAdmin";
import IngredientAdmin from "@/components/IngredientAdmin";

export interface UpdateMenuProps {
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  setTempMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setTempIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setShouldFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminMenuPage() {
  const { user } = useAuth();
  const { getMenuItems, getIngredients } = useMenu();

  const [tempMenuItems, setTempMenuItems] = useState<MenuItem[]>([]);
  const [tempIngredients, setTempIngredients] = useState<Ingredient[]>([]);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  useEffect(() => {
    setShouldFetch(true);
  }, []);

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
  }, [shouldFetch]);

  return (
    <div>
      {user == null || !user.isAdmin ? (
        <h1> Forbidden</h1>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center m-5">Admin Menu</h1>
          {/* TODO Dropdown to choose whether creating OR updating menu item, creating OR updating ingredient */}
          <div className="flex flex-row justify-between">
            <AddUpdateMenuItem
              ingredients={tempIngredients}
              menuItems={tempMenuItems}
              setTempMenuItems={setTempMenuItems}
              setTempIngredients={setTempIngredients}
              setShouldFetch={setShouldFetch}
            />
            <AddUpdateIngredient
              ingredients={tempIngredients}
              menuItems={tempMenuItems}
              setTempMenuItems={setTempMenuItems}
              setTempIngredients={setTempIngredients}
              setShouldFetch={setShouldFetch}
            />
          </div>
          {/* Menu Items */}
          {tempMenuItems && tempMenuItems.length > 0 && (
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold text-center mb-4">Menu Items</h1>
              <div className="flex flex-wrap justify-between gap-4">
                {tempMenuItems.map((menuItem) => (
                  <MenuItemAdmin key={menuItem.id} menuItem={menuItem} />
                ))}
              </div>
            </div>
          )}
          {tempIngredients && tempIngredients.length > 0 && (
            <div className="flex flex-col justify-between">
              <h1 className="text-2xl font-bold text-center mb-4">Ingredients</h1>
              <div className="flex flex-wrap justify-between gap-4 m-5">
                {tempIngredients.map((ingredient) => (
                  <IngredientAdmin key={ingredient.id} ingredient={ingredient} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
