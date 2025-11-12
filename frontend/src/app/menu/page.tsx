"use client";

import { useMenu } from "@/components/context/Menu";
import { sortMenuItemsByCategory } from "@/misc/helper";
import { MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";
import { useEffect, useState } from "react";
import MenuItemCustomize from "@/app/menu/MenuItemCustomize";
import MenuItemOverview from "@/app/menu/MenuItemOverview";

export default function MenuPage() {
  const { menuItems, ingredients, getMenuItems, getIngredients } = useMenu();
  const [categorizedMenu, setCategorizedMenu] = useState<
    Map<MenuItemType["category"], MenuItemType[]>
  >(new Map());
  const [menuItemToCustomize, setMenuItemToCustomize] = useState<MenuItemType | null>(null);

  const categories = new Map<MenuItemType["category"], string>([
    ["DEALS", "Current Deals"],
    ["APPETIZERS", "Tasty Appetizers"],
    ["PIZZAS", "Signature Pizzas"],
    ["SUBS", "Specialty Subs"],
    ["DESSERTS", "Sweet Treats"],
    ["BEVERAGES", "Cool Drinks"],
  ]);
  const categoryOrder = Array.from(categories.keys());

  useEffect(() => {
    getMenuItems();
    getIngredients();
  }, []);

  useEffect(() => {
    categorizeMenuItems();
  }, [menuItems, ingredients]);

  const categorizeMenuItems = () => {
    const categorized = new Map<MenuItemType["category"], MenuItemType[]>();

    menuItems.forEach((menuItem) => {
      if (!categorized.has(menuItem.category)) {
        categorized.set(menuItem.category, []);
      }
      categorized.get(menuItem.category)!.push(menuItem);
    });
    setCategorizedMenu(categorized);
  };

  return (
    <div className="m-3">
      {menuItemToCustomize ? (
        <div>
          <button
            onClick={() => setMenuItemToCustomize(null)}
            className=" bg-orange-600 text-white p-2 mb-3 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Return to Menu
          </button>
          <MenuItemCustomize
            menuItem={menuItemToCustomize}
            ingredients={ingredients}
            returnToMenu={setMenuItemToCustomize}
          />
        </div>
      ) : (
        <div>
          {[...categorizedMenu.entries()]
            .sort(([a], [b]) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b))
            .map(([category, menuItems]) => (
              <div key={category}>
                <div className="text-center text-3xl m-3">{categories.get(category)}</div>
                <div className={clsx("grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4")}>
                  {sortMenuItemsByCategory(menuItems)
                    .filter((menuItem) => menuItem.isAvailable)
                    .map((menuItem) => (
                      <MenuItemOverview
                        key={menuItem.id}
                        setMenuItemToCustomize={setMenuItemToCustomize}
                        menuItem={menuItem}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
