"use client";

import { useMenu } from "@/components/context/Menu";
import MenuItem from "@/components/MenuItem";
import MenuItemOverview from "@/components/MenuItemOverview";
import { MenuItem as MenuItemType } from "@/types/MenuItem";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const { menuItems, ingredients, getMenuItems, getIngredients } = useMenu();
  const [categorizedMenu, setCategorizedMenu] = useState<
    Map<MenuItemType["category"], MenuItemType[]>
  >(new Map());
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);

  const categories = new Map<MenuItemType["category"], string>([
    ["PIZZA", "Signature Pizzas"],
    ["ITEMS", "Specialty Items"],
    ["DESSERTS", "Sweet Treats"],
    ["BEVERAGES", "Cool Drinks"],
    ["DEALS", "Current Deals"],
  ]);

  useEffect(() => {
    getMenuItems();
    getIngredients();
  }, []);

  useEffect(() => {
    categorizeMenuItems();
  }, [menuItems]);
  useEffect(() => {
    categorizeMenuItems();
  }, [ingredients]);

  const categorizeMenuItems = () => {
    const categorized = new Map<MenuItemType["category"], MenuItemType[]>();

    menuItems.forEach((menuItem) => {
      if (!categorized.has(menuItem.category)) {
        categorized.set(menuItem.category, []);
      }

      // Get the array and push the item into it
      categorized.get(menuItem.category)!.push(menuItem);
    });
    setCategorizedMenu(categorized);
  };

  return (
    <div className="m-3">
      {selectedMenuItem ? (
        <div>
          <button
            onClick={() => setSelectedMenuItem(null)}
            className=" bg-orange-600 text-white p-2 mb-3 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Return to Menu
          </button>
          <MenuItem menuItem={selectedMenuItem} ingredients={ingredients} />
        </div>
      ) : (
        <div>
          {[...categorizedMenu.entries()].map(([category, menuItems]) => (
            <div key={category}>
              <div className="text-center text-3xl m-3">{categories.get(category)}</div>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {menuItems
                  .filter((menuItem) => menuItem.isAvailable)
                  .map((menuItem) => (
                    <div
                      key={menuItem.name + menuItem.id}
                      onClick={() => setSelectedMenuItem(menuItem)}
                    >
                      <MenuItemOverview menuItem={menuItem} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
