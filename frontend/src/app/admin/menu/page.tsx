"use client";

import { useAuth } from "@/components/context/Auth";
import { useMenu } from "@/components/context/Menu";
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
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminMenuPage() {
  const { user, validateAdminPriveleges } = useAuth();
  const { getMenuItems, getIngredients, menuItems, ingredients } = useMenu();
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    validateAdminPriveleges();
    reloadMenu();
  }, []);

  useEffect(() => {
    if (reload) {
      reloadMenu();
    }
  }, [reload]);

  const reloadMenu = async () => {
    setReload(false);
    await getMenuItems();
    await getIngredients();
  };

  return (
    <div>
      {user == null || !user.isAdmin ? (
        <h1> Forbidden</h1>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center m-5">Admin Menu</h1>
          <div className="flex flex-row justify-between">
            <AddUpdateMenuItem
              ingredients={ingredients}
              menuItems={menuItems}
              setReload={setReload}
            />
            <AddUpdateIngredient
              ingredients={ingredients}
              menuItems={menuItems}
              setReload={setReload}
            />
          </div>
          {/* Menu Items */}
          {menuItems && menuItems.length > 0 && (
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold text-center mb-4">Menu Items</h1>
              <div className="flex flex-wrap justify-between gap-4">
                {menuItems.map((menuItem) => (
                  <MenuItemAdmin key={menuItem.id} menuItem={menuItem} />
                ))}
              </div>
            </div>
          )}
          {ingredients && ingredients.length > 0 && (
            <div className="flex flex-col justify-between">
              <h1 className="text-2xl font-bold text-center mb-4">Ingredients</h1>
              <div className="flex flex-wrap justify-center gap-4">
                {ingredients.map((ingredient) => (
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
