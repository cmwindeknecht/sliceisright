"use client";

import { useAuth } from "@/components/context/Auth";
import { useMenu } from "@/components/context/Menu";
import { Ingredient } from "@/types/Ingredient";
import { MenuItem } from "@/types/MenuItem";
import { useEffect, useState } from "react";
import AddUpdateMenuItem from "./AddUpdateMenuItem";
import AddUpdateIngredient from "./AddUpdateIngredient";
import MenuItemAdmin from "@/app/admin/menu/MenuItemAdmin";
import IngredientAdmin from "@/app/admin/menu/IngredientAdmin";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface UpdateMenuProps {
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminMenuPage() {
  const { user, validateAdminPriveleges } = useAuth();
  const { getMenuItems, getIngredients, menuItems, ingredients } = useMenu();
  const [reload, setReload] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

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
          <div className="text-3xl font-bold text-center m-5">Admin Menu</div>
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

          {menuItems?.length > 0 && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex items-center gap-2 text-2xl font-bold mb-4 focus:outline-none"
              >
                <span>Menu Items</span>
                {showMenu ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {showMenu && (
                <div className="flex flex-wrap justify-between gap-4">
                  {menuItems
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((menuItem) => (
                      <MenuItemAdmin key={menuItem.id} menuItem={menuItem} />
                    ))}
                </div>
              )}
            </div>
          )}

          {ingredients?.length > 0 && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowIngredients((prev) => !prev)}
                className="flex items-center gap-2 text-2xl font-bold mb-4 focus:outline-none"
              >
                <span>Ingredients</span>
                {showIngredients ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {showIngredients && (
                <div className="flex flex-wrap justify-center gap-4">
                  {ingredients
                    .sort((a, b) => {
                      const nameCompare = a.name.localeCompare(b.name);
                      if (nameCompare !== 0) return nameCompare;
                      return a.menuItemCategory.localeCompare(b.menuItemCategory);
                    })
                    .map((ingredient) => (
                      <IngredientAdmin key={ingredient.id} ingredient={ingredient} />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
